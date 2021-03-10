Feature: RBS Bank

    Background:
        Given I request client credentials

    Scenario: Create consent, authorise and check account list, balances, transactions
        When I create a new account consent for user "user1"
        When I authorise the consent
        When I select institution "RBS Bank"
        # When I click next
        When I visit the Authorise consent button link
        When I exchange the authorisation code to access token
        Then I should have consent status "valid"
        When I get the account list
        Then I should have a few accounts in the list
        When I select account with sortCodeAccountNumber "50000012345602"
        When I get the account data
        When I get the account balances
        Then I should have a few balances in the list
        When I get the account transactions
        Then I should have a few transactions in the list


