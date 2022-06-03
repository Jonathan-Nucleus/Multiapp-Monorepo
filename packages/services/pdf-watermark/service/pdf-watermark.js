const axios = require('axios').default;
const pdfLib = require('pdf-lib');
const { degrees, PDFDocument, rgb, StandardFonts } = pdfLib;
const bucketURL = process.env.AWS_S3_BUCKET_URL;
const jwtSecret = process.env.JWT_SECRET;
const jwtClient = require('jsonwebtoken');
const fs = require('fs');
let pdfWatermark = {
    applyWatermark: async (req, res, _next) => {
        const token = req.query.token;
        const watermark_position_adjustment_coeficient = 7; //determines watermark position based on it's length and size
        let decoded;

        try {
            decoded = jwtClient.verify(token, jwtSecret);
            console.log(decoded);
        }
        catch (e) {
            console.error(e);
        }

        if (!decoded) throw new Error('Unable to validate token.');
        if (!('watermark' in decoded)) throw new Error('Please provide a watermark.');
        if (!('file' in decoded)) throw new Error('Please provide a file.');

        const watermark = decoded.watermark;
        const file = decoded.file;
        const filename = file.split('/').pop().split('?')[0];
        const url = bucketURL + '/' + file;
        const existingPdfBytes = await axios.get(url, {responseType: 'arraybuffer'}).then(response => response.data);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const pages = pdfDoc.getPages();
        const { width, height } = pages[0].getSize();
        for(it in pages) {
            let page = pages[it];
            page.drawText(watermark, {
                x: width/2 - (watermark.length * watermark_position_adjustment_coeficient),
                y: height / 2 + (watermark.length * watermark_position_adjustment_coeficient),
                size: 40,
                font: helveticaFont,
                color: rgb(0.55, 0.55, 0.55),
                opacity: 0.4,
                rotate: degrees(-45)
            });
        }

        const pdfBytes = await pdfDoc.save();
        const pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary');

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.type('pdf');
		res.send(pdfBuffer);
    }
}

module.exports = pdfWatermark;