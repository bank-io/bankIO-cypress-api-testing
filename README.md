# bankIO-cypress-api-testing

> [Cypress](https://cypress.op) E2E runner can also test Rest and other APIs

![API testing using Cypress](images/demo.png)

## Use

Install dependencies with `npm install` or `npm ci`

See scripts in `package.json` to start the local API server and run the tests. The main ones are

* `npm start` - runs the local API server
* `npm run cy:open` - runs Cypress in GUI mode
* `npm test` - starts the local API server and runs Cypress tests against it in headless mode

## Environment variables

* `client_id` - bankIO OpenID Connect client id
* `client_secret` - bankIO OpenID Connect client secret
* `organisation` - bankIO organisation name

## List of current ASPSPs

### AISP

* Lloyds bank (sandbox)
* Banca Transilvania (sandbox)
* Raiffeisen Bank Romania (sandbox)
* RBS Bank (sandbox)
* Banca Comercială Română (sandbox)