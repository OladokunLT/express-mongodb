const nodemailer = require("nodemailer");

const tp = nodemailer.createTransport({
  service: "gmail",
  smtp: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
  port: 465,
});

async function sendEmail(to, subject, body) {
  await tp.sendMail({
    from: "lukmanoladokun86@gmail.com",
    to,
    subject,
    html: body,
  });
}

module.exports = {
  sendEmail,
};
