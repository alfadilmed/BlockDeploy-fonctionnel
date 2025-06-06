import { Controller, Get, Param, NotFoundException, InternalServerErrorException, Req, UseGuards } from '@nestjs/common';
import { ContractQueryService } from '../../../services/blockchain/contract-query.service';
import { DeploymentDataService, ContractDatabaseInfo } from '../services/deployment-data.service';
import { ContractDetailsResponseDto, OnChainContractData } from '../dtos/contract-details.dto';
// import { AuthGuard } from '@nestjs/passport'; // Supposer un AuthGuard global ou spécifique

// Helper pour URL de l'explorateur de blocs (simplifié)
function getBlockExplorerUrl(network: string, address: string): string {
  // Ceci devrait être plus robuste et configurable
  switch (network.toLowerCase()) {
    case 'sepolia':
      return `https://sepolia.etherscan.io/address/${address}`;
    case 'mainnet': // Ethereum Mainnet
      return `https://etherscan.io/address/${address}`;
    case 'mumbai':
      return `https://mumbai.polygonscan.com/address/${address}`;
    case 'polygon':
      return `https://polygonscan.com/address/${address}`;
    default:
      return '';
  }
}

@Controller('api/v1/contracts')
// @UseGuards(AuthGuard('jwt')) // Exemple de sécurisation
export class ContractDetailsController {
  constructor(
    private readonly contractQueryService: ContractQueryService,
    private readonly deploymentDataService: DeploymentDataService,
  ) {}

  @Get(':network/:address/details')
  async getContractDetails(
    @Param('network') network: string,
    @Param('address') address: string,
    @Req() req: any, // Pour obtenir l'userId, ex: req.user.id via AuthGuard
  ): Promise<ContractDetailsResponseDto> {
    // Simuler un userId pour l'exemple, en production il viendrait du token JWT / session
    const MOCK_USER_ID = 'user-123';
    const dbInfo = await this.deploymentDataService.findByAddress(network, address, MOCK_USER_ID /* req.user.id */);

    if (!dbInfo) {
      throw new NotFoundException(`Contract not found or access denied at ${address} on ${network}.`);
    }

    const onChainData: OnChainContractData = {};

    try {
      if (dbInfo.contractType.toUpperCase().includes('ERC20')) {
        onChainData.name = await this.contractQueryService.getName(network, address);
        onChainData.symbol = await this.contractQueryService.getSymbol(network, address);
        onChainData.decimals = await this.contractQueryService.getDecimals(network, address);
        onChainData.totalSupply = await this.contractQueryService.getTotalSupply(network, address);
        if (dbInfo.isPausable) { // On se base sur l'info de la DB pour savoir si on doit appeler isPaused
            onChainData.isPaused = await this.contractQueryService.isPaused(network, address);
        }
        if (dbInfo.isCapped) { // Idem pour cap
            onChainData.cap = await this.contractQueryService.getCap(network, address);
        }
      } else if (dbInfo.contractType.toUpperCase().includes('ERC721')) {
        onChainData.name = await this.contractQueryService.getNameERC721(network, address);
        onChainData.symbol = await this.contractQueryService.getSymbolERC721(network, address);
        // totalSupply pour ERC721MVP est omis comme décidé en L5-M1.1
        onChainData.supportsEIP2981 = await this.contractQueryService.supportsEIP2981(network, address);
        if (dbInfo.isPausable) {
             onChainData.isPaused = await this.contractQueryService.isPaused(network, address); // isPaused peut être commun
        }
        // Les infos de royalty par défaut sont déjà dans dbInfo.defaultRoyaltyReceiver/FractionBps
      }
    } catch (error) {
      // Les erreurs du ContractQueryService sont déjà loggées.
      // On pourrait ajouter un champ d'erreur partiel à la réponse si certaines données on-chain échouent.
      // Pour l'instant, on continue et on retourne ce qu'on a pu obtenir.
      console.error(`Partial error fetching on-chain data for ${address}: ${error.message}`);
    }

    return {
      databaseInfo: dbInfo,
      onChainData,
      blockExplorerUrl: getBlockExplorerUrl(network, address),
    };
  }
}
