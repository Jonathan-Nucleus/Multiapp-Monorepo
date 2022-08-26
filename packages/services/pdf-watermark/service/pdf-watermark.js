const pdfLib = require("pdf-lib");
const jwtClient = require("jsonwebtoken");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const { degrees, PDFDocument, rgb, StandardFonts } = pdfLib;

const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
const JWT_SECRET = process.env.JWT_SECRET;
const AWS_UPLOAD_REGION = process.env.AWS_REGION;

let pdfWatermark = {
  applyWatermark: async (req, res, _next) => {
    const token = req.query.token;
    const watermark_position_adjustment_coeficient = 7; //determines watermark position based on it's length and size
    let decoded;

    try {
      decoded = jwtClient.verify(token, JWT_SECRET);
      console.log(decoded);
    } catch (e) {
      console.error(e);
    }

    if (!decoded) {
      console.error(`Unable to validate token: ${token}`);
      return res.status(401).send();
    }
    if (!("watermark" in decoded)) {
      console.error("No watermark provided.");
      res.statusMessage = "No watermark provided.";
      return res.status(400).send();
    }

    if (!("file" in decoded)) {
      console.error("No file provided.");
      res.statusMessage = "No file provided.";
      return res.status(400).send();
    }

    const watermark = decoded.watermark;
    const file = decoded.file;
    const filename = file.split("/").pop().split("?")[0];
    console.log(`Retrieving PDF from: ${S3_BUCKET}/${file}`);

    try {
      const s3Client = new S3Client({
        region: AWS_UPLOAD_REGION,
      });
      const getCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: file,
      });
      const response = await s3Client.send(getCommand);
      console.log("response", response);
      const existingPdfBytes = await new Promise((resolve, reject) => {
        const chunks = [];
        const stream = response.Body;
        if (!stream) resolve(chunks);

        stream.on("data", (chunk) => chunks.push(chunk));
        stream.once("end", () => resolve(Buffer.concat(chunks)));
        stream.once("error", reject);
      });

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const { width, height } = pages[0].getSize();
      for (const it in pages) {
        let page = pages[it];
        page.drawText(watermark, {
          x:
            width / 2 -
            watermark.length * watermark_position_adjustment_coeficient,
          y:
            height / 2 +
            watermark.length * watermark_position_adjustment_coeficient,
          size: 40,
          font: helveticaFont,
          color: rgb(0.55, 0.55, 0.55),
          opacity: 0.4,
          rotate: degrees(-45),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = Buffer.from(pdfBytes.buffer, "binary");
      res.setHeader(
        "Content-disposition",
        `attachment; filename="${filename}"`
      );
      res.type("pdf");
      res.send(pdfBuffer);
    } catch (e) {
      console.error(e);
      return res.status(404).send();
    }
  },
};

module.exports = pdfWatermark;
