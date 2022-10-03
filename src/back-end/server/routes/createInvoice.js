var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/',async function(req, res, next) {
  //db.query("insert into branch(address) values('address 10')");
  //res.send(`<h1>${req.params.id}</h1>`);
  //await query;
  //var query = 'insert into branch_lot_line(branch_id, lot_id, product_id, expiring_date, quantity) values(${branch_id}, lot_id, prod_id, exp_date, quan)';
  db.query("insert into Invoice(export_date) values(CURRENT_DATE)");
  res.send("insert into Invoice(export_date) values(CURRENT_DATE)");
});

module.exports = router;
