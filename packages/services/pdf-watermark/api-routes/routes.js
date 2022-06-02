'use strict';

const controller = require('../controllers/controller');

module.exports = (app) => {
    app.route('/pdf-watermark').post(controller.pdfWatermarkController);
}