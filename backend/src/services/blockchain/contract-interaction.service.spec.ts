import { Test, TestingModule } from '@nestjs/testing';
import { ContractInteractionService } from './contract-interaction.service';
import { ProviderService } from './provider.service';
import { DeploymentDataService, ContractDatabaseInfo } from '../../modules/contracts/services/deployment-data.service';
import { ethers, ContractTransaction, BigNumber } from 'ethers';
import { NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

// Mock ethers.Contract instance et ses méthodes
const mockContractInstance = {
  pause: jest.fn(),
  unpause: jest.fn(),
  mint: jest.fn(), // Pour ERC20 mint
  safeMintWithId: jest.fn(), // Pour ERC721 mint
};

// Mock ethers.Contract constructor
jest.mock('ethers', () => {
  const originalEthers = jest.requireActual('ethers');
  return {
    ...originalEthers,
    Contract: jest.fn().mockImplementation(() => mockContractInstance),
    utils: { // Assurer que utils est là et isAddress est moqué
        ...originalEthers.utils,
        isAddress: jest.fn().mockReturnValue(true), // Par défaut, valide
    },
    BigNumber: { // Moquer BigNumber.from pour la validation de tokenId et amount
        ...originalEthers.BigNumber,
        from: jest.fn((val) => originalEthers.BigNumber.from(val)) // Appeler le vrai pour la logique
    }
  };
});

// Mock ProviderService
const mockProviderService = {
  getProvider: jest.fn(), // Non utilisé directement par ContractInteractionService, mais par getSigner
  getSigner: jest.fn().mockResolvedValue({ // Mock du signer
    getAddress: jest.fn().mockResolvedValue('0xSignerAddress'),
    // Ajouter d'autres méthodes du signer si nécessaire pour les tests
  }),
};

// Mock DeploymentDataService
const mockDeploymentDataService = {
  findByAddress: jest.fn(),
};


describe('ContractInteractionService', () => {
  let service: ContractInteractionService;
  let providerService: ProviderService;
  let deploymentDataService: DeploymentDataService;

  const MOCK_USER_ID = 'user-interaction-test-123';
  const MOCK_CONTRACT_ADDRESS = '0xContractAddress';
  const MOCK_NETWORK = 'sepolia';
  const MOCK_TX_HASH = '0xTransactionHash';

  const mockErc20DbInfoPausable: ContractDatabaseInfo = {
    deploymentId: 'dpl-erc20p', userId: MOCK_USER_ID, userGivenName: 'MyPausableToken',
    contractType: 'ERC20Advanced', deployedAt: 'date', network: MOCK_NETWORK, address: MOCK_CONTRACT_ADDRESS,
    isPausable: true, isCapped: false,
  };
  const mockErc721DbInfoPausable: ContractDatabaseInfo = {
    deploymentId: 'dpl-erc721p', userId: MOCK_USER_ID, userGivenName: 'MyPausableNFT',
    contractType: 'ERC721MVP', deployedAt: 'date', network: MOCK_NETWORK, address: MOCK_CONTRACT_ADDRESS,
    isPausable: true,
  };


  beforeEach(async () => {
    jest.clearAllMocks(); // Nettoyer tous les mocks
    (ethers.utils.isAddress as jest.Mock).mockReturnValue(true); // Reset isAddress mock

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractInteractionService,
        { provide: ProviderService, useValue: mockProviderService },
        { provide: DeploymentDataService, useValue: mockDeploymentDataService },
      ],
    }).compile();

    service = module.get<ContractInteractionService>(ContractInteractionService);
    providerService = module.get<ProviderService>(ProviderService);
    deploymentDataService = module.get<DeploymentDataService>(DeploymentDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Tests pour getSignerAndContract (méthode privée, testée indirectement) ---
  describe('getSignerAndContract (indirectly tested)', () => {
    it('should throw NotFoundException if contract not found in DB for user', async () => {
      mockDeploymentDataService.findByAddress.mockResolvedValue(null);
      await expect(service.pause(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID))
        .rejects.toThrow(NotFoundException);
    });
     it('should throw BadRequestException if address is invalid in getSignerAndContract', async () => {
        (ethers.utils.isAddress as jest.Mock).mockReturnValue(false);
        // On a besoin d'un dbInfo pour passer la première vérification
        mockDeploymentDataService.findByAddress.mockResolvedValue(mockErc20DbInfoPausable);
        await expect(
            service.pause(MOCK_NETWORK, "invalidAddress", MOCK_USER_ID)
        ).rejects.toThrow(new BadRequestException('Invalid contract address: invalidAddress'));
    });
  });

  // --- Tests pour les actions ERC-20 (déjà existants, on les garde) ---
  describe('ERC20 Actions', () => {
    beforeEach(() => {
        // Assurer que findByAddress retourne une info de contrat ERC20 valide pour ces tests
        mockDeploymentDataService.findByAddress.mockResolvedValue(mockErc20DbInfoPausable);
    });

    // PAUSE ERC20
    describe('pause (ERC20)', () => {
      it('should successfully pause an ERC20 contract', async () => {
        mockContractInstance.pause.mockResolvedValue({ hash: MOCK_TX_HASH } as ContractTransaction);
        const result = await service.pause(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID);
        expect(deploymentDataService.findByAddress).toHaveBeenCalledWith(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID);
        expect(providerService.getSigner).toHaveBeenCalledWith(MOCK_NETWORK);
        expect(mockContractInstance.pause).toHaveBeenCalled();
        expect(result.transactionHash).toEqual(MOCK_TX_HASH);
      });

      it('should throw BadRequestException if ERC20 contract is not pausable via dbInfo', async () => {
        mockDeploymentDataService.findByAddress.mockResolvedValue({ ...mockErc20DbInfoPausable, isPausable: false });
        await expect(service.pause(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID))
          .rejects.toThrow(BadRequestException);
      });

      it('should throw InternalServerErrorException on ERC20 pause transaction error', async () => {
        mockContractInstance.pause.mockRejectedValue(new Error('Blockchain Revert: Pause failed'));
        await expect(service.pause(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID))
          .rejects.toThrow(InternalServerErrorException);
      });
    });

    // UNPAUSE ERC20
    describe('unpause (ERC20)', () => {
       // Tests similaires à pause ERC20
        it('should successfully unpause an ERC20 contract', async () => {
            mockContractInstance.unpause.mockResolvedValue({ hash: MOCK_TX_HASH } as ContractTransaction);
            const result = await service.unpause(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID);
            expect(mockContractInstance.unpause).toHaveBeenCalled();
            expect(result.transactionHash).toEqual(MOCK_TX_HASH);
        });
    });

    // MINT ERC20
    describe('mint (ERC20)', () => {
        const recipient = '0xRecipientAddress';
        const amount = '1000000000000000000'; // 1 token avec 18 décimales

        it('should successfully mint ERC20 tokens', async () => {
            mockContractInstance.mint.mockResolvedValue({ hash: MOCK_TX_HASH } as ContractTransaction);
            const result = await service.mint(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, recipient, amount, MOCK_USER_ID);
            expect(mockContractInstance.mint).toHaveBeenCalledWith(recipient, BigNumber.from(amount));
            expect(result.transactionHash).toEqual(MOCK_TX_HASH);
        });
        it('should throw BadRequestException for invalid recipient address for ERC20 mint', async () => {
            (ethers.utils.isAddress as jest.Mock).mockImplementation((addr) => addr === MOCK_CONTRACT_ADDRESS); // recipient est invalide
            await expect(service.mint(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, 'invalidRecipient', amount, MOCK_USER_ID))
                .rejects.toThrow(new BadRequestException('Invalid recipient address for minting.'));
        });
        it('should throw BadRequestException for invalid amount for ERC20 mint', async () => {
            await expect(service.mint(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, recipient, 'invalidAmount', MOCK_USER_ID))
                .rejects.toThrow(new BadRequestException('Invalid amount for minting. Must be a positive integer string.'));
        });
    });
  });

  // Les nouveaux tests pour ERC-721 seront injectés ici par le script Python

  // --- Tests pour les actions ERC-721 ---
  describe('ERC721 Actions', () => {
    beforeEach(() => {
        // Assurer que findByAddress retourne une info de contrat ERC721 valide pour ces tests
        mockDeploymentDataService.findByAddress.mockResolvedValue(mockErc721DbInfoPausable);
    });

    // PAUSE ERC721
    describe('pauseERC721', () => {
      it('should successfully pause an ERC721 contract', async () => {
        mockContractInstance.pause.mockResolvedValue({ hash: MOCK_TX_HASH } as ContractTransaction);
        const result = await service.pauseERC721(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID);

        expect(deploymentDataService.findByAddress).toHaveBeenCalledWith(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID);
        expect(providerService.getSigner).toHaveBeenCalledWith(MOCK_NETWORK);
        expect(mockContractInstance.pause).toHaveBeenCalled();
        expect(result.transactionHash).toEqual(MOCK_TX_HASH);
      });

      it('should throw BadRequestException if ERC721 contract is not pausable via dbInfo', async () => {
        mockDeploymentDataService.findByAddress.mockResolvedValue({ ...mockErc721DbInfoPausable, isPausable: false });
        await expect(service.pauseERC721(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID))
          .rejects.toThrow(new BadRequestException(\`Contract \${mockErc721DbInfoPausable.userGivenName} (\${MOCK_CONTRACT_ADDRESS}) was not configured as pausable for ERC721.\`));
      });

      it('should throw InternalServerErrorException on ERC721 pause transaction error', async () => {
        mockContractInstance.pause.mockRejectedValue(new Error('Blockchain Revert: ERC721 Pause failed'));
        await expect(service.pauseERC721(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID))
          .rejects.toThrow(InternalServerErrorException);
      });
    });

    // UNPAUSE ERC721
    describe('unpauseERC721', () => {
      it('should successfully unpause an ERC721 contract', async () => {
        mockContractInstance.unpause.mockResolvedValue({ hash: MOCK_TX_HASH } as ContractTransaction);
        const result = await service.unpauseERC721(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, MOCK_USER_ID);
        expect(mockContractInstance.unpause).toHaveBeenCalled();
        expect(result.transactionHash).toEqual(MOCK_TX_HASH);
      });
      // ... autres tests d'erreur pour unpauseERC721
    });

    // MINT NFT (ERC721)
    describe('mintNFT', () => {
        const recipient = '0xNftRecipient';
        const tokenId = '123';
        const tokenURI = 'ipfs://NFTHash';

        it('should successfully mint an NFT', async () => {
            mockContractInstance.safeMintWithId.mockResolvedValue({ hash: MOCK_TX_HASH } as ContractTransaction);
            const result = await service.mintNFT(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, recipient, tokenId, tokenURI, MOCK_USER_ID);
            expect(mockContractInstance.safeMintWithId).toHaveBeenCalledWith(recipient, BigNumber.from(tokenId));
            expect(result.transactionHash).toEqual(MOCK_TX_HASH);
        });

        it('should throw BadRequestException for invalid recipient address for NFT mint', async () => {
            // Pour ce test spécifique, on fait que isAddress retourne false pour le recipient
            (ethers.utils.isAddress as jest.Mock).mockImplementation((addr) => addr === MOCK_CONTRACT_ADDRESS);
            await expect(service.mintNFT(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, 'invalidRecipient', tokenId, tokenURI, MOCK_USER_ID))
                .rejects.toThrow(new BadRequestException('Invalid recipient address for NFT minting.'));
        });

        it('should throw BadRequestException for invalid tokenId for NFT mint (non-numeric)', async () => {
            await expect(service.mintNFT(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, recipient, 'abc', tokenURI, MOCK_USER_ID))
                .rejects.toThrow(new BadRequestException('Invalid TokenID. Must be a positive integer string.'));
        });

        it('should throw BadRequestException for invalid tokenId for NFT mint (negative)', async () => {
             await expect(service.mintNFT(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, recipient, '-5', tokenURI, MOCK_USER_ID))
                .rejects.toThrow(new BadRequestException('Invalid TokenID. Must be a positive integer string.'));
        });

        it('should throw InternalServerErrorException on NFT mint transaction error', async () => {
            mockContractInstance.safeMintWithId.mockRejectedValue(new Error('Blockchain Revert: NFT Mint failed'));
            await expect(service.mintNFT(MOCK_NETWORK, MOCK_CONTRACT_ADDRESS, recipient, tokenId, tokenURI, MOCK_USER_ID))
                .rejects.toThrow(InternalServerErrorException);
        });
    });
  });

});
