import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  retries: 1,
  defaultCommandTimeout: 2000,
  watchForFileChanges: false,
  video: true,
  screenshotOnRunFailure:true,
  videosFolder: './cypress/videos',
  screenshotsFolder: './cypress/screenshots',
  fixturesFolder: './cypress/fixture',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://frontend:3000',
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
