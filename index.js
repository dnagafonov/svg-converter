const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

const PDFDocument = require("pdfkit");
const SVGtoPDF = require("svg-to-pdfkit");

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

//we can post any svg file by multipart/form-data content type
//and also add something to request body like file title
app.post("/", (req, res) => {
  try {
    const body = req.body;
    const image = req.files.file;
    const svg = image.data.toString();
    const doc = new PDFDocument({
      layout: "landscape",
      size: "a4",
      Title: body.title,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${body.title}.pdf`,
    });

    SVGtoPDF(doc, svg);

    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000);
