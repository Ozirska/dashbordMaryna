module.exports.signup_get = (req, res) => {
  res.json({ msg: "SIGNUP" });
};

module.exports.signup_post = (req, res) => {
  console.log(req.body);
};
module.exports.login_get = (req, res) => {
  res.json({ msg: "LOGIN" });
};

module.exports.login_post = (req, res) => {
  console.log(req.body);
};

module.exports.profile = (req, res) => {
  res.json({ msg: "MY PROFILE" });
};
