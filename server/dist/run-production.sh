#!/bin/bash
SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
# parentdir="$(dirname "$SCRIPTDIR")"

# cd $parentdir
# cd '../front'
# echo "COMPILE FRONTEND ASSETS >>>>>>"
# npm run build

# cd '../storefront'
# echo "COMPILE STOREFRONTEND ASSETS >>>>>>"
# npm run build


# cd '../server'
echo "stop existing pm2 instance"
pm2 stop all
echo "run build tasks"
npm run build
echo "start pm2 instance"
NODE_ENV=production pm2 start "$SCRIPTDIR/bin/server.js"