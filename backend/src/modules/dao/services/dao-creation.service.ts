import { Injectable, Logger, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { ProviderService } from '../../../services/blockchain/provider.service';
import { DaoCreationRequestDto } from '../dtos/dao-creation-request.dto';
import { DaoRepositoryService, DaoRecord } from './dao-repository.service'; // Importer le nouveau service

interface SafeContractAddresses {
  safeSingletonAddress: string;
  safeProxyFactoryAddress: string;
}

@Injectable()
export class DaoCreationService {
  private readonly logger = new Logger(DaoCreationService.name);

  constructor(
    private readonly providerService: ProviderService,
    private readonly configService: ConfigService,
    private readonly daoRepositoryService: DaoRepositoryService, // Injection
  ) {}

  private getSafeContractAddresses(network: string): SafeContractAddresses {
    const safeSingletonAddress = this.configService.get<string>(\`SAFE_L2_SINGLETON_ADDRESS_\${network.toUpperCase()}\`);
    const safeProxyFactoryAddress = this.configService.get<string>(\`SAFE_PROXY_FACTORY_ADDRESS_\${network.toUpperCase()}\`);

    if (!safeSingletonAddress || !safeProxyFactoryAddress) {
      this.logger.error(\`Safe contract addresses not configured for network: \${network}\`);
      throw new NotFoundException(\`DAO creation is not supported or configured for network: \${network}\`);
    }
    return { safeSingletonAddress, safeProxyFactoryAddress };
  }

  async createDao(
    dto: DaoCreationRequestDto,
    userId: string,
  ): Promise<{ daoAddress: string; transactionHash: string; network: string; daoId: string }> { // Ajout de daoId
    this.logger.log(\`User \${userId} attempting to create DAO '\${dto.name}' on network \${dto.network} with owners: \${dto.owners.join(', ')} and threshold: \${dto.threshold}\`);

    if (dto.threshold <= 0 || dto.threshold > dto.owners.length) {
      throw new BadRequestException('Threshold must be greater than 0 and less than or equal to the number of owners.');
    }

    const { safeSingletonAddress, safeProxyFactoryAddress } = this.getSafeContractAddresses(dto.network);
    this.logger.log(\`Using Safe Singleton: \${safeSingletonAddress}, Factory: \${safeProxyFactoryAddress} for network \${dto.network}\`);

    let tx; // Déclarer tx ici pour qu'il soit accessible dans le bloc catch pour le logging
    let newSafeAddress = '';
    const saltNonce = ethers.utils.hexlify(ethers.utils.randomBytes(32));

    try {
      const signer = await this.providerService.getSigner(dto.network);
      const signerAddress = await signer.getAddress();
      this.logger.log(\`DAO deployment initiated by signer: \${signerAddress}\`);

      const proxyFactoryAbi = ["function createProxyWithNonce(address _singleton, bytes memory initializer, uint256 saltNonce) returns (address)", "event ProxyCreation(address proxy, address singleton)"]; // Ajout de l'event à l'ABI
      const safeSetupAbi = ["function setup(address[] calldata _owners, uint256 _threshold, address to, bytes calldata data, address fallbackHandler, address paymentToken, uint256 payment, address payable paymentReceiver)"];

      const safeInterface = new ethers.utils.Interface(safeSetupAbi);
      const initializerCalldata = safeInterface.encodeFunctionData("setup", [
        dto.owners,
        dto.threshold,
        ethers.constants.AddressZero,
        '0x',
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        0,
        ethers.constants.AddressZero,
      ]);

      const factoryContract = new ethers.Contract(safeProxyFactoryAddress, proxyFactoryAbi, signer);
      this.logger.log(\`Using saltNonce (direct call): \${saltNonce}\`);

      tx = await factoryContract.createProxyWithNonce(safeSingletonAddress, initializerCalldata, saltNonce);
      this.logger.log(\`Proxy deployment transaction sent. Hash: \${tx.hash}, Nonce: \${tx.nonce}\`);

      const receipt = await tx.wait();
      this.logger.log(\`Proxy deployment transaction confirmed. Block: \${receipt.blockNumber}\`);

      if (receipt.events) {
        const proxyCreationEvent = receipt.events.find(event => event.event === 'ProxyCreation');
        if (proxyCreationEvent && proxyCreationEvent.args && proxyCreationEvent.args.proxy) {
          newSafeAddress = proxyCreationEvent.args.proxy;
        } else if (proxyCreationEvent && proxyCreationEvent.args && proxyCreationEvent.args.safe) { // Certains factories nomment l'arg 'safe'
          newSafeAddress = proxyCreationEvent.args.safe;
        }
      }

      if (!newSafeAddress || !ethers.utils.isAddress(newSafeAddress)) { // Vérifier si l'adresse est valide
          this.logger.error("Failed to determine deployed Safe address from ProxyCreation event. Receipt events:", receipt.events);
          throw new InternalServerErrorException("Failed to determine deployed Safe address from transaction receipt.");
      }

      this.logger.log(\`New Safe DAO deployed at address: \${newSafeAddress} by user \${userId}\`);

      // Sauvegarder en DB
      const daoRecordToSave: Omit<DaoRecord, 'id' | 'createdAt' | 'updatedAt'> = {
        name: dto.name,
        network: dto.network,
        address: newSafeAddress,
        // version: "1.3.0", // Exemple, à obtenir dynamiquement ou depuis config si pertinent
        singletonAddress: safeSingletonAddress,
        factoryAddress: safeProxyFactoryAddress,
        owners: dto.owners,
        threshold: dto.threshold,
        creatorUserId: userId,
        deploymentTxHash: tx.hash,
        saltNonce: saltNonce,
      };
      const savedDao = await this.daoRepositoryService.saveDaoDetails(daoRecordToSave);
      this.logger.log(\`DAO details saved to DB with ID: \${savedDao.id}\`);

      return {
        daoAddress: newSafeAddress,
        transactionHash: tx.hash,
        network: dto.network,
        daoId: savedDao.id as string, // Renvoyer l'ID de la DB
      };
    } catch (error) {
      this.logger.error(\`DAO Creation Error for user \${userId} on network \${dto.network} (TxHash: \${tx?.hash}): \${error.message}\`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(\`Failed to create DAO: \${error.reason || error.message}\`);
    }
  }
}
