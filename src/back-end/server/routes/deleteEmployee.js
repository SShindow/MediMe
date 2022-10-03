var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/:mail_addr',async function(req, res, next) {
  //db.query("insert into branch(address) values('address 10')");
  //res.send(`<h1>${req.params.id}</h1>`);
  var mail_addr = req.params.mail_addr;
  var query = "delete from employee where mail_addr = '" + mail_addr +"'";
  db.query(query);
  res.send(query);
});

module.exports = router;
//branch_id, lot_id, prod_id, exp_date, quan
