const User = require("../models/User");
const Job = require("../models/Job");
const jwt = require("jsonwebtoken");
const { handleJobErrors } = require("./errorController");

///////token

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "dashboard secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    console.log({ msg: "USER LOGIN" });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleUserErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.profile = (req, res) => {
  res.render("profile");
};

///////////

module.exports.create_get = (req, res) => {
  res.render("createJob");
};

module.exports.create_post = async (req, res) => {
  const {
    jobTitle,
    website,
    employerName,
    email,
    phone,
    address,
    origin,
    status,
    comments,
    userId,
  } = req.body;

  try {
    const job = await Job.create({
      jobTitle,
      website,
      employerName,
      email,
      phone,
      address,
      origin,
      status,
      comments,
      userId,
    });

    res.status(201).json({ job: job._id });
  } catch (err) {
    console.log({ error: err });

    // Check if the error is a Mongoose validation error
    if (err.name === "ValidationError") {
      const errors = handleJobErrors(err);
      res.status(400).json({ errors });
    } else {
      // Handle other types of errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports.jobDetails_get = (req, res) => {
  res.render("jobDetails");
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "net ninja secret", { maxAge: 1 });
  res.redirect("/");
};
