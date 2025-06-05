import { ConnectionOptions } from 'bullmq';
import { Redis } from 'ioredis';

// Charger la configuration Redis depuis les variables d'environnement
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || undefined;

console.log(`Queue Connection: Connecting to Redis at ${redisHost}:${redisPort}`);

export const redisConnectionConfig: ConnectionOptions = {
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  // maxRetriesPerRequest: null, // Désactiver les nouvelles tentatives par défaut pour ioredis >= 4.28.0
};

// Optionnel: Exporter une instance ioredis si besoin ailleurs, mais BullMQ la gère en interne.
// export const redisClient = new Redis(redisPort, redisHost, { password: redisPassword });

// redisClient.on('connect', () => console.log('Connected to Redis for BullMQ via ioredis instance.'));
// redisClient.on('error', (err) => console.error('ioredis connection error:', err));

export default redisConnectionConfig;
