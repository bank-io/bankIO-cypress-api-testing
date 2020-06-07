#!/bin/sh

yarn install

npm run cy:delete-results

npm run cy:run-mocha
MOCHA_RUN_RESULT=$?

npm run cy:mochawesome-merge
npm run cy:mochawesome-report-generator

exit $MOCHA_RUN_RESULT
