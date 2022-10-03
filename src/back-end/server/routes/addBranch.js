var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/:address',async function(req, res, next) {
  //db.query("insert into branch(address) values('address 10')");
  //res.send(`<h1>${req.params.id}</h1>`);

  var query = "insert into branch(address) values("+ "'" + req.params.address + "'" + ")";
  db.query(query);
  res.send(query);
});

module.exports = router;
//branch_id, lot_id, prod_id, exp_date, quan
