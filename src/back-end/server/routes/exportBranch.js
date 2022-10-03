var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/:mail_addr/:lot_id/:prod_id/:exp_date/:quan',async function(req, res, next) {
  //db.query("insert into branch(address) values('address 10')");
  //res.send(`<h1>${req.params.id}</h1>`);
  var mail_addr = req.params.mail_addr;
  var lot_id = req.params.lot_id;
  var prod_id = req.params.prod_id;
  var exp_date = req.params.exp_date;
  var quan = req.params.quan;

  var branch = await db.query("select branch_id from employee where mail_addr = '" + mail_addr + "'");

  var query = "INSERT INTO Branch_lot_line(branch_id, lot_id, product_id, expiring_date, quantity)" +
  "VALUES (" + "'" + await branch[0].branch_id+ "'" + ","+ "'" + lot_id + "'"+ "," + "'"+ prod_id + "'"+ ","+ "'" + exp_date + "'"+ "," + quan + ")";
  //await query;
  //var query = 'insert into branch_lot_line(branch_id, lot_id, product_id, expiring_date, quantity) values(${branch_id}, lot_id, prod_id, exp_date, quan)';
  db.query(await query);
  res.send(query);
});

module.exports = router;
//branch_id, lot_id, prod_id, exp_date, quan
//fetch("http://localhost:8080/products/exporttobranch/123234/324234/23423423/2022-1-21/10");
//localhost:8080/products/exporttobranch/:email_addr/e7b4be2c-dfbe-11ec-b414-061bce7f90f2/:prod_id/2026-05-30/:quan
