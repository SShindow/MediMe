var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/:mail',async function(req, res, next)
{
  //const rows = await db.query('select p.product_id, p.product_name, p.unit,min(expiring_date) as "expiring date", p.status,p.price from Product p join Supply_line s on (p.product_id = s.product_id) group by p.product_id;');
  const query = "select p.product_id, p.product_name, get_remaining_quantity(b.branch_id,p.product_id) as " + '"quantity"' + ",get_product_expiring_date(b.branch_id,p.product_id) as " + '"expiring_date"' +", get_product_status(b.branch_id,p.product_id) as " + '"status"'+", p.price from Product p join Branch_lot_line b on (p.product_id = b.product_id) join employee e on (e.branch_id = b.branch_id) where e.mail_addr = '" + req.params.mail + "' group by p.product_id, b.branch_id";
  const rows = await db.query(query);
  const data = await JSON.stringify(rows);
  fs.writeFileSync('../front-end/Storage/data.json', data,'utf8' );
  res.send(data);
});

module.exports = router;
