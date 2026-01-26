/* This module handles the login route for a web application.
   It authenticates the user and returns a JWT token and user data. */

const router = require("express").Router();
const jwt = require("jwt-simple");
const passport = require("passport");

router.use(passport.initialize());

require("../auth/passAuth");

const requireLogin = passport.authenticate("local", { session: false });

const generateToken = (userRecord) => {
  const timestamp = new Date().getTime();
  return jwt.encode(
    { sub: userRecord.id, iat: timestamp },
    process.env.JWT_SECRET
  );
};

router.post("/login", requireLogin, (req, res) => {
  res.json({
    token: generateToken(req.user),
    wins: req.user.wins,
    losses: req.user.losses,
    name: req.user.name,
    savedGame: req.user.savedGame,
    email: req.user.email,
  });
});

module.exports = router;
