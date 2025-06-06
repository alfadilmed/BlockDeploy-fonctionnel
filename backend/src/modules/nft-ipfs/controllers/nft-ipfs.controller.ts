import { Controller, Post, UploadedFile, UseInterceptors, Body, Res, HttpStatus, Logger, UsePipes, ValidationPipe, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NftUploadDto } from '../dtos/nft-upload.dto';
import { Express } from 'express'; // For Express.Multer.File type
import { Response } from 'express';
import { IpfsStorageService } from '../services/ipfs-storage.service';

@Controller('/api/v1/nft')
export class NftIpfsController {
  private readonly logger = new Logger(NftIpfsController.name);

  constructor(private readonly ipfsStorageService: IpfsStorageService) {}

  @Post('upload-ipfs')
  @UseInterceptors(FileInterceptor('imageFile'))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Enable DTO validation
  async uploadNftData(
    @UploadedFile(
      new ParseFilePipe({ // Add basic file validation (optional but good practice)
        validators: [
          // new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // e.g., 5MB
          // new FileTypeValidator({ fileType: 'image/*' }), // e.g., only images
        ],
        fileIsRequired: true, // Make image file mandatory
      }),
    ) imageFile: Express.Multer.File,
    @Body() nftUploadDto: NftUploadDto,
    @Res() res: Response,
  ) {
    this.logger.log('Received request to upload NFT data and image.');
    this.logger.log('Image file:', imageFile?.originalname, 'Size:', imageFile?.size);
    this.logger.log('NFT DTO:', JSON.stringify(nftUploadDto));

    if (!imageFile) {
      this.logger.warn('No image file provided.');
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Image file is required.' });
    }

    try {
      // 1. Upload image to IPFS
      this.logger.log('Uploading image to IPFS...');
      const imageCID = await this.ipfsStorageService.uploadFile(imageFile);
      this.logger.log('Image uploaded to IPFS. CID:', imageCID);

      // 2. Construct metadata JSON
      const nftMetadata = {
        name: nftUploadDto.name,
        description: nftUploadDto.description,
        image: `ipfs://${imageCID}`, // Format image URI
        attributes: nftUploadDto.attributes || [], // Ensure attributes is an array
      };
      this.logger.log('Constructed NFT metadata:', JSON.stringify(nftMetadata));

      // 3. Upload metadata JSON to IPFS
      this.logger.log('Uploading metadata JSON to IPFS...');
      const metadataCID = await this.ipfsStorageService.uploadJson(nftMetadata);
      this.logger.log('Metadata JSON uploaded to IPFS. CID:', metadataCID);

      // 4. Construct tokenURI
      const tokenURI = `ipfs://${metadataCID}`;
      this.logger.log('Constructed tokenURI:', tokenURI);

      return res.status(HttpStatus.CREATED).json({
        message: 'NFT data and image uploaded successfully to IPFS!',
        tokenURI,
        imageCID,
        metadataCID,
        nftDetails: nftMetadata
      });
    } catch (error) {
      this.logger.error('Error during NFT upload process:', error.message, error.stack);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        message: error.message || 'An unexpected error occurred during NFT upload.',
        error: error.response?.error || error.message
      });
    }
  }
}
