import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';
dotenv.config();

let transporter = createTransport({
  service: 'outlook',
  auth: {
    user: 'vinit.chauhan001@outlook.com',
    pass: process.env.EMAIL_PASSWD
  }
});

let verificationMail = {
  from: 'vinit.chauhan001@outlook.com',
  to: 'chauhanvineet22@yahoo.com',
  subject: 'Email Verification | Mob Activity Detection',
  text: ''
};

export { transporter, verificationMail };