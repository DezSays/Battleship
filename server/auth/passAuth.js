/* This code sets up authentication strategies for a Node.js application using Passport.js */
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const db = require("../models");

const localLogin = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const records = await db.User.findAll({ where: { email } });

      if (!records.length) return done(null, false);

      const user = records[0];

      bcrypt.compare(password, user.password, (error, match) => {
        if (error) return done(error);
        if (!match) return done(null, false);
        return done(null, user);
      });
    } catch (error) {
      console.log(error.message);
      return done(error);
    }
  }
);

passport.use(localLogin);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const userID = payload.sub;
    const user = await db.User.findByPk(userID);

    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error);
  }
});

passport.use(jwtLogin);
