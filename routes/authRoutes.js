const { Router } = require("express");
const moduleController = require("../controllers/moduleController");
const router = Router();
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

// Sign up
router.get("/signup", moduleController.signup_get);
router.post("/signup", moduleController.signup_post);

// Login
router.get("/login", moduleController.login_get);
router.post("/login", moduleController.login_post);

// My Profile
router.get("/profile", requireAuth, moduleController.profile);

//create Job
router.get("/create", requireAuth, moduleController.create_get);
router.post("/create", moduleController.create_post);

///logout
router.get("/logout", moduleController.logout_get);

module.exports = router;
