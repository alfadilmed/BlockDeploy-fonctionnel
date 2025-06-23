# Explication des Paramètres de Déploiement BlockDeploy

Cette section détaille certains paramètres clés que vous pouvez trouver dans votre fichier `blockdeploy.yaml`.

## Paramètre : `gasLimit` (dans `deploymentSettings`)

- **Description**: `gasLimit` spécifie la quantité maximale de gas que vous êtes prêt à dépenser pour une transaction de déploiement de contrat ou une interaction avec un contrat.
- **Utilité**: Empêche les transactions de consommer une quantité excessive et imprévue de gas, ce qui pourrait entraîner des coûts élevés. S'il n'est pas suffisant, la transaction échouera avec une erreur "out of gas".
- **Valeur typique**: Dépend de la complexité du contrat ou de la fonction appelée. Pour un déploiement ERC-20 simple, une valeur entre `2000000` et `5000000` peut être un point de départ. Pour des contrats plus complexes, cela peut être plus élevé.
- **Où le trouver**: Généralement sous `deploymentSettings` ou spécifique à une configuration de contrat.
- **Exemple**:
  ```yaml
  deploymentSettings:
    defaultGasLimit: 3000000 # Limite de gas par défaut pour les déploiements

  smartContracts:
    myContract:
      # ...
      deploymentOptions:
        gasLimit: 4500000 # Surcharge la limite par défaut pour ce contrat
  ```

## Paramètre : `replicas` (pour services web/api)

- **Description**: `replicas` définit le nombre d'instances de votre service qui seront exécutées en parallèle.
- **Utilité**: Permet la haute disponibilité et la répartition de charge. Plus de répliques peuvent gérer plus de trafic.
- **Valeur typique**: `1` pour le développement ou les petits services, `2` ou plus pour la production afin d'assurer la redondance.
- **Exemple**:
  ```yaml
  services:
    myWebApp:
      type: web
      image: "myuser/mywebapp:latest"
      ports:
        - "80:8080"
      replicas: 3 # Exécute 3 instances de cette application web
  ```
