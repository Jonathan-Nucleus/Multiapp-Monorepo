'use strict';

const dbMediaConvertConnector = require('../service/db-mediaconvert-connector');
const validApiKeys = process.env.API_KEYS || 'abc,def';

let controllers = {
    dbMediaConvertConnectorController: (req, res) => {
        const apiKey = req.body.apiKey;

        // validate API key against list of valid API keys
        if (!validApiKeys.split(',').includes(apiKey)) {

            return res.status(401).send({
                message: 'Unauthorized'
             });
        }

        dbMediaConvertConnector.update(req, res, (err, dist) => {
            if (err)
                res.send(err);
            res.json(dist);
        });
    },
};

module.exports = controllers;