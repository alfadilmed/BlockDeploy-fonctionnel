import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsModule } from './modules/contracts/contracts.module';
import { DaoModule } from './modules/dao/dao.module';
import { ProviderService } from './services/blockchain/provider.service';
import { ContractQueryService } from './services/blockchain/contract-query.service';
import { ContractInteractionService } from './services/blockchain/contract-interaction.service';
import { NftIpfsModule } from './modules/nft-ipfs/nft-ipfs.module';

@Module({
  imports: [],
      ContractsModule,
      NftIpfsModule,
  controllers: [AppController],
  providers: [AppService, ProviderService, ContractQueryService, ContractInteractionService],
})
export class AppModule {}
