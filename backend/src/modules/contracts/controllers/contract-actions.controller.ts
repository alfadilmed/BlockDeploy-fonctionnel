import {
  Controller,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ContractInteractionService } from '../../../services/blockchain/contract-interaction.service';
import { ContractQueryService } from '../../../services/blockchain/contract-query.service'; // Pour les vérifications d'état préalables
// import { AuthGuard } from '@nestjs/passport'; // Supposons un AuthGuard global
import { MintRequestDto } from '../dtos/mint-request.dto';
import { NftMintRequestDto } from '../dtos/nft-mint-request.dto';

// Placeholder pour AuthGuard si non global
const AuthGuard = (strategy: string) => UseGuards();

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export interface ActionResponse { // Exporté pour être potentiellement réutilisé/typé dans les tests
  success: boolean;
  transactionHash?: string;
  message: string;
}

@Controller('api/v1/contracts')
@UseGuards(AuthGuard('jwt'))
export class ContractActionsController {
  private readonly logger = new Logger(ContractActionsController.name);

  constructor(
    private readonly contractInteractionService: ContractInteractionService,
    private readonly contractQueryService: ContractQueryService, // Injecté pour les vérifications
  ) {}

  @Post(':network/:address/erc20/pause')
  @HttpCode(HttpStatus.OK)
  async pauseContract(
    @Param('network') network: string,
    @Param('address') address: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ActionResponse> {
    const userId = req.user?.id;
    if (!userId) {
      this.logger.error('UserId not found in request after AuthGuard for pause action.');
      throw new InternalServerErrorException('Authentication error: User ID missing.');
    }
    this.logger.log(\`User \${userId} requesting to PAUSE contract \${address} on \${network}\`);

    // Vérification préalable optionnelle: contrat déjà en pause?
    const isAlreadyPaused = await this.contractQueryService.isPaused(network, address);
    if (isAlreadyPaused === true) {
      this.logger.warn(\`Contract \${address} is already paused. User: \${userId}\`);
      // Retourner une réponse indiquant que l'action n'était pas nécessaire ou une erreur BadRequest
      // Pour être idempotent, on pourrait retourner un succès mais avec un message spécifique.
      // Ou BadRequest pour forcer l'utilisateur à vérifier l'état. Choisissons BadRequest pour l'instant.
      throw new BadRequestException(\`Contract \${address} is already paused.\`);
    }
    if (isAlreadyPaused === null) {
        this.logger.warn(\`Could not determine pause status for \${address} or contract does not support Pausable. User: \${userId}\`);
        // Cela peut arriver si le contrat n'est pas Pausable ou s'il y a eu une erreur RPC.
        // Le ContractInteractionService devrait gérer les droits et la compatibilité de la fonction.
        // On pourrait lancer une BadRequestException ici aussi.
    }

    try {
      const { transactionHash } = await this.contractInteractionService.pause(network, address, userId);
      return {
        success: true,
        transactionHash,
        message: \`Pause action initiated successfully for contract \${address}. Transaction hash: \${transactionHash}\`,
      };
    } catch (error) {
      this.logger.error(\`Error in pauseContract for user \${userId}, contract \${address}: \${error.message}\`, error.stack);
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Failed to initiate pause action.');
    }
  }

  @Post(':network/:address/erc20/unpause')
  @HttpCode(HttpStatus.OK)
  async unpauseContract(
    @Param('network') network: string,
    @Param('address') address: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ActionResponse> {
    const userId = req.user?.id;
    if (!userId) {
      this.logger.error('UserId not found in request after AuthGuard for unpause action.');
      throw new InternalServerErrorException('Authentication error: User ID missing.');
    }
    this.logger.log(\`User \${userId} requesting to UNPAUSE contract \${address} on \${network}\`);

    const isCurrentlyPaused = await this.contractQueryService.isPaused(network, address);
    if (isCurrentlyPaused === false) {
      this.logger.warn(\`Contract \${address} is already unpaused. User: \${userId}\`);
      throw new BadRequestException(\`Contract \${address} is already unpaused (not paused).\`);
    }
     if (isCurrentlyPaused === null) {
        this.logger.warn(\`Could not determine pause status for \${address} or contract does not support Pausable. User: \${userId}\`);
        // Le service d'interaction gérera la tentative.
    }

    try {
      const { transactionHash } = await this.contractInteractionService.unpause(network, address, userId);
      return {
        success: true,
        transactionHash,
        message: \`Unpause action initiated successfully for contract \${address}. Transaction hash: \${transactionHash}\`,
      };
    } catch (error) {
      this.logger.error(\`Error in unpauseContract for user \${userId}, contract \${address}: \${error.message}\`, error.stack);
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Failed to initiate unpause action.');
    }
  }

  @Post(':network/:address/erc20/mint')
  @HttpCode(HttpStatus.OK)
  async mintTokens(
    @Param('network') network: string,
    @Param('address') address: string,
    @Body() mintRequestDto: MintRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ActionResponse> {
    const userId = req.user?.id;
    if (!userId) {
      this.logger.error('UserId not found in request after AuthGuard for mint action.');
      throw new InternalServerErrorException('Authentication error: User ID missing.');
    }
    this.logger.log(
      \`User \${userId} requesting to MINT tokens for contract \${address} on \${network}. ` +
      \`Recipient: \${mintRequestDto.recipient}, Amount: \${mintRequestDto.amount}\`
    );

    // Vérification préalable optionnelle: contrat en pause? Un contrat en pause ne permet généralement pas le mint.
    const isPaused = await this.contractQueryService.isPaused(network, address);
    if (isPaused === true) {
        this.logger.warn(\`Attempt to mint on a PAUSED contract \${address} by user \${userId}.`);
        throw new BadRequestException(\`Cannot mint tokens: contract \${address} is currently paused.\`);
    }

    try {
      const { transactionHash } = await this.contractInteractionService.mint(
        network,
        address,
        mintRequestDto.recipient,
        mintRequestDto.amount,
        userId,
      );
      return {
        success: true,
        transactionHash,
        message: \`Mint action initiated successfully for contract \${address} to \${mintRequestDto.recipient}. Amount: \${mintRequestDto.amount}. Transaction hash: \${transactionHash}\`,
      };
    } catch (error) {
      this.logger.error(\`Error in mintTokens for user \${userId}, contract \${address}: \${error.message}\`, error.stack);
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Failed to initiate mint action.');
    }
  }


}
