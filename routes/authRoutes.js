const { Router } = require("express");
const moduleController = require("../controllers/moduleController");
const router = Router();

// Sign up
router.get("/signup", moduleController.signup_get);
router.post("/signup", moduleController.signup_post);

// Login
router.get("/login", moduleController.login_get);
router.post("/login", moduleController.login_post);

// My Profile
router.get("/profile", moduleController.profile);

module.exports = router;
