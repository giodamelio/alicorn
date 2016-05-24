import config from 'config';
import passport from 'koa-passport';
import bcrypt from 'bcrypt';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Strategy as LocalStrategy } from 'passport-local';

import { createChildLogger } from './logger';

const logger = createChildLogger('auth');

export default function (app, router, database) {
  const users = database.collection('users');

  // Serialize and deserialize users
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    users.findOne({ _id: id })
      .then((user) => {
        done(null, user);
      });
  });

  // Setup passport auth strategies
  // Username and password
  passport.use(new LocalStrategy((username, password, done) => {
    logger.trace({ username }, 'Logging in with user/pass');
    users.findOne({ username }, (err, user) => {
      if (err) {
        logger.error(err);
        return done(err);
      }

      // If user does not exist, exit
      if (!user) {
        logger.trace({ username }, 'User does not exist');
        return done(null, false);
      }

      // Check if password is valid
      return bcrypt.compare(password, user.password, (passwordErr, result) => {
        if (!result) {
          logger.trace({ username }, 'Password incorrect');
          return done(null, false);
        }

        logger.trace({ username }, 'Login successfull');
        return done(null, user);
      });
    });
  }));

  // Github OAuth
  passport.use(new GitHubStrategy({
    clientID: config.get('auth.github.id'),
    clientSecret: config.get('auth.github.secret'),
    callbackURL: config.get('auth.github.callback'),
  }, (accessToken, refreshToken, profile, cb) => {
    logger.trace('Logging in with Github');
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    logger.info(profile);
    cb(null, true);
  }));

  // Add passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Add auth routes

  // Local
  router.post('/auth/local/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));
  router.get('/auth/local/logout', async (ctx) => {
    ctx.logout();
    ctx.redirect('/');
  });

  // Github
  router.get('/auth/github', passport.authenticate('github'));
  router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));
}
