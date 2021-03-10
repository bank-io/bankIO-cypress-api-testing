Feature: Deutsche Bank

    Background:
        Given I request client credentials

    Scenario: Create consent, authorise and check account list, balances, transactions
        When I create a new account consent for user "user1"
        When I authorise the consent
        When I select institution "Deutsche Bank Group"
        # When I click next
        When I click next
        When I visit the Authorise consent button link
        When I exchange the authorisation code to access token
        Then I should have consent status "valid"
        When I get the account list
        Then I should have a few accounts in the list
        When I select account with IBAN "DE17215730140403340300"
        When I get the account data
        When I get the account balances
        Then I should have a few balances in the list
        When I get the account transactions
        Then I should have a few transactions in the list


