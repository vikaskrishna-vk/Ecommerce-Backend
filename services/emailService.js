const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendMail(options) {
  return transporter.sendMail(options);
}

async function sendProductAdded({ to, product }) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Product Added Successfully",
    html: `<h2>Product Added</h2><p>Product <strong>${product.title}</strong> was added successfully.</p>`,
  };
  return sendMail(mailOptions);
}

async function sendRegistration({ to, username }) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Registration Successful",
    html: `<h2>Welcome ${username}!</h2><p>Your registration was successful.</p>`,
  };
  return sendMail(mailOptions);
}

module.exports = { sendMail, sendProductAdded, sendRegistration };
