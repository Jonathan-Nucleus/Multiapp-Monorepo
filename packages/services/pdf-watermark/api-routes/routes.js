'use strict';

const controller = require('../controllers/controller');

module.exports = (app) => {
    app.route('/pdf-watermark').get(controller.pdfWatermarkController);
    app.route('/').get((req, res)=>res.json({ message:'Success!' }));
}