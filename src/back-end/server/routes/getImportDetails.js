var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/:mail',async function(req, res, next)
{
  const query = "Select l.import_date, bl.import_no, l.lot_id, bl.product_id, bl.quantity from Employee e join Branch_lot_line bl on e.branch_id = bl.branch_id join Lot l on bl.lot_id = l.lot_id where e.mail_addr = '" + req.params.mail + "' order by import_date desc";
  const rows = await db.query(query);
  const data = await JSON.stringify(rows);
  fs.writeFileSync('../front-end/Reports/import_details.json', data,'utf8');
  res.send(data);
});

module.exports = router;