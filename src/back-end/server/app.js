const express = require("express");
const fs = require('fs');
//const createError = require('http-errors');
//const cors = require("cors");

const PORT = process.env.PORT || 8080;

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}



var app = express();
var getProdAPI = require('./routes/getProduct.js');
var exportBranchAPI = require('./routes/exportBranch.js');
var addBranchAPI = require('./routes/addBranch.js');
var getDailyReportAPI = require('./routes/getDailyReportData.js');
var getMonthlyReportAPI = require('./routes/getMonthlyReportData.js');
var getInvoiceAPI = require('./routes/getInvoiceData.js');
var getImportDetailsAPI = require('./routes/getImportDetails.js');
var getExportDetailsAPI = require('./routes/getExportDetails.js');
var importProductAPI = require('./routes/importProduct.js');
var updateExpiringDateAPI = require('./routes/updateExpiringDate.js');
var getBranchProdAPI = require('./routes/getBranchProduct.js');
var createInvoiceAPI = require('./routes/createInvoice.js');
var exportCustomerAPI = require('./routes/exportCustomer.js');
var addEmployeeAPI = require('./routes/addEmployee.js');
var deleteEmployeeAPI = require('./routes/deleteEmployee.js');
var updateProductStatusAdminAPI = require('./routes/updateProductStatusAdmin.js');
var getInvoiceAfterExportAPI = require('./routes/getInvoiceAfterExport.js');
// Let the app listen for request on port 8080
app.listen(PORT, console.log(`Server started on port ${PORT}`));

//app.use(cors());
//app.use(express.json());

//Catch 404 and forward to error handler
/*
app.use(function(req, res, next)
{
  next(createError(404));
});

//Error handler
app.use(function(err, req, res, next, )
{
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  //render the error page
  res.status(err.status || 500);
  res.render("error");
});
*/
app.get('/', function(req, res)
{
  res.send('welcome to backend');
})
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use('/products/getproduct', getProdAPI);
app.use('/products/exporttobranch', exportBranchAPI);
app.use('/products/importproduct', importProductAPI);
app.use('/branches', addBranchAPI);
app.use('/dailyreport', getDailyReportAPI);
app.use('/monthlyreport', getMonthlyReportAPI);
app.use('/products/updateexpiringdate', updateExpiringDateAPI);
app.use('/products/branch/getproduct', getBranchProdAPI);
app.use('/invoice/create', createInvoiceAPI);
app.use('/customer/export', exportCustomerAPI);
app.use('/employee/add', addEmployeeAPI);
app.use('/employee/delete', deleteEmployeeAPI);
app.use('/products/updatestatus/admin', updateProductStatusAdminAPI);
app.use('/invoice/pdf', getInvoiceAPI);
app.use('/reports/import', getImportDetailsAPI);
app.use('/reports/export', getExportDetailsAPI);
app.use('/invoice/now', getInvoiceAfterExportAPI);

module.exports = app;

//reference: https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
