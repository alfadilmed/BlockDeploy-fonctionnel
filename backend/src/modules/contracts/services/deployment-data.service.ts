import { Injectable, NotFoundException } from '@nestjs/common';

export interface ContractDatabaseInfo {
  deploymentId: string;
  userId: string; // Pour la vérification des droits
  userGivenName: string;
  contractType: 'ERC20MVP' | 'ERC20Advanced' | 'ERC721MVP' | string; // string pour flexibilité
  deployedAt: string;
  network: string;
  address: string;
  // Infos spécifiques stockées lors du déploiement, ex: pour royalties ERC721MVP
  defaultRoyaltyReceiver?: string;
  defaultRoyaltyFractionBps?: number;
  isPausable?: boolean; // Info de configuration
  isCapped?: boolean;   // Info de configuration
  capValue?: string;    // Stocké si isCapped
}

@Injectable()
export class DeploymentDataService {
  // Simule une base de données
  private mockDeployments: ContractDatabaseInfo[] = [
    {
      deploymentId: 'mock-erc20-adv-001',
      userId: 'user-123',
      userGivenName: 'My Advanced Token',
      contractType: 'ERC20Advanced',
      deployedAt: new Date().toISOString(),
      network: 'sepolia',
      address: '0x1234567890123456789012345678901234567890', // Replace with actual test addresses
      isPausable: true,
      isCapped: true,
      capValue: '2000000000000000000000000',
    },
    {
      deploymentId: 'mock-erc721-mvp-002',
      userId: 'user-123',
      userGivenName: 'My NFT Collection',
      contractType: 'ERC721MVP',
      deployedAt: new Date().toISOString(),
      network: 'sepolia',
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // Replace with actual test addresses
      defaultRoyaltyReceiver: '0x RoyaltyReceiverAddress',
      defaultRoyaltyFractionBps: 500, // 5%
      isPausable: true,
    },
  ];

  async findByAddress(network: string, address: string, userId: string): Promise<ContractDatabaseInfo | null> {
    const contract = this.mockDeployments.find(
      (d) => d.network === network && d.address.toLowerCase() === address.toLowerCase() && d.userId === userId,
    );
    if (!contract) {
      // Ne pas lancer NotFoundException ici, le contrôleur le fera si rien n'est trouvé.
      // Ou alors, le contrôleur doit vérifier si l'utilisateur a le droit de voir un contrat qui existe mais ne lui appartient pas.
      // Pour cet exemple, on assume que si on ne le trouve pas pour cet user, il n'y a pas accès.
      return null;
    }
    return contract;
  }
}
