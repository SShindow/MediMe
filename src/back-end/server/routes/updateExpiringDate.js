var express = require('express');
var router = express.Router();
const db = require('../../database/dbfunction.js');
const fs = require('fs');


router.get('/',async function(req, res, next)
{
  /*
  const product_ids = await db.query('select product_id from product');
  const length = await db.query('select count(*) as "length" from product');
  for (let i = 0; i< await length[0].length; i++)
  {
    //for each product
    var prod_id = await product_ids[i].product_id;//get the id
    const exp_dates = await db.query("select expiring_date, quantity from supply_line where product_id = " + "'" + await prod_id + "' order by expiring_date" );
    const exportquantity = await db.query("select product_id, sum(quantity) from serve_line where product_id = " + "'" + await prod_id + "' group by product_id");
    var date;
    if(await exportquantity[0])//query exists
    {
      //console.log(exportquantity);
      var quantity = await exportquantity[0].sum;
      var index = 0;
      var pivotValue = await exp_dates[0].quantity;
      while(await pivotValue < await quantity)//the sold quantity is larger than current pivot
      {
        index+=1;
        pivotValue+= await exp_dates[index].quantity;
      }

      date = await exp_dates[index].expiring_date;
    }
    else {
      {
        date = await exp_dates[0].expiring_date;
      }
    }
*/
    await db.query("select update_product_exp_date()");
    res.send();
  }
);

module.exports = router;
