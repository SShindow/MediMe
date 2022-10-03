var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/:mail', async function(req, res, next)
{
  const query = "Select i.export_date, i.invoice_id, e.employee_id, sl.product_id, sl.quantity from Employee e join Serve_line sl on e.employee_id = sl.employee_id join Invoice i on sl.invoice_id = i.invoice_id where e.branch_id = (Select branch_id from Employee where mail_addr = '" + req.params.mail + "') order by export_date desc, invoice_id desc";
  const rows = await db.query(query);
  const data = await JSON.stringify(rows);
  fs.writeFileSync('../front-end/Reports/export_details.json', data,'utf8');
  res.send(data);
});

module.exports = router;