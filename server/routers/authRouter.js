const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signupController);
router.post("/login", authController.loginController);
router.post("/logout", authController.loginController);
router.get("/refresh", authController.logoutController);

module.exports = router;
