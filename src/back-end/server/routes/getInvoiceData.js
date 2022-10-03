var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');
const pdfGenerator = require('pdfkit');
const InvoiceGenerator = require('../../invoice/InvoiceGenerator.js');

router.get('/:invoice_id', async function(req, res, next) {
    var query = "SELECT i.invoice_id, export_date, employee_id, p.product_name, p.price, sl.quantity, sl.cust_phone from Serve_line sl join Product p on sl.product_id = p.product_id join Invoice i on sl.invoice_id = i.invoice_id where i.invoice_id = " + req.params.invoice_id;
    const result = await db.query(query);
    // console.log(result);
    // res.send(result);
    const data = await JSON.stringify(result);
    fs.writeFileSync('../front-end/Reports/invoice_data.json', data, 'utf8');
    var doc = new pdfGenerator;
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      // res.writeHead(200, {
      //   'Content-Length': Buffer.byteLength(pdfData),
      //   'Content-Type': 'application/pdf',
      //   'Content-disposition': 'attacgment; filename = test/pdf'
      // }).end(pdfData);
    });
    const pdf = new InvoiceGenerator(result);
    pdf.generate(doc);
    doc.pipe(res);
    doc.end();
  });
  
  module.exports = router;