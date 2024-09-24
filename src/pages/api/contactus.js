export default async function handler(req, res) {
  const { name, lastname, phone, email, subject, message } = req.body;

  const validation = {};

  if (!name || name === '') {
    validation.name = 'Field Required';
  }

  if (!lastname || lastname === '') {
    validation.lastname = 'Field Required';
  }

  if (!phone || phone === '') {
    validation.phone = 'Field Required';
  }

  if (!email || email === '') {
    validation.email = 'Field Required';
  }

  if (!subject || subject === '') {
    validation.subject = 'Field Required';
  }

  if (!message || message === '') {
    validation.message = 'Field Required';
  }

  //EVALUATE IF VALIDATION IS NOT EMPTY
  if (Object.keys(validation).length > 0) {
    return res.status(200).json({
      success: false,
      message: 'There is some Errors in form',
      validation,
    });
  }

  let nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const textMessage = ` Your Receive mail from: ${email} \n
  Name: ${name} \n
  Lastname: ${lastname} \n
  Phone: ${phone} \n
  email: ${email} \n
  Subject: ${subject} \n
  Message: ${message} \n`;

  const textHtml = `<div> <h1>Your Receive mail from: ${email}</h1>
  <p>Name: ${name}</p>
  <p>Lastname: ${lastname}</p>
  <p>Phone: ${phone}</p>
  <p>email: ${email}</p>
  <p>Subject: ${subject}</p>
  <p>Message: ${message}</p>`;

  const mailData = {
    from: process.env.SMTP_USER,
    to:
      email === 'test@example.com'
        ? 'sistev.contacto@gmail.com'
        : 'equioralvalle@hotmail.com',
    subject: `Your Receive with subject: ${subject}`,
    text: textMessage,
    html: textHtml,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err)
      res.status(200).json({
        message: 'Sorry, message not sent, please try again later!!',
        success: false,
      });
    else
      res
        .status(200)
        .json({ success: true, message: 'Message sent successfully' });
  });
}
