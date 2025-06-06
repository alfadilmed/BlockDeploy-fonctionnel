import { Injectable, Logger, NotFoundException, ForbiddenException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ethers, ContractTransaction } from 'ethers';
import { ProviderService } from './provider.service';
import { DeploymentDataService, ContractDatabaseInfo } from '../../modules/contracts/services/deployment-data.service'; // Ajuster le chemin si nécessaire
// import { ContractQueryService } from './contract-query.service'; // Optionnel pour des vérifications préalables

// ABIs partiels pour les actions. En pratique, on pourrait utiliser des ABIs plus complets ou spécifiques au type de contrat.
const PAUSABLE_ABI = [
  'function pause()',
  'function unpause()',
  'function owner() view returns (address)', // Pour vérifier Ownable
  'function paused() view returns (bool)',
];

const MINTABLE_ERC20_ABI = [
  'function mint(address to, uint256 amount)',
  'function owner() view returns (address)', // Pour vérifier Ownable
  // Pour ERC20Advanced avec AccessControl (si on voulait vérifier les rôles)
  // 'function MINTER_ROLE() view returns (bytes32)',
  // 'function hasRole(bytes32 role, address account) view returns (bool)',
];

@Injectable()
export class ContractInteractionService {
  private readonly logger = new Logger(ContractInteractionService.name);

  constructor(
    private readonly providerService: ProviderService,
    private readonly deploymentDataService: DeploymentDataService,
    // private readonly contractQueryService: ContractQueryService, // Si besoin de vérifications
  ) {}

  private async getSignerAndContract(
    network: string,
    contractAddress: string,
    abi: any[],
    userId: string, // Pour vérifier la propriété/permission via BlockDeploy DB
  ): Promise<{ contract: ethers.Contract; dbInfo: ContractDatabaseInfo; signerAddress: string }> {
    const dbInfo = await this.deploymentDataService.findByAddress(network, contractAddress, userId);
    if (!dbInfo) {
      throw new NotFoundException(`Contract not found at ${contractAddress} on ${network} for user ${userId}, or user does not have permission.`);
    }

    // Simplification: On assume que le 'userId' de BlockDeploy est le "propriétaire" logique.
    // La vraie vérification des droits on-chain (owner, roles) se fait par le contrat lui-même
    // lorsque la transaction est envoyée par le signer du backend.
    // Ce signer backend DOIT être l'adresse qui a les droits sur le contrat (ex: initialAdmin, owner).

    const signer = await this.providerService.getSigner(network);
    if (!signer) {
        throw new InternalServerErrorException(`Could not get a signer for network ${network}.`);
    }
    const signerAddress = await signer.getAddress();
    this.logger.log(`Signer address for ${network}: ${signerAddress}`);

    if (!ethers.utils.isAddress(contractAddress)) {
        this.logger.error(`Invalid contract address provided: ${contractAddress}`);
        throw new BadRequestException(`Invalid contract address: ${contractAddress}`);
    }
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return { contract, dbInfo, signerAddress };
  }

  async pause(network: string, contractAddress: string, userId: string): Promise<{ transactionHash: string }> {
    this.logger.log(`Attempting to pause contract ${contractAddress} on ${network} by user ${userId}`);
    const { contract, dbInfo } = await this.getSignerAndContract(network, contractAddress, PAUSABLE_ABI, userId);

    if (!dbInfo.isPausable) { // Vérification basée sur la config de déploiement
        throw new BadRequestException(`Contract ${dbInfo.userGivenName} (${contractAddress}) was not configured as pausable.`);
    }

    // Optionnel: Vérifier si déjà en pause pour éviter une transaction inutile
    // const isAlreadyPaused = await this.contractQueryService.isPaused(network, contractAddress);
    // if (isAlreadyPaused === true) {
    //   throw new BadRequestException('Contract is already paused.');
    // }

    try {
      const tx: ContractTransaction = await contract.pause();
      this.logger.log(`Pause transaction sent for ${contractAddress}. Hash: ${tx.hash}`);
      // Optionnel: attendre la confirmation
      // await tx.wait();
      // this.logger.log(`Pause transaction confirmed for ${contractAddress}. Hash: ${tx.hash}`);
      return { transactionHash: tx.hash };
    } catch (error) {
      this.logger.error(`Error pausing contract ${contractAddress}: ${error.message}`, error.stack);
      // TODO: Mieux typer les erreurs ethers.js pour des messages plus clairs
      throw new InternalServerErrorException(`Failed to pause contract: ${error.reason || error.message}`);
    }
  }

  async unpause(network: string, contractAddress: string, userId: string): Promise<{ transactionHash: string }> {
    this.logger.log(`Attempting to unpause contract ${contractAddress} on ${network} by user ${userId}`);
    const { contract, dbInfo } = await this.getSignerAndContract(network, contractAddress, PAUSABLE_ABI, userId);

     if (!dbInfo.isPausable) {
        throw new BadRequestException(`Contract ${dbInfo.userGivenName} (${contractAddress}) was not configured as pausable.`);
    }

    // Optionnel: Vérifier si déjà unpaused
    // const isCurrentlyPaused = await this.contractQueryService.isPaused(network, contractAddress);
    // if (isCurrentlyPaused === false) {
    //   throw new BadRequestException('Contract is not paused.');
    // }

    try {
      const tx: ContractTransaction = await contract.unpause();
      this.logger.log(`Unpause transaction sent for ${contractAddress}. Hash: ${tx.hash}`);
      return { transactionHash: tx.hash };
    } catch (error) {
      this.logger.error(`Error unpausing contract ${contractAddress}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to unpause contract: ${error.reason || error.message}`);
    }
  }

  async mint(
    network: string,
    contractAddress: string,
    recipient: string,
    amount: string, // Montant en plus petite unité (string pour BigNumber)
    userId: string,
  ): Promise<{ transactionHash: string }> {
    this.logger.log(`Attempting to mint ${amount} tokens for ${recipient} from ${contractAddress} on ${network} by user ${userId}`);
    if (!ethers.utils.isAddress(recipient)) {
        throw new BadRequestException('Invalid recipient address for minting.');
    }
    try {
        ethers.BigNumber.from(amount); // Valider que 'amount' est un nombre valide pour BigNumber
        if (ethers.BigNumber.from(amount).isNegative()) {
            throw new Error('Amount cannot be negative.');
        }
    } catch (e) {
        throw new BadRequestException('Invalid amount for minting. Must be a positive integer string.');
    }

    const { contract, dbInfo } = await this.getSignerAndContract(network, contractAddress, MINTABLE_ERC20_ABI, userId);

    // Vérifier si le contrat est Capped (nécessaire pour ERC20Advanced) ou si c'est un ERC20MVP qui a une fonction mint (qui est par défaut pour capped)
    // ERC20Advanced.mint() requiert que le contrat soit cappé ET que l'appelant ait MINTER_ROLE.
    // ERC20MVP.mint() requiert que le contrat soit cappé (isCapped flag) ET que l'appelant soit owner.
    // La logique dbInfo.contractType et dbInfo.isCapped pourrait être utilisée ici.
    // Pour l'instant, on se fie au fait que le contrat lui-même révertera si les conditions ne sont pas remplies.

    try {
      const tx: ContractTransaction = await contract.mint(recipient, ethers.BigNumber.from(amount));
      this.logger.log(`Mint transaction sent for ${contractAddress}. Hash: ${tx.hash}`);
      return { transactionHash: tx.hash };
    } catch (error) {
      this.logger.error(`Error minting tokens for ${contractAddress}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to mint tokens: ${error.reason || error.message}`);
    }
  }
}
