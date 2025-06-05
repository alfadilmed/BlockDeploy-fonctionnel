import { Queue, Worker, Job } from 'bullmq';
import { redisConnectionConfig } from './connection';
// Importer le service de déploiement réel lorsque le worker est défini
// import deploymentService from '../services/blockchain/DeploymentService';

export const DEPLOYMENT_QUEUE_NAME = 'contract-deployment';

// Définir la structure des données attendues pour un job de déploiement
export interface DeploymentJobData {
  deploymentId: string; // Un ID pour suivre ce déploiement spécifique (ex: de la DB)
  userId: string;
  networkName: string;
  contractType: 'ERC20' | 'NFT_ERC721' | 'NFT_ERC1155'; // etc.
  // Paramètres spécifiques au contrat, ex:
  // contractParams: { name: string, symbol: string, initialSupply?: string, ... }
  // constructorArgs: any[]; // Directement les arguments du constructeur
  contractNameForPrecompiled: string; // ex: "SimpleERC20"
  constructorArgs: any[];
}

export interface DeploymentJobResult {
  status: 'completed' | 'failed';
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
}

// Créer l'instance de la Queue
// Cette instance est utilisée pour AJOUTER des jobs à la file.
export const deploymentQueue = new Queue<DeploymentJobData, DeploymentJobResult>(
  DEPLOYMENT_QUEUE_NAME,
  {
    connection: redisConnectionConfig,
    defaultJobOptions: {
      attempts: 3, // Réessayer un job jusqu'à 3 fois en cas d'échec
      backoff: {
        type: 'exponential',
        delay: 10000, // Délai exponentiel, commençant à 10s
      },
      removeOnComplete: { // Garder les jobs complétés pendant un certain temps
        age: 3600 * 24 * 7, // 1 semaine
        count: 1000, // ou un nombre max
      },
      removeOnFail: { // Garder les jobs échoués plus longtemps pour investigation
        age: 3600 * 24 * 30, // 1 mois
      },
    },
  }
);

console.log(`BullMQ: Queue "${DEPLOYMENT_QUEUE_NAME}" initialized.`);

// Écouteurs d'événements pour la queue (optionnel, mais utile pour le logging/monitoring)
deploymentQueue.on('waiting', (jobId) => {
  console.log(`BullMQ: Job ${jobId} is waiting in ${DEPLOYMENT_QUEUE_NAME}`);
});

deploymentQueue.on('active', (job) => {
  console.log(`BullMQ: Job ${job.id} is active in ${DEPLOYMENT_QUEUE_NAME}`);
});

deploymentQueue.on('completed', (job, result) => {
  console.log(`BullMQ: Job ${job.id} in ${DEPLOYMENT_QUEUE_NAME} completed with result:`, result);
});

deploymentQueue.on('failed', (job, err) => {
  console.error(`BullMQ: Job ${job?.id} in ${DEPLOYMENT_QUEUE_NAME} failed with error:`, err.message, err.stack);
});


// --- Exemple pour ajouter un job (typiquement appelé depuis un service API) ---
/*
export async function addDeploymentJob(data: DeploymentJobData): Promise<Job<DeploymentJobData, DeploymentJobResult>> {
  const job = await deploymentQueue.add('deployContract', data);
  console.log(`Added job ${job.id} to ${DEPLOYMENT_QUEUE_NAME} for deploymentId: ${data.deploymentId}`);
  return job;
}

// Exemple d'appel:
// addDeploymentJob({
//   deploymentId: 'some-unique-id-from-db',
//   userId: 'user-id-123',
//   networkName: 'sepolia',
//   contractType: 'ERC20',
//   contractNameForPrecompiled: "SimpleERC20",
//   constructorArgs: ["Test Token From Queue", "TQF", ethers.parseUnits("1000", 18)]
// });
*/

export default deploymentQueue;
