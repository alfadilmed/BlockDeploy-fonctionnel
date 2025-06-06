import { Test, TestingModule } from '@nestjs/testing';
import { ContractQueryService } from './contract-query.service';
import { ProviderService } from './provider.service';
import { ethers } from 'ethers';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

// Mock ethers.Contract
const mockContract = {
  name: jest.fn(),
  symbol: jest.fn(),
  decimals: jest.fn(),
  totalSupply: jest.fn(),
  paused: jest.fn(),
  cap: jest.fn(),
  supportsInterface: jest.fn(),
  // Pour simuler une fonction inexistante
  nonExistentFunction: undefined,
};

// Mock ProviderService
const mockProviderService = {
  getProvider: jest.fn().mockReturnValue({
    // Simule un provider ethers qui peut instancier un contrat
    // Pas besoin de simuler les appels RPC ici, car ContractQueryService utilise ethers.Contract
  }),
};

// Mock ethers.utils.isAddress
jest.mock('ethers', () => {
  const originalEthers = jest.requireActual('ethers');
  return {
    ...originalEthers,
    Contract: jest.fn(() => mockContract), // Mock l'instance de Contract
    utils: {
      ...originalEthers.utils,
      isAddress: jest.fn().mockReturnValue(true), // Assume valid address par défaut
    },
  };
});


describe('ContractQueryService', () => {
  let service: ContractQueryService;
  let providerService: ProviderService;

  beforeEach(async () => {
    // Réinitialiser les mocks pour chaque test
    jest.clearAllMocks();
    (ethers.utils.isAddress as jest.Mock).mockReturnValue(true); // Default a valid address

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractQueryService,
        { provide: ProviderService, useValue: mockProviderService },
      ],
    }).compile();

    service = module.get<ContractQueryService>(ContractQueryService);
    providerService = module.get<ProviderService>(ProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('readContractFunction', () => {
    it('should call a contract function and return its result', async () => {
      mockContract.name.mockResolvedValue('TestToken');
      const result = await service.readContractFunction('sepolia', '0x123', [], 'name');
      expect(result).toEqual('TestToken');
      expect(mockContract.name).toHaveBeenCalled();
    });

    it('should return null if function does not exist on contract instance', async () => {
      // Simuler que la fonction n'est pas sur l'objet mockContract
      const result = await service.readContractFunction('sepolia', '0x123', [], 'nonExistentFunctionOnInstance');
      expect(result).toBeNull();
    });

    it('should return null if contract call reverts (simulated by ethers.Contract throwing)', async () => {
      mockContract.symbol.mockRejectedValue(new Error('call revert exception')); // Simuler une réversion
      const result = await service.readContractFunction('sepolia', '0x123', [], 'symbol');
      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      mockContract.decimals.mockRejectedValue(new Error('Network error')); // Autre type d'erreur
      await expect(
        service.readContractFunction('sepolia', '0x123', [], 'decimals')
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw if address is invalid', async () => {
        (ethers.utils.isAddress as jest.Mock).mockReturnValue(false);
        await expect(
            service.readContractFunction('sepolia', 'invalidAddress', [], 'name')
        ).rejects.toThrow('Invalid contract address: invalidAddress');
    });
  });

  // --- Tests pour les méthodes spécifiques (getName, getSymbol, etc.) ---
  describe('ERC20 methods', () => {
    it('getName should call readContractFunction with "name"', async () => {
      jest.spyOn(service, 'readContractFunction');
      await service.getName('sepolia', '0x123');
      expect(service.readContractFunction).toHaveBeenCalledWith('sepolia', '0x123', expect.any(Array), 'name');
    });
    // ... Autres tests similaires pour getSymbol, getDecimals, getTotalSupply, isPaused, getCap
     it('getDecimals should return number or null', async () => {
      mockContract.decimals.mockResolvedValue(18);
      let result = await service.getDecimals('sepolia', '0x123');
      expect(result).toBe(18);

      mockContract.decimals.mockResolvedValue('not a number'); // cas invalide
      result = await service.getDecimals('sepolia', '0x123');
      expect(result).toBeNull();
    });

    it('isPaused should return boolean or null', async () => {
      mockContract.paused.mockResolvedValue(true);
      let result = await service.isPaused('sepolia', '0x123');
      expect(result).toBe(true);

      mockContract.paused.mockResolvedValue(undefined); // non-boolean
      result = await service.isPaused('sepolia', '0x123');
      expect(result).toBeNull();
    });
  });

  describe('ERC721 methods', () => {
    it('supportsEIP2981 should call readContractFunction with "supportsInterface" and EIP2981_INTERFACE_ID', async () => {
      jest.spyOn(service, 'readContractFunction');
      await service.supportsEIP2981('sepolia', '0xabc');
      expect(service.readContractFunction).toHaveBeenCalledWith('sepolia', '0xabc', expect.any(Array), 'supportsInterface', ['0x2a55205a']);
    });
  });
});
