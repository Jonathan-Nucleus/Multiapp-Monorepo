require('dotenv').config();

const express = require('express');
const morgan = require('morgan')
const app = express();
const routes = require('./api-routes/routes');

//config check
const requiredEnvVariables = ['API_KEYS', 'MONGODB_URI', 'PORT']
let configurationSanityCheck = function() {
    for (let envVariableIdx in requiredEnvVariables) {
        if (!(requiredEnvVariables[envVariableIdx] in process.env)) {
            throw new Error(`Service not configured properly, please provide ${requiredEnvVariables[envVariableIdx]}`);
        }
    }
}

const port = process.env.PORT;

configurationSanityCheck()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logging
morgan.token('requestBody', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(function (tokens, req, res) {

    return JSON.stringify([
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        tokens.requestBody(req, res),
        tokens.responseBody(req, res),
        tokens['response-time'](req, res), 'ms'
      ]);
}));

routes(app);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});