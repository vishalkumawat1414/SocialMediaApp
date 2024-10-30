const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const UserController = require("../controllers/userController");

router.post("/follow",requireUser,UserController.followOrUnfollowUserController,);
router.get("/getMyPosts", requireUser, UserController.getMyPosts);
router.get("/getFeedData", requireUser, UserController.getFeedData);
router.get("/getUserPosts", requireUser, UserController.getUserPosts);
router.delete("/", requireUser, UserController.deleteMyProfile);
router.get("/getMyInfo", requireUser, UserController.getMyInfo);
router.put("/", requireUser, UserController.updateMyProfile);
router.post("/getUserProfile", requireUser, UserController.getUserProfile);

module.exports = router;
