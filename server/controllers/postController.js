const Post = require("../models/Post");
const User = require("../models/User");
const { mapPostOutput } = require("../utils/Utils");
const mongoose = require('mongoose')
const { success, error } = require("../utils/responseWrapper");
const cloudinary = require("cloudinary").v2;

const getallpostController = async (req, res) => {
	await res.send(success(200, "this are all the posts"));
};
const createPostController = async (req, res) => {
	try {
		const { caption, postImg } = req.body;

		if (!caption || !postImg) {
		 	return res.send(error(400, "Caption and postImage are required"));
		}

		const cloudImg = await cloudinary.uploader.upload(postImg, {
			folder: "postImg",
		});
 
		const owner = req._id;

		const user = await User.findById(req._id);

		const post = await Post.create({
			owner,
			caption,
			image: {
				publicId:  cloudImg.public_id,
				url:  cloudImg.url,
			},
		}); 

		user.posts.push(post._id);
		await user.save();

		return res.json(success(200,{ post }));
	} catch (e) {
		return res.send(error(500, e.message));
	}
};

const likeAndUnlikePost = async (req, res) => {
	try {
		const { postId } = req.body;
		const curUserId = req._id;

		const post = await Post?.findById(postId).populate('owner');
		if (!post) {
			return res.send(error(404, "Post not found"));
		}

		if (post.likes.includes(curUserId)) {
			const index = post?.likes.indexOf(curUserId);
			post?.likes.splice(index, 1);
		} else {
			post?.likes.push(curUserId);
		}
		await post.save()
		return res.send(success(200,{post:mapPostOutput(post,req._id)}))
	} catch (e) {
		return res.send(error(500, e.message));
	}
};

const updatePostController = async (req, res) => {
	try {
		const { postId, caption } = req.body;
		const curUserId = req._id;

		const post = await Post.findById(postId);
		if (!post) {
			return res.send(error(404, "Post not found"));
		}

		if (post.owner.toString() !== curUserId) {
			return res.send(error(403, "Only owners can update their posts"));
		}

		if (caption) {
			post.caption = caption;
		}

		await post.save();
		return res.send(success(200, { post }));
	} catch (e) {
		return res.send(error(500, e.message));
	}
};

const deletePost = async (req, res) => {
	try {
		const {postId}  = req.params;
		const curUserId = req._id;

		const post = await Post?.findById(postId);
		console.log(post.owner)
		const curUser = await User?.findById(curUserId);
		if (!post) {
			return res.send(error(404, "Post not found"));
		}
        if (post.owner.toString() !== curUserId) {
			return res.send(error(403, "Only owners can delete their posts"));
		}
	
		const index = curUser.posts.indexOf(postId);
		curUser.posts.splice(index, 1);
		await curUser.save();
		await post.remove(); 

		return res.send(success(200, "post deleted successfully"));
	} catch (e) {
		return res.send(error(500, e.message));
	}
};

module.exports = {
	getallpostController,
	createPostController,
	likeAndUnlikePost,
	updatePostController,
	deletePost,
};
