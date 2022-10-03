var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/',async function(req, res, next)
{
  //const rows = await db.query('select p.product_id, p.product_name, p.unit,min(expiring_date) as "expiring date", p.status,p.price from Product p join Supply_line s on (p.product_id = s.product_id) group by p.product_id;');
  const rows = await db.query('select * from product');
  const data = await JSON.stringify(rows);
  fs.writeFileSync('../front-end/Storage/data.json', data,'utf8' );

  res.send(data);
});

module.exports = router;
