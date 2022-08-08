# This script handles configuring secret files stored on the the self-hosted
# Github Actions runner.

cp ~/Development/ignite/packages/mobile/ios/GoogleService-Info.plist ./ios/

if [ $1 == "qa1" ]
then
    cp ~/Development/ignite/packages/mobile/.env.qa1 .env.production
    echo "Configured for QA1"
elif [ $1 == "qa2" ]
then
    cp ~/Development/ignite/packages/mobile/.env.qa2 .env.production
    echo "Configured for QA2"
else
    echo "QA environment not specified"
    exit 1
fi