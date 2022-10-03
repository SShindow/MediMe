var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');
const pdfGenerator = require('pdfkit');
const DailyReportGenerator = require('../../daily_report/DailyReportGenerator.js');
router.get('/:mail', async function(req, res, next) {
    let currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth()+1;
    var day = currentDate.getDate();
    // var query = "Select * from Product";
    var query = "SELECT p.product_name, p.price, sum(quantity) as total_quantity from Branch b join Employee e on b.branch_id = e.branch_id join Serve_line sl on e.employee_id = sl.employee_id join Product p on sl.product_id = p.product_id join Invoice i on sl.invoice_id = i.invoice_id where extract(year from export_date) =  " + year + " and extract(month from  export_date) = " + month + " and extract(day from export_date) = " + day + " and e.branch_id = (Select branch_id from Employee where mail_addr = '" + req.params.mail + "') group by p.product_name, p.price";
    const result = await db.query(query);
    const branch = await db.query("SELECT address from Employee e join Branch b on e.branch_id = b.branch_id where e.mail_addr = '" + req.params.mail + "'");
    // console.log(result);
    // res.send(result);
    const data = await JSON.stringify(result);
    fs.writeFileSync('../front-end/Reports/daily_data.json', data, 'utf8');
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
    const pdf = new DailyReportGenerator(currentDate, branch, result);
    pdf.generate(doc);
    doc.pipe(res);
    doc.end();
  });
  
  module.exports = router;