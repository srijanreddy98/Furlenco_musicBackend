const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const { keys } = require('../keys/keys');
const { User } = require('../models/models');
const jwt = require('jsonwebtoken');

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
})
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.GoogleclientID,
      clientSecret: keys.Googleclient_secret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      User.findOne({ googleId: profile.id }).then(
        (doc) => {
          console.log('here2');
          if (doc && doc.email === profile.emails[0].value) {
            done(null, doc);
          } else {
                    User({
                      googleId: profile.id,
                      firstName: profile.name.givenName + profile.name.familyName,
                      email: profile.emails[0].value
                    }).save().then(
                      (doc) => {
                        console.log('here');
                        done(null, doc);
                      }
                    );
          }
        }
      )
    }
  ));
passport.use(new FacebookStrategy({
  clientID: keys.FacebookClientID,
  clientSecret: keys.FacebookClient_secret,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  proxy: true
},
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ twitterId: profile.id }).then(
      (doc) => {
        console.log('here2');
        
        // if (doc && doc.email === profile.emails[0].value) {
        //   done(null, doc);
        // } else {
        //   User({
        //     googleId: profile.id,
        //     firstName: profile.name.givenName,
        //     lastName: profile.name.familyName,
        //     email: profile.emails[0].value
        //   }).save().then(
        //     (doc) => {
        //       console.log('here');
        //       done(null, doc);
        //     }
        //   );
        // }
      }
    );
  }
));
passport.use(new TwitterStrategy({
  consumerKey: keys.TwitterClientID,
  consumerSecret: keys.TwitterClient_secret,
  callbackURL: "/auth/twitter/callback",
  proxy: true
},
  (token, tokenSecret, profile, done) => {
    User.findOne({ twitterId: profile.id }).then(
      (doc) => {
        console.log('here2');
        if (doc && doc.twitterUserName === profile.username) {
          done(null, doc);
        } else {
          User({
            twitterId: profile.id,
            name: profile.name,
            twitterUserName: profile.username
          }).save().then(
            (doc) => {
              console.log('here');
              done(null, doc);
            }
          );
        }
      }
    );
  }
));
passport.use(new InstagramStrategy({
  clientID: keys.InstaClientID,
  clientSecret: keys.InstaClient_secret,
  callbackURL: "/auth/instagram/callback"
},
  function (accessToken, refreshToken, profile, done) {
    console.log(profile);
  }
));