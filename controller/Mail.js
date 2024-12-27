// const nodemailer = require("nodemailer");

// let transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.MAIL_ID,
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// exports.sendMail = async function ({ order, html }) {
//   let info = await transporter.sendMail({
//     from: "200670107123.dharmikvaghela50@gmail.com",
//     to: `${order.user.email || req.user.email} `,
//     subject: `New Order:`,
//     html, // Pass the generated HTML with order details
//   });
//   return info;
// };

// exports.invoiceTemplate = function (order) {
//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta http-equiv="x-ua-compatible" content="ie=edge">
//       <title>Email Receipt</title>
//       <meta name="viewport" content="width=device-width, initial-scale=1">
//       <style type="text/css">
//       body, table, td, a {
//         -ms-text-size-adjust: 100%;
//         -webkit-text-size-adjust: 100%;
//       }
//       table {
//         border-collapse: collapse !important;
//       }
//       body {
//         width: 100% !important;
//         height: 100% !important;
//         padding: 0 !important;
//         margin: 0 !important;
//       }
//       a {
//         color: #1a82e2;
//       }
//       </style>
//     </head>
//     <body style="background-color: #D2C7BA;">

//       <table border="0" cellpadding="0" cellspacing="0" width="100%">
//         <tr>
//           <td align="center" bgcolor="#D2C7BA">
//             <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//               <tr>
//                 <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0;">
//                   <h1 style="font-size: 32px;">Thank you for your order!</h1>
//                   <p>Order ID: <strong>${order._id}</strong></p>
//                 </td>
//               </tr>

//               <!-- Order Items -->
//               <tr>
//                 <td align="left" bgcolor="#ffffff" style="padding: 24px;">
//                   <h2>Order Items</h2>
//                   <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                     <thead>
//                       <tr>
//                         <th align="left">Product</th>
//                         <th align="left">Quantity</th>
//                         <th align="left">Price</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       ${order.orderItems
//                         .map(
//                           (item) => `
//                         <tr>
//                           <td>${item.title}</td>
//                           <td>${item.quantity}</td>
//                           <td>$${item.price}</td>
//                         </tr>`
//                         )
//                         .join("")}
//                     </tbody>
//                   </table>
//                 </td>
//               </tr>

//               <!-- Total Price -->
//               <tr>
//                 <td align="left" bgcolor="#ffffff" style="padding: 24px;">
//                   <p><strong>Total Price:</strong> $${order.totalPrice}</p>
//                   <p><strong>Total Price After Discount:</strong> $${
//                     order.totalPriceAfterDiscount
//                   }</p>
//                 </td>
//               </tr>

//               <!-- Shipping Info -->
//               <tr>
//                 <td align="left" bgcolor="#ffffff" style="padding: 24px;">
//                   <h2>Shipping Information</h2>
//                   <p>${order.shippingInfo.firstname} ${
//     order.shippingInfo.lastname
//   }</p>
//                   <p>${order.shippingInfo.street}, ${
//     order.shippingInfo.city
//   }, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}</p>
//                   <p>${order.shippingInfo.phone}</p>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>

//     </body>
//     </html>
//   `;
// };

// const generateInvoiceTemplate = ({
//   orderId,
//   userId,
//   shippingInfo,
//   paymentInfo,
//   paymentMethod,
//   orderItems,
//   totalPrice,
//   totalPriceAfterDiscount,
// }) => {
//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Invoice INV-${orderId}</title>
//       <style>
//           body {
//               font-family: Arial, sans-serif;
//               line-height: 1.6;
//               color: #333;
//               max-width: 800px;
//               margin: 0 auto;
//               padding: 20px;
//           }
//           .header {
//               display: flex;
//               justify-content: space-between;
//               align-items: flex-start;
//               margin-bottom: 40px;
//           }
//           .logo {
//               font-size: 20px;
//               color: #318e4c;
//               font-weight: bold;
//           }
//           .invoice-info {
//               text-align: right;
//           }
//           .invoice-details {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 40px;
//               margin-left: 20px;
//               margin-right: 20px;
//           }
//           .table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-bottom: 20px;
//           }
//           .table th, .table td {
//               border: 1px solid #ddd;
//               padding: 12px;
//               text-align: left;
//           }
//           .table th {
//               background-color: #f2f2f2;
//           }
//           .totals {
//               float: right;
//               width: 300px;
//           }
//           .totals table {
//               width: 100%;
//           }
//           .totals td {
//               padding: 5px;
//           }
//           .totals .total {
//               font-weight: bold;
//               font-size: 1.2em;
//           }
//           .notes {
//               margin-top: 40px;
//           }
//       </style>
//   </head>
//   <body>
//       <div class="header">
//           <div class="logo">SAJIVAN AYURVEDA</div>
//           <div class="invoice-info">
//               <h2>Paid</h2>
//               <p>INV-${orderId}</p>
//           </div>
//       </div>

//       <div class="invoice-details">
//           <div>
//               <h3>Invoice from</h3>
//               <p>Lucian Obrien<br>
//               1147 Rohan Drive Suite 819 - Burlington, VT / 82021<br>
//               +1 416-555-0198</p>
             
              
//           </div>
//           <div>
//               <h3>Invoice to</h3>
//               <p>${shippingInfo.firstName} ${shippingInfo.lastName}<br>
               
//               ${shippingInfo.address},${shippingInfo.lankmark}, ${
//     shippingInfo.city
//   } - ${shippingInfo.state} -${shippingInfo.pincode}<br>
//              </p><br/>
           
//           </div>
//       </div>

//       <div class="invoice-details">
//           <div>
//               <h3>Date create</h3>
//               <p>${new Date().toLocaleDateString()}</p>
//           </div>
//           <div>
//               <h3>Due date</h3>
//               <p>${new Date().toLocaleDateString()}</p>
//           </div>
//       </div>

//       <h3>Invoice details</h3>
//       <table class="table">
//           <thead>
//               <tr>
//                   <th>#</th>
//                   <th>Description</th>
//                   <th>Qty</th>
//                   <th>Unit price</th>
//                   <th>Total</th>
//               </tr>
//           </thead>
//           <tbody>
//               ${orderItems
//                 .map(
//                   (item, index) => `
//                   <tr>
//                       <td>${index + 1}</td>
//                       <td><strong>${
//                         item?.title || item?.product?.title
//                       }</strong></td>
//                       <td>${item.quantity}</td>
//                       <td>${item.price}</td>
//                       <td>${item.price * item.quantity}</td>
//                   </tr>
//               `
//                 )
//                 .join("")}
//           </tbody>
//       </table>

//       <div class="totals">
//           <table>
//               <tr>
//                   <td>Subtotal</td>
//                   <td>$${totalPrice}</td>
//               </tr>
//               <tr>
//                   <td>Discount</td>
//                   <td>-$${totalPrice - totalPriceAfterDiscount}</td>
//               </tr>
//               <tr class="total">
//                   <td>Total</td>
//                   <td>$${totalPriceAfterDiscount}</td>
//               </tr>
//           </table>
//       </div>

//       <div class="notes">
//           <h3>NOTES</h3>
//           <p>We appreciate your business. Should you need us to add VAT or extra notes let us know!</p>
//           <p>Have a question? support@abcapp.com</p>
//       </div>
//       <div style="padding: 30px; background: #ee4c50;">
//       <table role="presentation" style="width: 100%; border-collapse: collapse; color: #ffffff; font-size: 14px;">
//                                 <tr>
//                                     <td style="padding: 0; width: 50%;" align="left">
//                                         <p style="margin: 0; font-size: 14px; line-height: 16px;">&copy; Your Company Name, 2023<br><a href="http://www.example.com" style="color: #ffffff; text-decoration: underline;">View Online</a></p>
//                                     </td>
//                                     <td style="padding: 0; width: 50%;" align="right">
//                                         <table role="presentation" style="border-collapse: collapse;">
//                                             <tr>
//                                                 <td style="padding: 0 5px 0 0;">
//                                                     <a href="http://www.twitter.com/" style="color: #ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" height="38" style="height: auto; display: block; border: 0;" /></a>
//                                                 </td>
//                                                 <td style="padding: 0 5px 0 0;">
//                                                     <a href="http://www.facebook.com/" style="color: #ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" height="38" style="height: auto; display: block; border: 0;" /></a>
//                                                 </td>
//                                             </tr>
//                                         </table>
//                                         </div>
//   </body>
//   </html>
//   `;
// };

// module.exports = generateInvoiceTemplate;
const nodemailer = require('nodemailer');

const generateInvoiceTemplate = async ({ email, subject, html }) => {
  // const transporter = nodemailer.createTransporter({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   secure: true,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASSWORD,
  //   },
  // });
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
});
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject,
    html,
  });
};

module.exports = generateInvoiceTemplate;