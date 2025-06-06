import { Module } from '@nestjs/common';
import { NftIpfsController } from './controllers/nft-ipfs.controller';
import { IpfsStorageService } from './services/ipfs-storage.service';

@Module({
  controllers: [NftIpfsController],
  providers: [IpfsStorageService],
})
export class NftIpfsModule {}
