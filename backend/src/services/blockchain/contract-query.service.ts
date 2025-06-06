import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ethers } from 'ethers';
import { ProviderService } from './provider.service'; // Supposé exister

// ABIs minimaux pour les fonctions courantes (les vrais ABIs seraient plus complets ou importés)
const ERC20_ABI_MINIMAL = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function paused() view returns (bool)', // Pour Pausable
  'function cap() view returns (uint256)',   // Pour Capped
];

const ERC721_ABI_MINIMAL = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function supportsInterface(bytes4 interfaceId) view returns (bool)',
];

const EIP2981_INTERFACE_ID = '0x2a55205a';

@Injectable()
export class ContractQueryService {
  private readonly logger = new Logger(ContractQueryService.name);

  constructor(private readonly providerService: ProviderService) {}

  private async getContract(
    network: string,
    contractAddress: string,
    abi: any[],
  ): Promise<ethers.Contract> {
    const provider = this.providerService.getProvider(network);
    if (!ethers.utils.isAddress(contractAddress)) {
        this.logger.error(`Invalid contract address: ${contractAddress}`);
        throw new InternalServerErrorException(`Invalid contract address: ${contractAddress}`);
    }
    return new ethers.Contract(contractAddress, abi, provider);
  }

  async readContractFunction(
    network: string,
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[] = [],
  ): Promise<any> {
    this.logger.debug(
      `Reading function ${functionName} from ${contractAddress} on ${network} with args: ${args}`,
    );
    try {
      const contract = await this.getContract(network, contractAddress, abi);
      // Vérifier si la fonction existe sur le contrat pour éviter des erreurs RPC génériques
      if (typeof contract[functionName] !== 'function') {
        this.logger.warn(`Function ${functionName} does not exist on contract ${contractAddress}`);
        return null; // Ou lancer une NotFoundException spécifique
      }
      const result = await contract[functionName](...args);
      return result;
    } catch (error) {
      this.logger.error(
        `Error reading function ${functionName} from ${contractAddress} on ${network}: ${error.message}`,
        error.stack,
      );
      // Ne pas lancer d'exception si la fonction n'existe pas (déjà géré)
      // mais pour d'autres erreurs RPC, on pourrait vouloir être plus spécifique.
      if (error.message.includes('call revert exception') || error.code === 'CALL_EXCEPTION') {
        // Souvent indique que la fonction n'existe pas ou les conditions ne sont pas remplies (require failed)
        // ou le contrat n'existe pas à cette adresse / sur ce réseau.
        this.logger.warn(`Call revert for ${functionName} on ${contractAddress}. Function might not exist or conditions not met.`);
        return null;
      }
      throw new InternalServerErrorException(
        `Failed to read from contract: ${error.message}`,
      );
    }
  }

  // --- ERC20 Specific Methods ---
  async getName(network: string, contractAddress: string): Promise<string | null> {
    return this.readContractFunction(network, contractAddress, ERC20_ABI_MINIMAL, 'name');
  }

  async getSymbol(network: string, contractAddress: string): Promise<string | null> {
    return this.readContractFunction(network, contractAddress, ERC20_ABI_MINIMAL, 'symbol');
  }

  async getDecimals(network: string, contractAddress: string): Promise<number | null> {
    const decimals = await this.readContractFunction(network, contractAddress, ERC20_ABI_MINIMAL, 'decimals');
    return typeof decimals === 'number' ? decimals : null;
  }

  async getTotalSupply(network: string, contractAddress: string): Promise<string | null> {
    const totalSupply = await this.readContractFunction(network, contractAddress, ERC20_ABI_MINIMAL, 'totalSupply');
    return totalSupply ? totalSupply.toString() : null;
  }

  async isPaused(network: string, contractAddress: string): Promise<boolean | null> {
    // Tenter d'appeler 'paused()'. Si la fonction n'existe pas, readContractFunction retournera null.
    const pausedStatus = await this.readContractFunction(network, contractAddress, ERC20_ABI_MINIMAL, 'paused');
    return typeof pausedStatus === 'boolean' ? pausedStatus : null;
  }

  async getCap(network: string, contractAddress: string): Promise<string | null> {
    // Tenter d'appeler 'cap()'.
    const capValue = await this.readContractFunction(network, contractAddress, ERC20_ABI_MINIMAL, 'cap');
    return capValue ? capValue.toString() : null;
  }

  // --- ERC721 Specific Methods ---
  async getNameERC721(network: string, contractAddress: string): Promise<string | null> {
    return this.readContractFunction(network, contractAddress, ERC721_ABI_MINIMAL, 'name');
  }

  async getSymbolERC721(network: string, contractAddress: string): Promise<string | null> {
    return this.readContractFunction(network, contractAddress, ERC721_ABI_MINIMAL, 'symbol');
  }

  async supportsEIP2981(network: string, contractAddress: string): Promise<boolean | null> {
    const supports = await this.readContractFunction(
        network,
        contractAddress,
        ERC721_ABI_MINIMAL, // supportsInterface est dans l'ABI ERC721 de base
        'supportsInterface',
        [EIP2981_INTERFACE_ID]
    );
    return typeof supports === 'boolean' ? supports : null;
  }
}
