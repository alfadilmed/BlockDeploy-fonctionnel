import { Test, TestingModule } from '@nestjs/testing';
import { ContractActionsController, ActionResponse } from './contract-actions.controller';
import { ContractInteractionService } from '../../../services/blockchain/contract-interaction.service';
import { ContractQueryService } from '../../../services/blockchain/contract-query.service';
import { MintRequestDto } from '../dtos/mint-request.dto';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';

// Mocks pour les services injectés
const mockContractInteractionService = {
  pause: jest.fn(),
  unpause: jest.fn(),
  mint: jest.fn(),
};

const mockContractQueryService = {
  isPaused: jest.fn(),
  // Ajouter d'autres méthodes si le contrôleur les utilise directement pour des vérifications
};

// Simuler la structure de la requête authentifiée
const mockUser = { id: 'user-test-123' };
const mockReq = { user: mockUser };

describe('ContractActionsController', () => {
  let controller: ContractActionsController;
  let interactionService: ContractInteractionService;
  let queryService: ContractQueryService;

  beforeEach(async () => {
    jest.clearAllMocks(); // Très important pour nettoyer les mocks entre les tests

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractActionsController],
      providers: [
        { provide: ContractInteractionService, useValue: mockContractInteractionService },
        { provide: ContractQueryService, useValue: mockContractQueryService },
      ],
    }).compile();

    controller = module.get<ContractActionsController>(ContractActionsController);
    interactionService = module.get<ContractInteractionService>(ContractInteractionService);
    queryService = module.get<ContractQueryService>(ContractQueryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Tests pour PAUSE ---
  describe('pauseContract', () => {
    const network = 'sepolia';
    const address = '0x123';
    const expectedTxHash = '0xPauseHash';

    it('should successfully pause a contract', async () => {
      mockContractQueryService.isPaused.mockResolvedValue(false); // Contrat n'est pas en pause
      mockContractInteractionService.pause.mockResolvedValue({ transactionHash: expectedTxHash });

      const result: ActionResponse = await controller.pauseContract(network, address, mockReq as any);

      expect(mockContractQueryService.isPaused).toHaveBeenCalledWith(network, address);
      expect(interactionService.pause).toHaveBeenCalledWith(network, address, mockUser.id);
      expect(result.success).toBe(true);
      expect(result.transactionHash).toEqual(expectedTxHash);
      expect(result.message).toContain('Pause action initiated successfully');
    });

    it('should throw BadRequestException if contract is already paused', async () => {
      mockContractQueryService.isPaused.mockResolvedValue(true); // Contrat déjà en pause

      await expect(controller.pauseContract(network, address, mockReq as any))
        .rejects.toThrow(new BadRequestException(\`Contract \${address} is already paused.\`));
      expect(interactionService.pause).not.toHaveBeenCalled();
    });

    it('should re-throw known exceptions from interaction service (e.g., NotFoundException)', async () => {
      mockContractQueryService.isPaused.mockResolvedValue(false);
      mockContractInteractionService.pause.mockRejectedValue(new NotFoundException('Contract not found by service'));

      await expect(controller.pauseContract(network, address, mockReq as any))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException for unknown errors from interaction service', async () => {
      mockContractQueryService.isPaused.mockResolvedValue(false);
      mockContractInteractionService.pause.mockRejectedValue(new Error('Some random error'));

      await expect(controller.pauseContract(network, address, mockReq as any))
        .rejects.toThrow(InternalServerErrorException);
    });

     it('should throw InternalServerErrorException if userId is missing (simulating AuthGuard failure)', async () => {
      await expect(controller.pauseContract(network, address, { user: undefined } as any))
        .rejects.toThrow(new InternalServerErrorException('Authentication error: User ID missing.'));
    });
  });

  // --- Tests pour UNPAUSE ---
  describe('unpauseContract', () => {
    const network = 'sepolia';
    const address = '0x456';
    const expectedTxHash = '0xUnpauseHash';

    it('should successfully unpause a contract', async () => {
      mockContractQueryService.isPaused.mockResolvedValue(true); // Contrat est en pause
      mockContractInteractionService.unpause.mockResolvedValue({ transactionHash: expectedTxHash });

      const result: ActionResponse = await controller.unpauseContract(network, address, mockReq as any);

      expect(queryService.isPaused).toHaveBeenCalledWith(network, address);
      expect(interactionService.unpause).toHaveBeenCalledWith(network, address, mockUser.id);
      expect(result.success).toBe(true);
      expect(result.transactionHash).toEqual(expectedTxHash);
      expect(result.message).toContain('Unpause action initiated successfully');
    });

    it('should throw BadRequestException if contract is already unpaused', async () => {
      mockContractQueryService.isPaused.mockResolvedValue(false); // Contrat n'est pas en pause

      await expect(controller.unpauseContract(network, address, mockReq as any))
        .rejects.toThrow(new BadRequestException(\`Contract \${address} is already unpaused (not paused).\`));
      expect(interactionService.unpause).not.toHaveBeenCalled();
    });
    // ... autres tests d'erreur similaires à pause ...
  });

  // --- Tests pour MINT ---
  describe('mintTokens', () => {
    const network = 'sepolia';
    const address = '0x789';
    const mintDto: MintRequestDto = { recipient: '0xRecipient', amount: '1000' };
    const expectedTxHash = '0xMintHash';

    it('should successfully mint tokens', async () => {
      mockContractQueryService.isPaused.mockResolvedValue(false); // Contrat n'est pas en pause
      mockContractInteractionService.mint.mockResolvedValue({ transactionHash: expectedTxHash });

      const result: ActionResponse = await controller.mintTokens(network, address, mintDto, mockReq as any);

      expect(queryService.isPaused).toHaveBeenCalledWith(network, address);
      expect(interactionService.mint).toHaveBeenCalledWith(network, address, mintDto.recipient, mintDto.amount, mockUser.id);
      expect(result.success).toBe(true);
      expect(result.transactionHash).toEqual(expectedTxHash);
      expect(result.message).toContain('Mint action initiated successfully');
    });

    it('should throw BadRequestException if contract is paused before minting', async () => {
      mockContractQueryService.isPaused.mockResolvedValue(true); // Contrat en pause

      await expect(controller.mintTokens(network, address, mintDto, mockReq as any))
        .rejects.toThrow(new BadRequestException(\`Cannot mint tokens: contract \${address} is currently paused.\`));
      expect(interactionService.mint).not.toHaveBeenCalled();
    });

    // Note: La validation du DTO est gérée par ValidationPipe.
    // Les tests ici se concentrent sur la logique du contrôleur après validation.
    // ... autres tests d'erreur similaires à pause ...
  });
});
