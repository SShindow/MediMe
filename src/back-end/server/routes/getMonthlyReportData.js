var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');
const pdfGenerator = require('pdfkit');
const MonthlyReportLineGraph = require('../../monthly_report/MonthlyReportLineGraph.js');
const MonthlyReportGenerator = require('../../monthly_report/MonthlyReportGenerator.js');
router.get('/:mail', async function(req, res, next) {
    let currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth()+1;
    var day = currentDate.getDate();
    const branch_id = await db.query("SELECT branch_id from Employee where mail_addr = '" + req.params.mail + "'");
    var sales_query = "SELECT extract(day from date) as day, sum(sales) as value from (SELECT date(export_date) as Date, sl.product_id, price, sum(quantity), price * sum(quantity) as Sales from Employee e join Branch b on e.branch_id = b.branch_id join Serve_line sl on e.employee_id = sl.employee_id join Product p on sl.product_id = p.product_id join Invoice i on sl.invoice_id = i.invoice_id where extract(year from export_date) =  " + year + " and extract(month from export_date) = " + month + " and e.branch_id = " + "'" + branch_id[0].branch_id + "'" + " group by date(export_date), sl.product_id, price) as dailySale group by date";
    var import_query = "SELECT extract(day from date) as day, sum(imports) as value from (SELECT date(import_date) as date, sl.product_id, price, bl.quantity, price * bl.quantity as Imports from Branch b join Branch_lot_line bl on b.branch_id = bl.branch_id join Supply_line sl on bl.product_id = sl.product_id and bl.lot_id = sl.lot_id join Lot l on bl.lot_id = l.lot_id where extract(year from import_date) =  " + year + " and extract(month from import_date) = " + month + " and bl.branch_id = " + "'" + branch_id[0].branch_id + "'" + ") as monthlyImports group by date";
    const sales_result = await db.query(sales_query);
    const imports_result = await db.query(import_query);
    const sales_data = await JSON.stringify(sales_result);
    const imports_data = await JSON.stringify(imports_result);
    const branch = await db.query("SELECT address from Branch where branch_id = " + "'" + branch_id[0] + "'")
    fs.writeFileSync('../front-end/Reports/monthly_sales_data.json', sales_data, 'utf8');
    fs.writeFileSync('../front-end/Reports/monthly_imports_data.json', imports_data, 'utf8');
  
  });
  
  module.exports = router;