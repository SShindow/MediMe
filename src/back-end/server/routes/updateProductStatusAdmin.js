var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/',async function(req, res, next)
{
    await db.query("select update_product_status_admin()");
    res.send();
  }
);

module.exports = router;
