const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signUpcontroller);
router.post("/login", authController.logincontroller);
router.get("/refresh", authController.refreshAccessTokenController);
router.post("/logout", authController.logoutController);
module.exports = router;
