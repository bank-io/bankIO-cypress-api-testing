// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const cucumber = require('cypress-cucumber-preprocessor').default;

const { doLloydsSandboxLogin } = require('./lloyds');
const { doHSBCSandboxLogin } = require('./hsbc');
const { doBBVASandboxLogin } = require('./bbva');
const { doBankiaSandboxLogin } = require('./bankia');
const { doUnicajaSandboxLogin } = require('./unicaja');
const { doCaixaSandboxLogin } = require('./caixa');
const { doBankinterSandboxLogin } = require('./bankinter');
const { doVirginSandboxLogin } = require('./virgin');
const { doNationwideSandboxLogin } = require('./nationwide');
const { doAIBSandboxLogin } = require('./aib');
const { doINGSandboxLogin } = require('./ing');
const { doDanskeSandboxLogin } = require('./danske');
const { doRBSSandboxLogin } = require('./rbs');
const { doBTSandboxLogin } = require('./bt');
const { doDeutscheBankSandboxLogin } = require('./deutsche-bank');
const { doAlphaBankSandboxLogin } = require('./alphabank');
const { doRevolutSandboxLogin } = require('./revolut');
const { doMonzoSandboxLogin } = require('./monzo');
const { doBCRSandboxLogin } = require('./bcr');
const { doRaiffeisenRomaniaSandboxLogin } = require('./raiffeisen-romania');
const { doRaiffeisenBulgariaSandboxLogin } = require('./raiffeisen-bulgaria');
const { doRaiffeisenAustriaSandboxLogin } = require('./raiffeisen-austria');
const { doRaiffeisenSlovakiaSandboxLogin } = require('./raiffeisen-slovakia');
const { doUniCreditRomaniaSandboxLogin } = require('./unicredit-romania');
const { doGriffinSandboxLogin } = require('./griffin');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('file:preprocessor', cucumber());

  on('task', {
    doLogin: ({ selectedInstitution, url, options }) => {
      return (async () => {
        switch (selectedInstitution) {
          case 'Lloyds':
            return await doLloydsSandboxLogin(url, options);

          case 'HSBC':
            return await doHSBCSandboxLogin(url, options);

          case 'Griffin Bank staging (sandbox)':
            return await doGriffinSandboxLogin(url, options);

          case 'BBVA (sandbox)':
            return await doBBVASandboxLogin(url, options);

          case 'Bankia (sandbox)':
            return await doBankiaSandboxLogin(url, options);

          case 'Unicaja Banco (sandbox)':
            return await doUnicajaSandboxLogin(url, options);

          case 'Caixa (sandbox)':
            return await doCaixaSandboxLogin(url, options);

          case 'Bankinter (sandbox)':
            return await doBankinterSandboxLogin(url, options);

          case 'Virgin':
            return await doVirginSandboxLogin(url, options);

          case 'Nationwide':
            return await doNationwideSandboxLogin(url, options);

          case 'Allied Irish Bank (sandbox)':
            return await doAIBSandboxLogin(url, options);

          case 'ING Group':
            return await doINGSandboxLogin(url, options);

          case 'Danske Bank private (sandbox)':
          case 'Danske Bank business (sandbox)':
            return await doDanskeSandboxLogin(url, options);

          case 'Revolut':
            return await doRevolutSandboxLogin(url, options);

          case 'Monzo':
            return await doMonzoSandboxLogin(url, options);

          case 'RBS Bank':
            return await doRBSSandboxLogin(url, options);

          case 'Banca Comercială Română':
            return await doBCRSandboxLogin(url, options);

          case 'Banca Transilvania':
            return await doBTSandboxLogin(url, options);

          case 'Deutsche Bank Group':
            return await doDeutscheBankSandboxLogin(url, options);

          case 'Alpha Bank':
            return await doAlphaBankSandboxLogin(url, options);

          case 'Raiffeisen Bank România':
            return await doRaiffeisenRomaniaSandboxLogin(url, options);

          case 'Raiffeisen Bank Bulgaria':
            return await doRaiffeisenBulgariaSandboxLogin(url, options);

          case 'Raiffeisen Bank Austria (sandbox)':
            return await doRaiffeisenAustriaSandboxLogin(url, options);

          case 'Raiffeisen Bank Slovakia (sandbox)':
            return await doRaiffeisenSlovakiaSandboxLogin(url, options);

          case 'UniCredit Bank Romania':
            return await doUniCreditRomaniaSandboxLogin(url, options);
        }
      })();
    },
  });
};
