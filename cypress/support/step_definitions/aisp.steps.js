import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import querystring from "querystring";

Given(/^I request client credentials$/, () => {
  cy.request({
    method: "POST",
    url: "/auth/token", // baseUrl is prepended to url
    form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
    body: {
      client_id: Cypress.env("client_id"),
      grant_type: "client_credentials",
      client_secret: Cypress.env("client_secret"),
      scope: "aisp offline_access",
    },
  })
    .as("clientCredentials")
    .its("headers")
    .its("content-type")
    .should("include", "application/json");
});

When(/^I create a new account consent for user "(.*)"$/, (user) => {
  cy.get("@clientCredentials").then(({ body: clientCredentials }) => {
    cy.request({
      method: "POST",
      url: `/org/${Cypress.env("organisation")}/v1/consents`, // baseUrl is prepended to url
      headers: {
        authorization: `Bearer ${clientCredentials.access_token}`,
        "TPP-PSU-ID": user,
      },
      body: {
        access: {
          availableAccounts: "allAccounts",
        },
        recurringIndicator: true,
        validUntil: "2020-06-09",
        combinedServiceIndicator: false,
        frequencyPerDay: 4,
      },
    })
      .as("consent")
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });
});

When(/^I authorise the consent$/, (param1) => {
  cy.get("@consent").then(({ body: consent }) => {
    console.log("consent", consent);
    cy.visit(
      `/auth/authorize?${querystring.stringify({
        redirect_uri: "https://cypress.bankio.local/openbanking/callback",
        state: "state",
        response_type: "code",
        scope: "aisp offline_access",
        client_id: Cypress.env("client_id"),
        consentId: consent.consentId,
        code_challenge: "mJ7SsO3rclBTntD9QjqnzXRB34e4PVsICBXF2OyId_k",
        code_challenge_method: "S256",
      })}`
    );
  });
});

When(/^I select institution "(.*)"$/, (institution) => {
  cy.wrap(institution).as("selectedInstitution");

  cy.get('input[placeholder="Search bank"]').type(institution);

  cy.contains(`td`, institution).click();
});

When(/^I click next$/, (institution) => {
  cy.contains(`[role*="button"] .MuiButton-label`, "Next").click();
});

When(/^I click Authorise consent button$/, (institution) => {
  cy.contains(`[role*="button"] .MuiButton-label`, "Authorise consent").click();
});

When(/^I visit the Authorise consent button link$/, (institution) => {
  cy.get("@selectedInstitution").then((selectedInstitution) => {
    cy.contains(`a[role*="button"] .MuiButton-label`, "Authorise consent", { timeout: 20000 })
      .parents("a")
      .then(($el) => {
        const url = $el.attr("href");

        cy.contains(`[role*="button"] .MuiButton-label`, "Back").click();

        cy.task("doLogin", {selectedInstitution, url}).then((returnUrl) => {
          cy.log(returnUrl);

          const location = new URL(returnUrl);

          const params = querystring.parse(location.search.replace(/^\?/g, ""));

          cy.wrap(params.code).as("code");
        });
      });
  });
});

Given(/^I exchange the authorisation code to access token$/, () => {
  cy.get("@code").then((code) => {
    cy.request({
      method: "POST",
      url: "/auth/token", // baseUrl is prepended to url
      form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
      body: {
        client_id: Cypress.env("client_id"),
        grant_type: "authorization_code",
        client_secret: Cypress.env("client_secret"),
        code,
        code_verifier: "exampleCodeVerifier0123456789012345678901234567890",
        redirect_uri: "https://cypress.bankio.local/openbanking/callback",
      },
    })
      .as("accessToken")
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });
});

Then(/^I should have consent status "(.*)"$/, (status) => {
  cy.get("@accessToken").then(({ body: accessToken }) => {
    cy.get("@consent").then(({ body: consent }) => {
      const consentStatus = cy
        .request({
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken.access_token}`,
          },
          url: `/org/${Cypress.env("organisation")}/v1/consents/${consent.consentId}/status`, // baseUrl is prepended to url
        })
        .its("body")
        .should("deep.eq", { consentStatus: status });
      // consentStatus.its("headers").its("content-type").should("include", "application/json");
    });
  });
});

When(/^I get the account list$/, (status) => {
  cy.get("@accessToken").then(({ body: accessToken }) => {
    cy.get("@consent").then(({ body: consent }) => {
      const consentStatus = cy
        .request({
          method: "GET",
          headers: {
            "Consent-ID": consent.consentId,
            authorization: `Bearer ${accessToken.access_token}`,
          },
          url: `/org/${Cypress.env("organisation")}/v1/accounts?withBalance=true`, // baseUrl is prepended to url
        })
        .as("accounts")
        .its("headers")
        .its("content-type")
        .should("include", "application/json");
    });
  });
});

Then(/^I should have a few accounts in the list$/, () => {
  cy.get("@accounts").its("body.accounts").should("have.length.of.at.least", 1);
});

When(/^I select account with IBAN "(.*)"$/, (iban) => {
  cy.get("@accounts")
    .its("body.accounts")
    .then((accounts) => {
      const account = accounts.find((p) => p.iban == iban);

      cy.wrap(account).as("selectedAccount");
    });
});

When(/^I get the account data$/, (status) => {
  cy.get("@accessToken").then(({ body: accessToken }) => {
    cy.get("@consent").then(({ body: consent }) => {
      cy.get("@selectedAccount").then((selectedAccount) => {
        const consentStatus = cy
          .request({
            method: "GET",
            headers: {
              "Consent-ID": consent.consentId,
              authorization: `Bearer ${accessToken.access_token}`,
            },
            url: `/org/${Cypress.env("organisation")}/v1/accounts/${selectedAccount.resourceId}`, // baseUrl is prepended to url
          })
          .as("account")
          .its("headers")
          .its("content-type")
          .should("include", "application/json");
      });
    });
  });
});

When(/^I get the account balances$/, (status) => {
  cy.get("@accessToken").then(({ body: accessToken }) => {
    cy.get("@consent").then(({ body: consent }) => {
      cy.get("@selectedAccount").then((selectedAccount) => {
        const consentStatus = cy
          .request({
            method: "GET",
            headers: {
              "Consent-ID": consent.consentId,
              authorization: `Bearer ${accessToken.access_token}`,
            },
            url: `/org/${Cypress.env("organisation")}/v1/accounts/${selectedAccount.resourceId}/balances`, // baseUrl is prepended to url
          })
          .as("balances")
          .its("headers")
          .its("content-type")
          .should("include", "application/json");
      });
    });
  });
});

When(/^I get the account transactions$/, (status) => {
  cy.get("@accessToken").then(({ body: accessToken }) => {
    cy.get("@consent").then(({ body: consent }) => {
      cy.get("@selectedAccount").then((selectedAccount) => {
        const consentStatus = cy
          .request({
            method: "GET",
            headers: {
              "Consent-ID": consent.consentId,
              authorization: `Bearer ${accessToken.access_token}`,
            },
            url: `/org/${Cypress.env("organisation")}/v1/accounts/${selectedAccount.resourceId}/transactions`, // baseUrl is prepended to url
          })
          .as("transactions")
          .its("headers")
          .its("content-type")
          .should("include", "application/json");
      });
    });
  });
});

Then(/^I should have a few balances in the list$/, () => {
  cy.get("@balances").its("body.balances").should("have.length.of.at.least", 1);
});

Then(/^I should have a few transactions in the list$/, () => {
  cy.get("@transactions").its("body.transactions").should("have.length.of.at.least", 1);
});
