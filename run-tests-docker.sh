#!/bin/sh

CURRENT_DIR="$( cd "$(dirname "$0")" ; pwd -P )"

docker run -t \
  -w=/app \
  -e CYPRESS_baseUrl=$CYPRESS_baseUrl \
  -e CYPRESS_client_id=$CYPRESS_client_id \
  -e CYPRESS_client_secret=$CYPRESS_client_secret \
  -e CYPRESS_organisation=$CYPRESS_organisation \
  --volume "$CURRENT_DIR/cypress":/app/cypress \
  --volume "$CURRENT_DIR/package.json":/app/package.json \
  --volume "$CURRENT_DIR/cypress.json":/app/cypress.json \
  --volume "$CURRENT_DIR/reporterOpts.json":/app/reporterOpts.json \
  --volume "$CURRENT_DIR/run-tests.sh":/app/run-tests.sh \
  cypress/browsers:node13.8.0-chrome81-ff75 /bin/sh -c ./run-tests.sh
