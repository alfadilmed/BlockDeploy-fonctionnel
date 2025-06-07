export class DaoCreationResponseDto {
  success: boolean;
  daoId: string; // ID de la DAO dans notre base de données
  daoAddress: string; // Adresse du contrat Safe déployé
  network: string;
  deploymentTxHash: string;
  message: string;
}
