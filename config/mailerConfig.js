import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';
dotenv.config();

let transporter = createTransport({
  service: 'outlook',
  auth: {
    user: 'adit.17005@outlook.com',
    pass: process.env.EMAIL_PASSWD
  }
});

let verificationMail = {
  from: 'adit.17005@outlook.com',
  to: 'chauhanvineet22@yahoo.com',
  subject: 'Email Verification | Mob Activity Detection',
  text: ''
};

export { transporter, verificationMail };