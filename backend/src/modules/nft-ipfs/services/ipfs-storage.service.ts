import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data'; // Required for file uploads with axios
// import { ConfigService } from '@nestjs/config'; // Will be used later for API keys

@Injectable()
export class IpfsStorageService {
  private readonly logger = new Logger(IpfsStorageService.name);
  // TODO: Replace with actual API keys from ConfigService
  private readonly pinataApiKey = 'YOUR_PINATA_API_KEY_PLACEHOLDER';
  private readonly pinataSecretApiKey = 'YOUR_PINATA_SECRET_API_KEY_PLACEHOLDER';
  private readonly pinataBaseUrl = 'https://api.pinata.cloud';

  // constructor(private configService: ConfigService) {
  //   this.pinataApiKey = this.configService.get<string>('PINATA_API_KEY');
  //   this.pinataSecretApiKey = this.configService.get<string>('PINATA_SECRET_API_KEY');
  // }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new HttpException('File is required for upload', HttpStatus.BAD_REQUEST);
    }

    const formData = new FormData();
    formData.append('file', file.buffer, { filename: file.originalname });

    const metadata = JSON.stringify({
      name: file.originalname,
      // keyvalues: { exampleKey: 'exampleValue' } // Optional metadata
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0, // Or 1, depending on preference
    });
    formData.append('pinataOptions', options);

    this.logger.log(`Uploading file ${file.originalname} to Pinata...`);

    try {
      const response = await axios.post(
        `${this.pinataBaseUrl}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretApiKey,
          },
        },
      );
      this.logger.log('File uploaded successfully to Pinata:', response.data);
      return response.data.IpfsHash;
    } catch (error) {
      this.logger.error('Error uploading file to Pinata:', error.response?.data || error.message);
      throw new HttpException(
        `Failed to upload file to IPFS: ${error.response?.data?.error || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadJson(jsonData: Record<string, any>): Promise<string> {
    if (!jsonData) {
      throw new HttpException('JSON data is required for upload', HttpStatus.BAD_REQUEST);
    }

    const pinataOptions = JSON.stringify({
      cidVersion: 0, // Or 1
    });
    const pinataMetadata = JSON.stringify({
      name: jsonData.name ? `${jsonData.name}_metadata.json` : 'nft_metadata.json', // Use NFT name if available
      // keyvalues: { exampleKey: 'exampleValue' } // Optional
    });

    const body = {
        pinataContent: jsonData,
        pinataMetadata: JSON.parse(pinataMetadata), // Pinata API expects object here
        pinataOptions: JSON.parse(pinataOptions)     // Pinata API expects object here
    };


    this.logger.log(`Uploading JSON data to Pinata...`);
    try {
      const response = await axios.post(
        `${this.pinataBaseUrl}/pinning/pinJSONToIPFS`,
        body,
        {
          headers: {
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretApiKey,
            'Content-Type': 'application/json'
          },
        },
      );
      this.logger.log('JSON uploaded successfully to Pinata:', response.data);
      return response.data.IpfsHash;
    } catch (error) {
      this.logger.error('Error uploading JSON to Pinata:', error.response?.data || error.message);
      throw new HttpException(
        `Failed to upload JSON to IPFS: ${error.response?.data?.error || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
