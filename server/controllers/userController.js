const User = require("../models/User");
const Post = require("../models/Post");
const { error, success } = require("../utils/responseWrapper");

const followAndUnfollowUserController = async (request, response) => {
	try {
		const { userIdToFollow } = request.body;
		const curUserId = request._id;

		const userToFollow = await User.findById(userIdToFollow);
		const curUser = await User.findById(curUserId);

		if (curUserId === userIdToFollow) {
			return response.send(error(409, "Users cannot follow themselves"));
		}

		if (!userToFollow) {
			return response.send(error(404, "User to follow not found"));
		}

		if (curUser.followings.includes(userIdToFollow)) {
			//already followed
			const followingIndex = curUser.followings.indexOf(userIdToFollow);
			curUser.followings.splice(followingIndex, 1);

			const followerIndex = userToFollow.followers.indexOf(curUser);
			userToFollow.followers.splice(followerIndex, 1);
			await userToFollow.save();
			await curUser.save();

			response.send(success(200, "User unfollowed"));
		} else {
			//not followed

			userToFollow.followers.push(curUserId);
			curUser.followings.push(userToFollow);
			await userToFollow.save();
			await curUser.save();
			response.send(success(200, "User followed"));
		}
	} catch (e) {
		return response.send(error(500, e.message));
	}
};

const getPostsOfFollowingController = async (request, response) => {
	//In this way we check all the posts and find which has the current user's followings. We fetch all of them
	try {
		const curUserId = request._id;
		const curUser = await User.findById(curUserId);

		const posts = await Post.find({
			owner: {
				$in: curUser.followings,
			},
		});

		return response.send(success(200, posts));
	} catch (e) {
		return response.send(error(500, e.message));
	}
};

const getMyPostsController = async (request, response) => {
	try {
		const curUserId = request._id;

		const allUserPosts = await User.find({
			owner: curUserId,
		}).populate("likes");
		response.send(success(200, { allUserPosts }));
	} catch (e) {
		return response.send(error(500, e.message));
	}
};
const getUserPostsController = async (request, response) => {
	try {
		const userId = request.body.userId;

		if (!userId) {
			return response.send(error(400, "userId is required"));
		}

		const allUserPosts = await User.find({
			owner: userId,
		}).populate("likes");
		response.send(success(200, { allUserPosts }));
	} catch (e) {
		return response.send(error(500, e.message));
	}
};

const deleteMyProfileController = async (request, response) => {
	try {
		const curUserId = request._id;
		const curUser = await User.findById(curUserId);

		//delete all posts
		await Post.deleteMany({
			owner: curUserId,
		});

		//ye user jitne bhi logo ko follow karta hai unsab ke following vali entry me se delete karna hai
		curUser.followers.forEach(async (followerId) => {
			const follower = await User.findById(followerId);
			const index = follower.followings.indexOf(curUserId);
			follower.followings.splice(index, 1);
			await follower.save();
		});

		//ab ye user jitne bhi logo ko follow karta hai unsab ki followers ki list me se bhi nikal jayega
		curUser.followings.forEach(async (followingId) => {
			const following = await User.findById(followingId);
			const index = following.followers.indexOf(curUserId);
			following.followers.splice(index, 1);
			await following.save();
		});

		//ab jidhar bhi like kiya tha waha se likes bhi gayab ho jayenge
		const allPosts = await Post.find();
		allPosts.forEach(async (post) => {
			const index = post.likes.indexOf(curUserId);
			post.likes.splice(index, 1);
			await post.save();
		});

		//ab user finally delete kar sakte hai
		await curUser.remove();

		//cookie bhi delete karenge iski
		response.clearCookie("jwt", {
			httpOnly: true,
			secure: true,
		});

		return response.send(success(200, "User deleted successfully"));
	} catch (e) {
		return response.send(error(500, e.message));
	}
};

module.exports = {
	followAndUnfollowUserController,
	getPostsOfFollowingController,
	getMyPostsController,
	getUserPostsController,
	deleteMyProfileController,
};
