const router = require("express").Router();
const postController = require("../controllers/postController");
const requireUser = require("../middlewares/requireUser");

router.get("/all", requireUser, postController.getallpostController);
router.post("/", requireUser, postController.createPostController);
router.post("/like", requireUser, postController.likeAndUnlikePost);
router.put("/", requireUser, postController.updatePostController);
router.delete("/:postId", requireUser, postController.deletePost);

module.exports = router;
