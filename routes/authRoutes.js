const { Router } = require("express");
const moduleController = require("../controllers/moduleController");
const router = Router();
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

// Sign up
router.get("/signup", moduleController.signup_get);

// Login
router.get("/login", moduleController.login_get);
router.post("/login", moduleController.login_post);

// My Profile
router.get("/profile", requireAuth, moduleController.profile);

//create Job
router.get("/createJob", requireAuth, moduleController.create_get);
router.post("/createJob", moduleController.create_post);

//jobDetails

router.get("/jobDetails/:id", requireAuth, moduleController.renderJob_get);
router.delete("/delete/:id", requireAuth, moduleController.deleteJob_delete);
router.get("/updateJob/:id", requireAuth, moduleController.updateJob_get);
router.put("/updateJob/:id", requireAuth, moduleController.updateJob_put);

///logout
router.get("/logout", moduleController.logout_get);

module.exports = router;
