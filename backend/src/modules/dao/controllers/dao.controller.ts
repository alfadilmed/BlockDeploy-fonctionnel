import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
  InternalServerErrorException, // Ajout pour userId manquant
} from '@nestjs/common';
import { DaoCreationService } from '../services/dao-creation.service';
import { DaoCreationRequestDto } from '../dtos/dao-creation-request.dto';
import { DaoCreationResponseDto } from '../dtos/dao-creation-response.dto';
// import { AuthGuard } from '@nestjs/passport'; // Supposer un AuthGuard global

// Placeholder pour AuthGuard si non global
const AuthGuard = (strategy: string) => UseGuards();

interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Structure attendue de req.user après AuthGuard
}

@Controller('api/v1/dao')
@UseGuards(AuthGuard('jwt')) // Appliquer AuthGuard à toutes les routes de ce contrôleur
export class DaoController {
  private readonly logger = new Logger(DaoController.name);

  constructor(private readonly daoCreationService: DaoCreationService) {}

  @Post('multisig')
  @HttpCode(HttpStatus.CREATED) // 201 pour une création de ressource réussie
  async createDao(
    @Body() daoCreationRequestDto: DaoCreationRequestDto, // ValidationPipe appliqué globalement
    @Req() req: AuthenticatedRequest,
  ): Promise<DaoCreationResponseDto> {
    const userId = req.user?.id;
    if (!userId) {
      this.logger.error('UserId not found in request after AuthGuard for DAO creation.');
      // Normalement, l'AuthGuard devrait empêcher cela, mais une double vérification est sûre.
      throw new InternalServerErrorException('Authentication error: User ID missing.');
    }

    this.logger.log(\`User \${userId} attempting to create DAO with payload: \${JSON.stringify(daoCreationRequestDto)}\`);

    const { daoAddress, transactionHash, network, daoId } = await this.daoCreationService.createDao(
      daoCreationRequestDto,
      userId,
    );

    return {
      success: true,
      daoId,
      daoAddress,
      network,
      deploymentTxHash: transactionHash,
      message: \`DAO '\${daoCreationRequestDto.name}' creation initiated successfully on network '\${network}' at address \${daoAddress}. DAO ID: \${daoId}\`,
    };
  }
}
