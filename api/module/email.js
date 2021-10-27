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
function SendMail(mailTitle, mailBodyHtmlContent) {
  return new Promise(function (resolve, reject) {
    const emailAddresses = getEmailAddresses();
    const len = emailAddresses.length;
    sendEmailsSequentially(len).then(result => {
      resolve(result);
    }).catch(error => {
      reject(error);
    });

    async function sendEmailsSequentially(len) {
      // Execute email tasks
      for (let i = 0; i < len; i++) {
        await emailSender(emailAddresses[i], mailTitle, mailBodyHtmlContent).then(result => {
        }).catch(error => {
          console.error(error);
        });
      }
    }
  });
}

exports.SendMail = SendMail;


function getEmailAddresses() {
  return String(process.env.EMAIL_TO_ADDRESS).split(",");
}


async function emailSender(toEmailAddress, mailTitle, mailBodyHtmlContent) {
  console.log('Executing mail send to: ' + toEmailAddress);
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
    to: toEmailAddress,
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
