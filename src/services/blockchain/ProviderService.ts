import { ethers } from 'ethers';

interface NetworkConfig {
  rpcUrl: string;
  chainId: number;
  name: string;
}

// Configuration initiale pour Sepolia. Ceci pourrait être étendu ou chargé dynamiquement.
const SUPPORTED_NETWORKS: { [key: string]: NetworkConfig } = {
  sepolia: {
    rpcUrl: process.env.SEPOLIA_RPC_URL || '', // Charger depuis les variables d'environnement
    chainId: 11155111, // Chain ID pour Sepolia
    name: 'Sepolia Testnet',
  },
  // D'autres réseaux seront ajoutés ici (Polygon, BSC, etc.)
  // polygon_mumbai: {
  //   rpcUrl: process.env.POLYGON_MUMBAI_RPC_URL || '',
  //   chainId: 80001,
  //   name: 'Polygon Mumbai Testnet',
  // }
};

class ProviderService {
  private providers: Map<string, ethers.JsonRpcProvider | ethers.FallbackProvider> = new Map();

  constructor() {
    // Initialiser les providers pour les réseaux configurés pourrait être fait ici
    // ou de manière lazy lors du premier appel à getProvider.
    // Pour l'instant, nous allons pour une initialisation lazy.
    if (!SUPPORTED_NETWORKS.sepolia.rpcUrl) {
      console.warn('SEPOLIA_RPC_URL is not set in environment variables. Sepolia provider will not be available.');
    }
  }

  /**
   * Récupère un provider JSON-RPC pour le réseau spécifié.
   * Crée et met en cache le provider s'il n'existe pas déjà.
   * @param networkName Le nom du réseau (ex: 'sepolia').
   * @returns Un ethers.JsonRpcProvider ou ethers.FallbackProvider.
   * @throws Error si le nom du réseau n'est pas supporté ou si l'URL RPC n'est pas configurée.
   */
  public getProvider(networkName: string): ethers.JsonRpcProvider | ethers.FallbackProvider {
    if (this.providers.has(networkName)) {
      return this.providers.get(networkName)!;
    }

    const config = SUPPORTED_NETWORKS[networkName];
    if (!config) {
      throw new Error(`Network ${networkName} is not supported.`);
    }

    if (!config.rpcUrl) {
      throw new Error(`RPC URL for ${networkName} is not configured. Please set ${networkName.toUpperCase()}_RPC_URL environment variable.`);
    }

    // Pourrait utiliser FallbackProvider si plusieurs URLs RPC sont disponibles pour la redondance
    // Pour l'instant, un simple JsonRpcProvider.
    // const provider = new ethers.JsonRpcProvider(config.rpcUrl, config.chainId);
    // Pour la compatibilité avec les RPCs qui ne supportent pas la détection de réseau via chainId au constructeur :
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);


    this.providers.set(networkName, provider);
    console.log(`Provider initialized for ${config.name}.`);
    return provider;
  }

  /**
   * Vérifie la connexion à un réseau en récupérant le numéro de bloc actuel.
   * @param networkName Le nom du réseau.
   * @returns Promise<number> Le numéro de bloc actuel.
   * @throws Error si la connexion échoue ou si le réseau n'est pas supporté.
   */
  public async checkConnection(networkName: string): Promise<number> {
    try {
      const provider = this.getProvider(networkName);
      const blockNumber = await provider.getBlockNumber();
      console.log(`Successfully connected to ${networkName}. Current block number: ${blockNumber}`);
      return blockNumber;
    } catch (error) {
      console.error(`Failed to connect to ${networkName}:`, error);
      throw error; // Rethrow l'erreur pour que l'appelant puisse la gérer
    }
  }

  // On pourrait ajouter d'autres méthodes utiles ici, comme :
  // - getSigner(networkName: string, privateKey: string): ethers.Wallet
  // - getConfig(networkName: string): NetworkConfig | undefined
}

// Exporter une instance singleton du service
const providerService = new ProviderService();
export default providerService;

// Exemple d'utilisation (pourrait être dans un autre fichier ou un test)
/*
async function testSepoliaConnection() {
  try {
    // Assurez-vous que SEPOLIA_RPC_URL est défini dans votre .env
    // par exemple: SEPOLIA_RPC_URL=https://rpc.sepolia.org
    // ou une URL d'Alchemy/Infura pour Sepolia
    await providerService.checkConnection('sepolia');
  } catch (error) {
    // Gérer l'erreur
  }
}
// testSepoliaConnection();
*/
