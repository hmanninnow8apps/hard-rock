const nodemailer = require('nodemailer');

let config = {
  service: 'gmail',
  auth:{
    user:process.env.GMAIL_ACCOUNT,
    pass:process.env.GMAIL_PASSWORD
  }
}

const transporter = nodemailer.createTransport(config);
// const transporter = nodemailer.createTransport({
//   host: "localhost",
//   port: 1025
// });


const sendMail = async (to, subject, text) =>{
 
  const obj = await transporter.sendMail({
    from: "localhost@mailhog.local",
    to,
    subject,
    text
  });
 
  if (!obj) {
    res.status(500).json({
      status: "internal server error",
      message: "error sending message"
    });
  }
 
  console.log({
    status: "create",
    message: "message sent"
  });

}

module.exports = {sendMail};


