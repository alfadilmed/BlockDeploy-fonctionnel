// Ce fichier définit les interfaces représentant les schémas pour les collections de la base de données.
// Ces interfaces peuvent servir de base pour des modèles Mongoose (MongoDB) ou des entités ORM.

import { DeploymentJobData } from '../../queues/deploymentQueue'; // Pourrait être utilisé pour type `originalJobData`

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserDBSchema {
  _id: string; // ID généré par la base de données (ex: MongoDB ObjectId)
  authId?: string; // ID provenant du fournisseur d'authentification (ex: Firebase UID, Auth0 ID)
  email: string; // Email de l'utilisateur, doit être unique
  hashedPassword?: string; // Si authentification par email/mot de passe gérée en interne
  name?: string; // Nom d'affichage optionnel
  avatarUrl?: string; // URL de l'avatar
  roles: UserRole[]; // Rôles de l'utilisateur (ex: 'user', 'admin')
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;

  // Champs pour le suivi de l'onboarding (Axe 4)
  onboardingState?: {
    tutorialCompleted?: boolean;
    checklist?: {
      connectedWallet?: boolean;
      exploredTemplates?: boolean;
      deployedFirstContract?: boolean;
      consultedAcademy?: boolean;
      [key: string]: boolean | undefined; // Pour d'autres items de checklist
    };
  };

  // Préférences utilisateur (si nécessaire plus tard)
  preferences?: {
    defaultNetwork?: string; // ex: 'sepolia', 'polygon'
    theme?: 'light' | 'dark';
  };
}

export enum DeploymentStatus {
  PENDING = 'pending', // Ajouté à la file d'attente
  PROCESSING = 'processing', // Pris par un worker
  SUCCESS = 'success', // Déploiement réussi
  FAILED = 'failed', // Déploiement échoué
  UNKNOWN = 'unknown', // Statut initial ou indéterminé
}

export interface DeploymentDBSchema {
  _id: string; // ID généré par la base de données
  userId: string; // Référence à UserDBSchema._id
  status: DeploymentStatus;

  // Informations sur le contrat et la configuration demandée
  contractType: string; // ex: 'ERC20', 'NFT_ERC721', 'Custom'
  contractName?: string; // Nom donné par l'utilisateur à cette instance de déploiement
  networkName: string; // Nom du réseau cible (ex: 'sepolia', 'polygon_mumbai')
  chainId: number; // Chain ID du réseau cible

  // Paramètres de configuration spécifiques utilisés pour ce déploiement
  // Cela pourrait être un objet flexible basé sur le type de contrat
  configuration: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  // Exemple pour un ERC20: { tokenName: "MyToken", tokenSymbol: "MTK", initialSupply: "1000000", isPausable: true, ... }

  // Informations résultant du déploiement
  contractAddress?: string; // Adresse du contrat une fois déployé
  transactionHash?: string; // Hash de la transaction de déploiement
  deployerAddress?: string; // Adresse qui a effectivement déployé (wallet serveur)
  gasUsed?: string; // Quantité de gas utilisée (en string pour les grands nombres)
  deploymentTimestamp?: Date; // Quand le statut est passé à SUCCESS

  // Gestion des erreurs
  errorMessage?: string; // Message d'erreur si status est FAILED
  errorDetails?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  // Données du Job de la file d'attente (optionnel, pour débogage ou lien)
  // originalJobData?: DeploymentJobData; // Si on veut stocker l'intégralité du job
  jobId?: string; // ID du job BullMQ

  createdAt: Date; // Quand l'enregistrement de déploiement a été créé
  updatedAt: Date; // Dernière mise à jour de cet enregistrement
}

export interface SmartContractTemplateDBSchema {
  _id: string; // ID généré par la base de données
  templateKey: string; // Clé unique pour identifier le template (ex: 'SimpleERC20_v1', 'StandardNFT_ERC721_v1')
  displayName: string; // Nom affiché à l'utilisateur (ex: "Token ERC-20 Simple", "Collection NFT Standard")
  description: string;
  contractType: 'ERC20' | 'NFT_ERC721' | 'NFT_ERC1155' | 'Custom'; // etc.

  // Pour les contrats pré-compilés
  abi: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  bytecode: string;

  // Pour les contrats générés dynamiquement (si cette approche est utilisée pour certains templates)
  // sourceCodeTemplate?: string; // Modèle de code Solidity (Handlebars, etc.)
  // compilationOptions?: Record<string, any>;

  // Paramètres configurables par l'utilisateur pour ce template
  // Peut-être une structure JSON schema pour valider/générer les formulaires
  configurableParameters?: {
    name: string; // ex: 'tokenName'
    label: string; // ex: 'Nom du Token'
    type: 'string' | 'number' | 'boolean' | 'address';
    defaultValue?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    required?: boolean;
    placeholder?: string;
    options?: Array<{label: string, value: any}>; // Pour les types 'select'
    validationRegex?: string;
    // ... autres meta-données pour la génération de formulaire
  }[];

  supportedFeatures?: {
    mintable?: boolean;
    burnable?: boolean;
    pausable?: boolean;
    cappedSupply?: boolean;
    royaltiesEIP2981?: boolean;
    // ... autres features
  };

  version: string; // Version du template
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean; // Pour activer/désactiver un template
}

// Exemple d'utilisation pour typer une variable
// const myUser: UserDBSchema = { ... };
// const myDeployment: DeploymentDBSchema = { ... };
