// server/config/passport.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserService from '../services/userService.js';
import config from './index.js'; // config.clientId, clientSecret, callbackURL stb.

const passportLoader = () => {
  // --- LOCAL STRATEGY ---
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await UserService.findByUsername(username);
        if (!user) return done(null, false, { message: 'Incorrect username' });
        const isValid = await UserService.verifyPassword(user, password);
        if (!isValid) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // --- GOOGLE OAUTH STRATEGY ---
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Nézd meg, van-e már a felhasználó
          let user = await UserService.findByGoogleId(profile.id);
          if (!user) {
            // Ha nincs, hozz létre egy új user-t
            user = await UserService.createFromGoogle(profile);
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // --- SERIALIZE / DESERIALIZE ---
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserService.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  return passport;
};

export default passportLoader;
