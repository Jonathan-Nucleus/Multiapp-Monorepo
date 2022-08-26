"use strict";

const pdfWatermark = require("../service/pdf-watermark");

let controllers = {
  pdfWatermarkController: (req, res) => {
    pdfWatermark.applyWatermark(req, res, (err, dist) => {
      if (err) res.send(err);

      res.send(dist);
    });
  },
};

module.exports = controllers;
