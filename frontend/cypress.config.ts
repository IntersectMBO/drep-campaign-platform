import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    env: {
      backendUrl: 'https://sancho.1694.io/api',
    }
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    
  },
});
