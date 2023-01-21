const { success, error } = require("../utils/responseWrapper");
const Post = require("../models/Post");
const User = require("../models/User");

const createPostController = async (request, response) => {
	try {
		const { caption } = request.body;
		const owner = request._id;

		if (!caption) {
			response.send(error(400, "Caption is required"));
		}

		const user = await User.findById(request._id);
		const post = await Post.create({
			owner,
			caption,
		});

		user.posts.push(post._id);
		await user.save();

		return response.send(success(201, post));
	} catch (e) {
		console.log(e);
		return response.send(error(500, e.message));
	}
};

const likeAndUnlikePostController = async (request, response) => {
	try {
		const { postId } = request.body;
		const curUserId = request._id;

		const post = await Post.findById(postId);
		if (!post) {
			return response.send(error(404, "Post not found"));
		}

		if (post.likes.includes(curUserId)) {
			const index = post.likes.indexOf(curUserId);
			post.likes.splice(index, 1);
			await post.save();
			return response.send(success(200, "post unliked"));
		} else {
			post.likes.push(curUserId);
			await post.save();
			return response.send(success(200, "post liked"));
		}
	} catch (e) {
		return response.send(error(500, e.message));
	}
};

const updatePostController = async (request, response) => {
	try {
		const { postId, caption } = request.body;
		const curUserId = request._id;

		const post = await Post.findById(postId);

		if (!post) {
			return response.send(error(404, "Post not found"));
		}

		if (post.owner.toString() !== curUserId) {
			return response.send(
				error(403, "Only owners can update their post")
			);
		}

		if (caption) {
			post.caption = caption;
		}

		await post.save();
		return response.send(success(200, { post }));
	} catch (e) {
		return response.send(error(500, e.message));
	}
};

const deletePostController = async (request, response) => {
	try {
		const { postId } = request.body;
		const curUserId = request._id;
		const post = await Post.findById(postId);
		const curUser = await User.findById(curUserId);

		if (!post) {
			return response.send(error(404, "Post not found"));
		}

		if (post.owner.toString() !== curUserId) {
			return response.send(
				error(403, "Only owners can delete their posts")
			);
		}

		//removing post from the user's database
		const postIndex = curUser.posts.indexOf(postId);
		curUser.posts.splice(postIndex, 1);
		await curUser.save();
		//removing post from everywhere
		await post.remove();

		return response.send(success(200, "post deleted successfully"));
	} catch (e) {
		return response.send(error(500, e.message));
	}
};

module.exports = {
	createPostController,
	likeAndUnlikePostController,
	updatePostController,
	deletePostController,
};
