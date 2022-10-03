var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/:email/:product_id/:customer_phone/:quantity',async function(req, res, next) {
  //db.query("insert into branch(address) values('address 10')");
  //res.send(`<h1>${req.params.id}</h1>`);
  var email = req.params.email;
  var product_id = req.params.product_id;
  var customer_phone = req.params.customer_phone;
  var quantity = req.params.quantity;

  var employee = await db.query("select employee_id from employee where mail_addr = '" + email + "'");
  var invoice = await db.query("select max(invoice_id) from Invoice");
  var query = "insert into serve_line(employee_id, product_id, cust_phone, quantity, invoice_id) values ('" + await employee[0].employee_id + "','" + product_id + "','" + customer_phone + "', " + quantity +"," + await invoice[0].max+")";

  //await query;
  //var query = 'insert into branch_lot_line(branch_id, lot_id, product_id, expiring_date, quantity) values(${branch_id}, lot_id, prod_id, exp_date, quan)';
  await db.query(await query);
  res.send(query);

});

module.exports = router;
