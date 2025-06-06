import { Test, TestingModule } from '@nestjs/testing';
import { IpfsStorageService } from './ipfs-storage.service';
import { ConfigService } from '@nestjs/config'; // Mock if used
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as FormData from 'form-data';

jest.mock('axios'); // Mock axios module

describe('IpfsStorageService', () => {
  let service: IpfsStorageService;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpfsStorageService,
        // If you were using ConfigService, you'd mock it here:
        // { provide: ConfigService, useValue: { get: jest.fn((key: string) => {
        //   if (key === 'PINATA_API_KEY') return 'test_api_key';
        //   if (key === 'PINATA_SECRET_API_KEY') return 'test_secret_key';
        //   return null;
        // })} },
      ],
    }).compile();

    service = module.get<IpfsStorageService>(IpfsStorageService);
    // Manually set placeholder keys if not using ConfigService for tests
    (service as any).pinataApiKey = 'test_api_key_placeholder';
    (service as any).pinataSecretApiKey = 'test_secret_api_key_placeholder';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    const mockFile = {
      originalname: 'test.png',
      mimetype: 'image/png',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    it('should successfully upload a file and return IpfsHash', async () => {
      const mockResponse = { data: { IpfsHash: 'QmTestHashFile' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.uploadFile(mockFile);
      expect(result).toEqual('QmTestHashFile');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/pinFileToIPFS'),
        expect.any(FormData), // Check that FormData is used
        expect.any(Object), // Headers
      );
    });

    it('should throw HttpException if file is not provided', async () => {
      await expect(service.uploadFile(null as any)).rejects.toThrowError(
        new HttpException('File is required for upload', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw HttpException on Pinata API error during file upload', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { error: 'Pinata Error' } } });
      await expect(service.uploadFile(mockFile)).rejects.toThrowError(
         new HttpException('Failed to upload file to IPFS: Pinata Error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('uploadJson', () => {
    const mockJsonData = { name: 'Test NFT', description: 'Test Description' };

    it('should successfully upload JSON and return IpfsHash', async () => {
      const mockResponse = { data: { IpfsHash: 'QmTestHashJson' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.uploadJson(mockJsonData);
      expect(result).toEqual('QmTestHashJson');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/pinJSONToIPFS'),
        expect.objectContaining({pinataContent: mockJsonData}),
        expect.any(Object),
      );
    });

    it('should throw HttpException if JSON data is not provided', async () => {
      await expect(service.uploadJson(null as any)).rejects.toThrowError(
         new HttpException('JSON data is required for upload', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw HttpException on Pinata API error during JSON upload', async () => {
      mockedAxios.post.mockRejectedValue({ response: { data: { error: 'Pinata JSON Error' } } });
      await expect(service.uploadJson(mockJsonData)).rejects.toThrowError(
        new HttpException('Failed to upload JSON to IPFS: Pinata JSON Error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
