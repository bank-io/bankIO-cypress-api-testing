// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const cucumber = require("cypress-cucumber-preprocessor").default;

const { doLloydsSandboxLogin } = require("./lloyds");
const { doBTSandboxLogin } = require("./bt");
const { doRaiffeisenRomaniaSandboxLogin } = require("./raiffeisen-romania");
const { doUniCreditRomaniaSandboxLogin } = require("./UniCredit-romania");

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("file:preprocessor", cucumber());

  on("task", {
    doLogin: ({ selectedInstitution, url }) => {
      return (async () => {
        switch (selectedInstitution) {
          case "Lloyds":
            return await doLloydsSandboxLogin(url);
            
          case "Banca Transilvania":
            return await doBTSandboxLogin(url);
            
          case "Raiffeisen Bank România":
            return await doRaiffeisenRomaniaSandboxLogin(url);
            
          case "UniCredit Bank Romania":
            return await doUniCreditRomaniaSandboxLogin(url);
        }
      })();
    },
  });
};
