'use strict';

const controller = require('../controllers/controller');

module.exports = (app) => {
    app.route('/db-connector').post(controller.dbMediaConvertConnectorController);
}