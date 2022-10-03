var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/:supp_id/:lot_id/:prod_id/:exp_date/:quan',async function(req, res, next) {
  //db.query("insert into branch(address) values('address 10')");
  //res.send(`<h1>${req.params.id}</h1>`);
  var supp_id = req.params.supp_id;
  var lot_id = req.params.lot_id;
  var prod_id = req.params.prod_id;
  var exp_date = req.params.exp_date;
  var quan = req.params.quan;

  var query = "INSERT INTO Supply_line(supplier_id, lot_id, product_id, expiring_date, quantity)" +
  "VALUES (" + "'" + supp_id+ "'" + ","+ "'" + lot_id + "'"+ "," + "'"+ prod_id + "'"+ ","+ "'" + exp_date + "'"+ "," + quan + ")";
  //await query;
  //var query = 'insert into branch_lot_line(branch_id, lot_id, product_id, expiring_date, quantity) values(${branch_id}, lot_id, prod_id, exp_date, quan)';
  db.query(query);
  res.send(query);
});

module.exports = router;
//supp_id, prod_id, quantity, lot_id, exp_date
//33d0e3e6-d68f-11ec-b414-061bce7f90f2	fdcac8bc-dfc0-11ec-b414-061bce7f90f2	10	e7b4be2c-dfbe-11ec-b414-061bce7f90f2	2023-05-30
