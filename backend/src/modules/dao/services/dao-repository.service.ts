import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers'; // AJOUT DE L'IMPORT MANQUANT

export interface DaoRecord {
  id?: string; // UUID, auto-généré par la DB
  name: string;
  network: string;
  address: string;
  version?: string; // Version du contrat Safe
  singletonAddress?: string;
  factoryAddress?: string;
  owners: string[];
  threshold: number;
  creatorUserId: string;
  deploymentTxHash: string;
  saltNonce?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class DaoRepositoryService {
  private readonly logger = new Logger(DaoRepositoryService.name);
  private mockDb: DaoRecord[] = []; // Simule la table en mémoire

  async saveDaoDetails(daoData: Omit<DaoRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<DaoRecord> {
    this.logger.log(\`Saving DAO details to DB: \${JSON.stringify(daoData)}\`);
    const newRecord: DaoRecord = {
      id: ethers.utils.hexlify(ethers.utils.randomBytes(16)), // Simule un UUID
      ...daoData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockDb.push(newRecord);
    this.logger.log(\`DAO saved with ID: \${newRecord.id}. Total DAOs in mock DB: \${this.mockDb.length}\`);
    return newRecord;
  }

  // Ajouter d'autres méthodes de repository si nécessaire (findByAddress, findByUserId, etc.)
  async findByAddress(network: string, address: string): Promise<DaoRecord | null> {
    const found = this.mockDb.find(d => d.network === network && d.address.toLowerCase() === address.toLowerCase());
    return found || null;
  }
}
