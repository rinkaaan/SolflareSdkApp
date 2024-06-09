source ~/startup.sh
WORKPLACE="$HOME/workplace/SolflareSdk"

WORKSPACE="$WORKPLACE/SolflareSdkApp"
(
  cd "$WORKSPACE"
  rsync-project SolflareSdk
  ssh root@hetzner "cd ~/workplace/SolflareSdk/SolflareSdkApp && npm run build"
)
