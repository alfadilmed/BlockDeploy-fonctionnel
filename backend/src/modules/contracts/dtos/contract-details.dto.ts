import { ContractDatabaseInfo } from '../services/deployment-data.service';

export interface OnChainContractData {
  name?: string | null;
  symbol?: string | null;
  decimals?: number | null;          // ERC-20
  totalSupply?: string | null;       // ERC-20
  isPaused?: boolean | null;         // Pausable
  cap?: string | null;               // Capped ERC-20
  supportsEIP2981?: boolean | null;  // ERC-721 (EIP2981)
  // defaultRoyaltyReceiver et defaultRoyaltyFractionBps sont déjà dans ContractDatabaseInfo si récupérés de la DB
}

export class ContractDetailsResponseDto {
  databaseInfo: ContractDatabaseInfo;
  onChainData: OnChainContractData;
  blockExplorerUrl?: string;
}
