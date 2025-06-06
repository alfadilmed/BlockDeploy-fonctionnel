import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NftIpfsModule } from './modules/nft-ipfs/nft-ipfs.module';

@Module({
  imports: [],
      NftIpfsModule,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
