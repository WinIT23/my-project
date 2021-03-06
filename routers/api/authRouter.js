import dotenv from 'dotenv';
import express from 'express';
import { resolve } from 'path';
import passport from 'passport';
import {
  getEmailForm,
  getLoginForm,
  getResetPasswordForm,
  getSignupForm,
  logoutUser,
  resetPassword,
  resetPasswordMail,
  sendVerificationMail,
  signupUser,
  verifyUser 
} from '../controllers/authController.js';

dotenv.config({ path: resolve() + '/.env' });
const router = express.Router();

router.get('/login', getLoginForm);

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

router.post('/verify', sendVerificationMail);
router.get('/verify/:userId', verifyUser);

router.get('/reset', getEmailForm);
router.post('/reset', resetPasswordMail);
router.get('/reset/:userId', getResetPasswordForm);
router.post('/reset/:userId', resetPassword);

router.get('/register', getSignupForm)
router.post('/register', signupUser);

router.delete('/logout', logoutUser);

export default router;