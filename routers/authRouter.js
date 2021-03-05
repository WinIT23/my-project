import dotenv from 'dotenv';
import express from 'express';
import { hash } from 'bcrypt';
import { resolve } from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import dateFormat from 'dateformat';
import User from '../models/user.js';
import { transporter, verificationMail } from '../config/mailerConfig.js';
import { checkNotAuthenticated } from '../middlewares/authentication.js';

dotenv.config({ path: resolve() + '/.env' });
const router = express.Router();

router.get('/login', checkNotAuthenticated, (_req, res) => {
  res.render('login');
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

router.post('/verify', (req, res) => {
  const date = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
  const link = `${process.env.HOST_URL}/auth/verify/${req.user.id}`;
  verificationMail.to = req.user.email;
  verificationMail.html = `
  <h1>Hello ${req.user.name} </h1> 
  Verify your email by clicking on the link below..
  <a href="${link}"> Verify </a>
  The verification request has been made on ${date}.`

  transporter.sendMail(verificationMail, (err, _info) => {
    if (err)
      console.log(err);
    else {
      res.redirect('/');
    }
  })
});

router.get('/verify/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    user.isMailVerified = true;
    await user.save();
    res.render('user', { user });
    res.redirect('/');
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/reset', (_req, res) => {
  res.render('email');
});

router.post('/reset', async (req, res) => {
  const date = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
  await User.findOne({ email: req.body.email })
    .then(user => {
      let link = `${process.env.HOST_URL}/auth/reset/${user._id}`
      verificationMail.to = user.email;
      verificationMail.html = 
      `<h1>Hello ${user.name} </h1> 
      Reset your password by clicking on the link below..
      <a href="${link}"> Reset Password </a>
      The password reset request has been made on ${date}.`

      transporter.sendMail(verificationMail, (err, _info) => {
        if (err)
          console.log('err : ' + err);
        res.render('login', { messages: { error: 'Check your email for password reset link' } })
      })
    })
    .catch(err => {
      console.log(err);
      res.render('login', { messages: { error: 'Enter valid email' } })
    })
});

router.get('/reset/:userId', async (req, res) => {
  const id = req.params.userId;
  const user = await User.findById(id);
  if (user)
    res.render('reset', { user });
  else
    res.redirect('/auth/login');
});

router.post('/reset/:userId', async (req, res) => {
  const id = req.params.userId;
  const hashedPassword = await hash(req.body.password, 10)
  const user = await User.findById(id);

  if (user) {
    user.password = hashedPassword;
    await user.save();
  }

  res.redirect('/auth/login');
});

router.get('/register', checkNotAuthenticated, (_req, res) => {
  res.render('register')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await hash(req.body.password, 10)
    const user = new User({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isMailVerified: false
    });
    user.save();
    res.redirect('/auth/login');
  } catch {
    res.redirect('/auth/register');
  }
});

router.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/auth/login');
});

export default router;