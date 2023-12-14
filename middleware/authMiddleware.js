const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Job = require("../models/Job");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check json web token exists and is verified

  if (token) {
    jwt.verify(token, "dashboard secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

//check corent user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "dashboard secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        res.locals.jobs = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        const userJobs = await Job.find({ userId: String(user._id) });
        res.locals.jobs = userJobs;
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.locals.jobs = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
