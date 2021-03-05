import dotenv from 'dotenv';
import express from 'express';
import { hash } from 'bcrypt';
import { resolve } from 'path';
import passport from 'passport';
import User from '../models/user.js';
import { checkNotAuthenticated } from '../middlewares/authentication.js';
import {
  getEmailForm,
  getLoginForm,
  getResetPasswordForm,
  getSignupForm,
  logoutUser,
  resetPassword,
  sendVerificationMail,
  signupUser,
  verifyUser 
} from '../controllers/authController.js';

dotenv.config({ path: resolve() + '/.env' });
const router = express.Router();

router.get('/login', checkNotAuthenticated, getLoginForm);

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

router.post('/verify', sendVerificationMail);

router.get('/verify/:userId', verifyUser);

router.get('/reset', getEmailForm);

router.post('/reset', resetPassword);

router.get('/reset/:userId', getResetPasswordForm);

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

router.get('/register', checkNotAuthenticated, getSignupForm)

router.post('/register', checkNotAuthenticated, signupUser);

router.delete('/logout', logoutUser);

export default router;