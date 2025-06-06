import { Module } from '@nestjs/common';
import { ContractDetailsController } from './controllers/contract-details.controller';
import { DeploymentDataService } from './services/deployment-data.service';
// Import ContractQueryService et ProviderService s'ils ne sont pas globaux
// Pour cet exemple, on suppose qu'ils sont fournis par AppModule ou un module global partagé.
// Si ContractQueryService devait être spécifique à ce module, il faudrait l'importer et le provider ici
// et probablement ProviderService aussi ou un BlockchainCoreModule.
// import { ContractQueryService } from '../../services/blockchain/contract-query.service';
// import { ProviderService } from '../../services/blockchain/provider.service';

@Module({
  controllers: [ContractDetailsController],
  providers: [
    DeploymentDataService,
    // ContractQueryService, // Si importé localement
    // ProviderService,      // Si importé localement
  ],
  // imports: [], // Si on avait un BlockchainCoreModule à importer
})
export class ContractsModule {}
