const User = require("../models/User");
const Job = require("../models/Job");
const jwt = require("jsonwebtoken");

///////token

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.signup_post = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    gitHub,
    profilePicture,
    pdfFile,
    password,
    confirmPassword,
  } = req.body;

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      gitHub,
      profilePicture,
      pdfFile,
      password,
    });

    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json({ user: user._id });
  } catch (err) {
    console.log({ error: err });
    // const errors = handleErrors(err);
    // res.status(400).json({ errors });
  }
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
    console.log({ error: err });
    //  const errors = handleErrors(err);
    //  res.status(400).json({ errors });
  }
};

module.exports.profile = async (req, res) => {
  try {
    let userId = req.user._id;

    let user = await User.findById(userId);
    console.log({ userData: user });
    res.status(200).json({ user });
  } catch (err) {
    console.log({ error: err });
    // Handle errors appropriately
    res.status(500).json({ error: "Internal Server Error" });
  }
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
    coments,
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
      coments,
    });

    res.status(201).json({ job: job._id });
  } catch (err) {
    console.log({ error: err });
    // const errors = handleErrors(err);
    // res.status(400).json({ errors });
  }
};
