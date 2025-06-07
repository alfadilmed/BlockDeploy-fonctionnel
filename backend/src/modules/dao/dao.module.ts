import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DaoCreationService } from './services/dao-creation.service';
import { DaoRepositoryService } from './services/dao-repository.service';
import { DaoController } from './controllers/dao.controller'; // Added import

@Module({
  imports: [ConfigModule],
  providers: [
    DaoCreationService,
    DaoRepositoryService, // DaoRepositoryService was already correctly added in L6-M2.3
  ],
  controllers: [DaoController], // Added DaoController here
  exports: [DaoCreationService]
})
export class DaoModule {}
