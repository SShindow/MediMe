const pdfGenerator = require('pdfkit');
const fs = require('fs');

class InvoiceGenerator {
    constructor(invoice) {
        this.invoice = invoice;
    }

    generateHeaders(doc) {
        //put the icon
        doc.image('../front-end/components/assets/medime_icon.png', 30, 0, { width: 200});
        doc.fillColor('#000');
        doc.fontSize(20);
        doc.text('INVOICE', 275, 50, {align: 'right', bold: true});
        doc.fontSize(15);
        doc.text(`Invoice ID: ${this.invoice[0].invoice_id}`, {align: 'right'});
        doc.text(`Date: ${this.invoice[0].export_date.toDateString()}`, {align: 'right'});
        doc.text(`Employee: ${this.invoice[0].employee_id}`, {align: 'right'});
        doc.text(`Customer Phone: ${this.invoice[0].cust_phone}`, {align: 'right'});
        doc.moveDown();
        const beginningOfPage = 50;
        const endOfPage = 550;

        // doc.moveTo(beginningOfPage, 200);
        // doc.lineTo(endOfPage,200);
        // doc.stroke();

        doc.fontSize(10);
        doc.text('Thank you for purchasing at our store. Please come again.', 50, 210, {align: 'center'});
        // doc.moveTo(beginningOfPage, 250);
        // doc.lineTo(endOfPage, 250);
        // doc.stroke();
    }

    generateTable(doc) {
        const beginningOfPage = 50;
        const endOfPage = 550;
        const tableTop = 270;
        const productNameX = 50;
        const priceX = 220;
        const quantityX = 340;
        const amountX = 480;
        doc.fontSize(15);
        doc.text('Product Name', productNameX, tableTop);
        doc.text('Price', priceX, tableTop);
        doc.text('Quantity', quantityX, tableTop);
        doc.text('Amount', amountX, tableTop);

        let i = 0;
        let total = 0;

        for (i = 0; i < this.invoice.length; i++) {
            const item = this.invoice[i];
            var y = tableTop + (i+1)*25;
            doc.fontSize(15);
            doc.text(item.product_name, productNameX, y);
            doc.text(item.price, priceX, y);
            doc.text(item.quantity, quantityX, y);
            doc.text(Number(Number(item.price * item.quantity).toFixed(2)), amountX, y);
            total = total + item.price * item.quantity;
        }
        doc.moveTo(beginningOfPage, y + 20);
        doc.lineTo(endOfPage, y + 20);
        doc.stroke();
        doc.text('Total (VAT 8% Paid)', productNameX, y + 25);
        doc.text(Number(Number(total * 1.08).toFixed(2)), amountX, y + 25);
    }

    generateFooter(doc) {
        doc.fontSize(10);
        doc.text('End of Invoice.', 50, 700, {align: 'center'});
    }

    generate(doc) {
        // let output = new pdfGenerator;
        // console.log(this.report);
        // const fileName = 'src/back-end/daily_report/daily_report.pdf';
        // output.pipe(fs.createWriteStream(fileName));
        this.generateHeaders(doc);
        doc.moveDown();
        this.generateTable(doc);
        this.generateFooter(doc);
        // output.end()
    }
}

module.exports = InvoiceGenerator;