var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/:working_address/:role/:mail_addr',async function(req, res, next) {
  //db.query("insert into branch(address) values('address 10')");
  //res.send(`<h1>${req.params.id}</h1>`);
  var working_address = req.params.working_address;
  var role = req.params.role;
  var mail_addr = req.params.mail_addr;
  var branch_id = await db.query("select branch_id from branch where address = '" + working_address + "'");
  var query = "insert into employee(branch_id, role, mail_addr) values('" + await branch_id[0].branch_id + "','"+role +"','"+mail_addr+ "')";
  db.query(query);
  res.send(await query);
});

module.exports = router;
//branch_id, lot_id, prod_id, exp_date, quan
