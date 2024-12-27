// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// const generateInvoice = (order, path) => {
//   let doc = new PDFDocument({ size: 'A4', margin: 50 });

//   doc.pipe(fs.createWriteStream(path));

//   // Header
//   doc.fontSize(20).text('Invoice', { align: 'center' });
//   doc.moveDown();

//   // Shipping Info
//   doc.fontSize(10).text(`First Name: ${order.shippingInfo.firstName}`);
//   doc.fontSize(10).text(`Last Name: ${order.shippingInfo.lastName}`);
//   doc.fontSize(10).text(`Address: ${order.shippingInfo.address}`);
//   doc.fontSize(10).text(`City: ${order.shippingInfo.city}`);
//   doc.fontSize(10).text(`State: ${order.shippingInfo.state}`);
//   doc.fontSize(10).text(`Landmark: ${order.shippingInfo.landmark}`);
//   doc.fontSize(10).text(`Pincode: ${order.shippingInfo.pincode}`);
//   doc.moveDown();

//   // Order Items
//   doc.fontSize(14).text('Order Items:', { underline: true });
//   order.orderItems.forEach(item => {
//     doc.fontSize(10).text(`Product ID: ${item.product}`);
//     doc.fontSize(10).text(`Quantity: ${item.quantity}`);
//     doc.fontSize(10).text(`Price: ${item.price}`);
//     doc.moveDown();
//   });

//   // Total Price
//   doc.fontSize(10).text(`Total Price: ${order.totalPrice}`);
//   doc.fontSize(10).text(`Total Price After Discount: ${order.totalPriceAfterDiscount}`);
//   doc.moveDown();

//   // Payment Info
//   doc.fontSize(14).text('Payment Info:', { underline: true });
//   doc.fontSize(10).text(`Razorpay Order ID: ${order.paymentInfo.razorpayOrderId}`);
//   doc.fontSize(10).text(`Razorpay Payment ID: ${order.paymentInfo.razorpayPaymentId}`);
//   doc.moveDown();

//   // Footer
//   doc.fontSize(10).text(`Order Status: ${order.orderStatus}`, { align: 'right' });
//   doc.fontSize(10).text(`Paid At: ${order.paidAt}`, { align: 'right' });

//   doc.end();
// };

// module.exports = generateInvoice;
const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateInvoice = (order, path) => {
  let doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.pipe(fs.createWriteStream(path));

  // Header
  doc
    .fontSize(25)
    .fillColor('#007ACC')
    .text('Invoice', { align: 'center' })
    .moveDown(2);

  // Add a line below the header
  doc
    .moveTo(50, 120)
    .lineTo(550, 120)
    .stroke();

  // Shipping Info
  doc
    .fontSize(12)
    .fillColor('black')
    .text('Shipping Information:', { underline: true })
    .moveDown();

  doc
    .fontSize(10)
    .text(`First Name: ${order.shippingInfo.firstName}`)
    .text(`Last Name: ${order.shippingInfo.lastName}`)
    .text(`Address: ${order.shippingInfo.address}`)
    .text(`City: ${order.shippingInfo.city}`)
    .text(`State: ${order.shippingInfo.state}`)
    .text(`Landmark: ${order.shippingInfo.landmark}`)
    .text(`Pincode: ${order.shippingInfo.pincode}`)
    .moveDown(1.5);

  // Order Items
  doc
    .fontSize(12)
    .fillColor('#007ACC')
    .text('Order Items:', { underline: true })
    .moveDown(0.5);

  order.orderItems.forEach(item => {
    doc
      .fontSize(10)
      .fillColor('black')
      .text(`Product ID: ${item.product}`)
      .text(`Quantity: ${item.quantity}`)
      .text(`Price: ${item.price}`)
      .moveDown(1);
  });

  // Total Price
  doc
    .fontSize(12)
    .fillColor('black')
    .text(`Total Price: ${order.totalPrice}`)
    .text(`Total Price After Discount: ${order.totalPriceAfterDiscount}`)
    .moveDown(1.5);

  // Payment Info
  doc
    .fontSize(12)
    .fillColor('#007ACC')
    .text('Payment Information:', { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .fillColor('black')
    .text(`Razorpay Order ID: ${order.paymentInfo.razorpayOrderId}`)
    .text(`Razorpay Payment ID: ${order.paymentInfo.razorpayPaymentId}`)
    .moveDown(1.5);

  // Footer
  doc
    .fontSize(10)
    .fillColor('gray')
    .text(`Order Status: ${order.orderStatus}`, { align: 'right' })
    .text(`Paid At: ${order.paidAt}`, { align: 'right' })
    .moveDown(1.5);

  // Add footer line
  doc
    .moveTo(50, 750)
    .lineTo(550, 750)
    .stroke();

  doc.end();
};

module.exports = generateInvoice;
