const requireUser = require("../middlewares/requireUser");
const userController = require("../controllers/userController");
const router = require("express").Router();

router.post(
	"/follow",
	requireUser,
	userController.followAndUnfollowUserController
);
router.get(
	"/getPostsOfFollowing",
	requireUser,
	userController.getPostsOfFollowingController
);
router.get("/getMyPosts", requireUser, userController.getMyPostsController);
router.get("/getUserPosts", requireUser, userController.getUserPostsController);
router.delete("/", requireUser, userController.deleteMyProfileController);

module.exports = router;
