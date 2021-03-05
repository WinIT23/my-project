import { compare } from 'bcrypt';
import User from '../models/user.js';
import { Strategy as LocalStrategy } from 'passport-local'

const initialize = (passport) => {
  const authenticateUser = async (email, password, done) => {
    const user = await User.findOne({ email })
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await User.findById(id));
  });
}

export default initialize;