import { Test, TestingModule } from '@nestjs/testing';
import { ContractDetailsController } from './contract-details.controller';
import { ContractQueryService } from '../../../services/blockchain/contract-query.service';
import { DeploymentDataService, ContractDatabaseInfo } from '../services/deployment-data.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ContractDetailsResponseDto } from '../dtos/contract-details.dto';

const mockContractQueryService = {
  getName: jest.fn(),
  getSymbol: jest.fn(),
  getDecimals: jest.fn(),
  getTotalSupply: jest.fn(),
  isPaused: jest.fn(),
  getCap: jest.fn(),
  getNameERC721: jest.fn(),
  getSymbolERC721: jest.fn(),
  supportsEIP2981: jest.fn(),
};

const mockDeploymentDataService = {
  findByAddress: jest.fn(),
};

const mockReq = { user: { id: 'user-123' } }; // Simuler req.user.id

describe('ContractDetailsController', () => {
  let controller: ContractDetailsController;

  beforeEach(async () => {
    jest.clearAllMocks(); // Nettoyer les mocks avant chaque test

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractDetailsController],
      providers: [
        { provide: ContractQueryService, useValue: mockContractQueryService },
        { provide: DeploymentDataService, useValue: mockDeploymentDataService },
      ],
    }).compile();

    controller = module.get<ContractDetailsController>(ContractDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getContractDetails', () => {
    const network = 'sepolia';
    const address = '0x123';
    const mockDbInfoERC20: ContractDatabaseInfo = {
      deploymentId: '1', userId: 'user-123', userGivenName: 'MyToken',
      contractType: 'ERC20Advanced', deployedAt: 'date', network, address,
      isPausable: true, isCapped: true,
    };
     const mockDbInfoERC721: ContractDatabaseInfo = {
      deploymentId: '2', userId: 'user-123', userGivenName: 'MyNFT',
      contractType: 'ERC721MVP', deployedAt: 'date', network, address: '0xabc',
      isPausable: true, defaultRoyaltyReceiver: '0xdef', defaultRoyaltyFractionBps: 500,
    };


    it('should return combined details for an ERC20 contract', async () => {
      mockDeploymentDataService.findByAddress.mockResolvedValue(mockDbInfoERC20);
      mockContractQueryService.getName.mockResolvedValue('OnChainName');
      mockContractQueryService.getSymbol.mockResolvedValue('OCN');
      mockContractQueryService.getDecimals.mockResolvedValue(18);
      mockContractQueryService.getTotalSupply.mockResolvedValue('1000');
      mockContractQueryService.isPaused.mockResolvedValue(false);
      mockContractQueryService.getCap.mockResolvedValue('2000');

      const result = await controller.getContractDetails(network, address, mockReq);

      expect(result.databaseInfo).toEqual(mockDbInfoERC20);
      expect(result.onChainData.name).toEqual('OnChainName');
      expect(result.onChainData.isPaused).toBe(false);
      expect(mockDeploymentDataService.findByAddress).toHaveBeenCalledWith(network, address, 'user-123');
    });

    it('should return combined details for an ERC721 contract', async () => {
      mockDeploymentDataService.findByAddress.mockResolvedValue(mockDbInfoERC721);
      mockContractQueryService.getNameERC721.mockResolvedValue('OnChainNFTName');
      mockContractQueryService.getSymbolERC721.mockResolvedValue('OCNFT');
      mockContractQueryService.supportsEIP2981.mockResolvedValue(true);
      mockContractQueryService.isPaused.mockResolvedValue(false); // isPaused peut être commun

      const result = await controller.getContractDetails(network, '0xabc', mockReq);

      expect(result.databaseInfo).toEqual(mockDbInfoERC721);
      expect(result.onChainData.name).toEqual('OnChainNFTName');
      expect(result.onChainData.supportsEIP2981).toBe(true);
      expect(result.onChainData.isPaused).toBe(false);
    });

    it('should throw NotFoundException if dbInfo not found', async () => {
      mockDeploymentDataService.findByAddress.mockResolvedValue(null);
      await expect(controller.getContractDetails(network, address, mockReq))
        .rejects.toThrow(NotFoundException);
    });

    it('should handle partial errors from ContractQueryService gracefully', async () => {
      mockDeploymentDataService.findByAddress.mockResolvedValue(mockDbInfoERC20);
      mockContractQueryService.getName.mockResolvedValue('OnChainName');
      mockContractQueryService.getSymbol.mockRejectedValue(new Error('Symbol fetch error')); // Erreur partielle

      const result = await controller.getContractDetails(network, address, mockReq);
      expect(result.databaseInfo).toEqual(mockDbInfoERC20);
      expect(result.onChainData.name).toEqual('OnChainName');
      expect(result.onChainData.symbol).toBeUndefined(); // ou null, selon l'implémentation de gestion d'erreur
    });
  });
});
