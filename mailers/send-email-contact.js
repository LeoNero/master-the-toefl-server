const nodemailer = require('nodemailer');
const config = require('../config/config.js');

function sendEmail(msg, callback) {
  const transporter = nodemailer.createTransport('smtps://' + config.MAILER_USER + ':' + config.MAILER_PASS + '@smtp.gmail.com');

  let mailOptions = {
    from: '"Master the TOEFL" <contact@masterthetoefl.com>',
    to: 'leonardofelipenerone@gmail.com',
    subject: 'Found any bug? Have any suggestions?',
    text: msg,
    html: '<b>' + msg + '</b>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    callback(error, info);
  });
}

module.exports = (msg, callback) => {
  sendEmail(msg, callback);
}