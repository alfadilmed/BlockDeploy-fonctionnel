import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false, // On peut le mettre à true et créer le fichier si besoin de commandes custom
  },
});
