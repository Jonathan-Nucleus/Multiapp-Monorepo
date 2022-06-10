const https = require('https');
const requiredEnvVariables = ['DB_CONNECTOR_URL', 'DB_CONNECTOR_PORT', 'API_KEY']
const dbConnectorURL = process.env.DB_CONNECTOR_URL;
const dbConnectorPort = process.env.DB_CONNECTOR_PORT;
const postIdIndex = 2;
const apiKey = process.env.API_KEY;

let configurationSanityCheck = function() {
    for (let envVariableIdx in requiredEnvVariables) {
        if (!(requiredEnvVariables[envVariableIdx] in process.env)) {
            throw new Error(`Service not configured properly, please provide ${requiredEnvVariables[envVariableIdx]}`);
        }
    }
}

configurationSanityCheck()

exports.handler = async (event) => {
    console.log('event: ', JSON.stringify(event, null, 2));
    const records = event['Records'];

    for (let recordIdx in records) {
        const keyPath = decodeURIComponent(records[recordIdx]['s3']['object']['key']);
        const keyPathParts = keyPath.split('/');
        const postId = keyPathParts[postIdIndex];

        const body = JSON.stringify({
            'status': 'Transcoded',
            'postId': postId,
            'apiKey': apiKey
        });

        const options = {
          hostname: dbConnectorURL,
          port: dbConnectorPort,
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
          },
        };

        const req = https.request(options, res => {
            if(res.statusCode == 200) {
                console.log(`Success: postID ${postId}.`);
            }
            else {
                console.error(`Failed: Received status code ${res.statusCode} for postID ${postId}.`);
            }
        });

        req.on('error', error => {
          console.error(error);
        });

        req.write(body);
        req.end();
    }

    const response = {
        statusCode: 200
    };
    return response;
};
