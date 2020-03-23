"use strict";
const nodeMailer = require("nodemailer");
const dotEnv = require('dotenv');
dotEnv.config();


/**
 * Send mail to recipient
 * @param {String} mailTitle
 * @param {String} mailBodyHtmlContent
 * @return {Promise<void>}
 * @constructor
 */
async function SendMail(mailTitle, mailBodyHtmlContent,
) {
  console.log('Executing mail send to: ' + process.env.EMAIL_TO_ADDRESS);
  let transporter = nodeMailer.createTransport({
    host: String(process.env.EMAIL_HOST), // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: Number(process.env.EMAIL_PORT), // port for secure SMTP
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: String(process.env.EMAIL_USER),
      pass: String(process.env.EMAIL_PASSWORD)
    }
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '<' + String(process.env.EMAIL_USER) + '>', // sender address
    to: process.env.EMAIL_TO_ADDRESS,
    subject: mailTitle,
    // text: mailTextContent, // plain text body
    html:
      '<html>' +
      '<head>' +
      '<style>' +
      'table {' +
      'font-family: arial, sans-serif;' +
      'border-collapse: collapse;' +
      'width: 100%;' +
      '}' +
      '' +
      'td, th {' +
      'border: 1px solid #dddddd;' +
      'text-align: left;' +
      'padding: 8px;' +
      '}' +
      '' +
      'tr:nth-child(even) {' +
      'background-color: #dddddd;' +
      '}' +
      '</style>' +
      '</head>' +
      '<body>' +
      mailBodyHtmlContent +
      '</body>' +
      '</html>'
  });
  console.log("Email message sent: %s", info.messageId);
}

exports.SendMail = SendMail;
