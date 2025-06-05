import { Worker, Job } from 'bullmq';
import { redisConnectionConfig } from '../queues/connection';
import { DEPLOYMENT_QUEUE_NAME, DeploymentJobData, DeploymentJobResult } from '../queues/deploymentQueue';
import deploymentService from '../services/blockchain/DeploymentService'; // Le vrai service
// import { updateDeploymentStatusInDB } from '../services/databaseService'; // Hypothetical DB service

console.log('Deployment Worker: Initializing...');

// Le processeur de job est une fonction async qui prend le job en argument.
// C'est ici que la logique de traitement du job (ex: déploiement du contrat) est effectuée.
const jobProcessor = async (job: Job<DeploymentJobData, DeploymentJobResult>): Promise<DeploymentJobResult> => {
  console.log(`Deployment Worker: Processing job ${job.id} for deploymentId: ${job.data.deploymentId}`);
  const { networkName, contractNameForPrecompiled, constructorArgs, deploymentId, userId } = job.data;

  try {
    const contractTemplate = deploymentService.getPrecompiledContract(contractNameForPrecompiled);
    if (!contractTemplate || contractTemplate.bytecode === "0x...") {
      throw new Error(`Contract template "${contractNameForPrecompiled}" not found or has placeholder bytecode.`);
    }

    // Simuler une attente pour montrer le traitement asynchrone
    // await new Promise(resolve => setTimeout(resolve, 5000));

    const result = await deploymentService.deployPrecompiledContract({
      networkName,
      contractAbi: contractTemplate.abi,
      contractBytecode: contractTemplate.bytecode,
      constructorArgs,
    });

    console.log(`Deployment Worker: Job ${job.id} successful for deploymentId: ${deploymentId}. Contract: ${result.contractAddress}`);

    // Mettre à jour le statut dans la base de données (exemple)
    // await updateDeploymentStatusInDB(deploymentId, 'success', result.contractAddress, result.transactionHash);

    return {
      status: 'completed',
      contractAddress: result.contractAddress,
      transactionHash: result.transactionHash,
    };

  } catch (error: any) {
    console.error(`Deployment Worker: Job ${job.id} failed for deploymentId: ${deploymentId}. Error:`, error.message);

    // Mettre à jour le statut dans la base de données (exemple)
    // await updateDeploymentStatusInDB(deploymentId, 'failed', undefined, undefined, error.message);

    // L'erreur est automatiquement propagée à BullMQ qui marquera le job comme échoué.
    // On peut retourner un objet d'erreur personnalisé si besoin.
    // throw error; // Si on veut que BullMQ utilise l'erreur originale pour le 'failed' event
    return {
      status: 'failed',
      error: error.message || 'An unknown error occurred in worker.',
    };
  }
};

// Créer l'instance du Worker
// Ce worker écoute les nouveaux jobs sur la file DEPLOYMENT_QUEUE_NAME.
const deploymentWorker = new Worker<DeploymentJobData, DeploymentJobResult>(
  DEPLOYMENT_QUEUE_NAME,
  jobProcessor,
  {
    connection: redisConnectionConfig,
    concurrency: 5, // Traiter jusqu'à 5 jobs en parallèle (ajuster selon les ressources serveur)
    limiter: { // Optionnel: Limiter le nombre de jobs traités sur une période donnée
      max: 100, // Max 100 jobs
      duration: 60000, // par minute (60000 ms)
    },
  }
);

deploymentWorker.on('completed', (job, result) => {
  console.log(`Deployment Worker: Finished job ${job.id} in ${DEPLOYMENT_QUEUE_NAME} with result:`, result.status);
});

deploymentWorker.on('failed', (job, err) => {
  console.error(`Deployment Worker: Job ${job?.id} in ${DEPLOYMENT_QUEUE_NAME} (from worker event) failed with error:`, err.message);
});

deploymentWorker.on('error', err => {
  // Erreur non liée à un job spécifique (ex: problème de connexion Redis)
  console.error('Deployment Worker: An error occurred in the worker:', err);
});

console.log('Deployment Worker: Initialized and waiting for jobs.');

// Pour lancer le worker, ce fichier doit être exécuté (ex: `node dist/workers/deploymentWorker.js`)
// dans un processus séparé de l'API server qui ajoute les jobs.
// Ou, dans un setup monolithique (moins recommandé pour la scalabilité),
// il pourrait être démarré avec l'application principale, mais la gestion des processus devient plus complexe.
