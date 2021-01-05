const svg2pdfRouter = require('express').Router();

const bodyParser = require('body-parser');

const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');

svg2pdfRouter.use(bodyParser.json());
svg2pdfRouter.use(bodyParser.urlencoded({ extended: true }));

//we can post any svg file by multipart/form-data content type
//and also add something to request body like file title
svg2pdfRouter.post('/svg2pdf', (req, res) => {
  try {
    const body = req.body;
    const image = req.files.file;
    const svg = image.data.toString();
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'a4',
      Title: body.title,
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${body.title}.pdf`,
    });

    SVGtoPDF(doc, svg);

    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = svg2pdfRouter;
