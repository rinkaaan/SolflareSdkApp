WORKPLACE="$HOME/workplace/SolflareSdk"

WORKSPACE="$WORKPLACE/SolflareSdkApi"

(
  cd "$WORKSPACE"
  ./scripts/gen.sh
)

WORKSPACE="$WORKPLACE/SolflareSdkApp"
SCHEMA_PATH="$WORKPLACE/SolflareSdkApi/api/openapi.yaml"

(
  cd "$WORKSPACE"
  rm -rf openapi-client
  npx openapi -i "$SCHEMA_PATH" -o openapi-client
)
