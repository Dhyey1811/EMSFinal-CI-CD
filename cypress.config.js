const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/', // Your frontend URL
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.js',
  },
});
