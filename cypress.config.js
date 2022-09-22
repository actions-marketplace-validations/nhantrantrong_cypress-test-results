const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {

    "trashAssetsBeforeRuns": true,
    "video": false,


    setupNodeEvents(on, config) {
      // implement node event listeners here

      require('./src')(on, config)
    },
  },
});
