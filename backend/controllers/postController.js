import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler"
 
// Creat Post
export const createPost = asyncHandler(async(req, res) => {
    const {userId, description, picturePath} = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        picturePath,
        description,
        userPicturePath: user.picturePath.at,
        likes: {},
        comments: []
    })
await newPost.save();

const post = await Post.find();

if(post) {
    res.status(201).json(post);
} else {
    res.status(400);
    throw new Error("Invalid Data")
};
});

// get all users posts
export const getFeedPost = asyncHandler(async(req, res) => {
    const post = await Post.find();
    if (post) {
        res.status(200).json(post);
    } else {
        res.status(400);
        throw new Error("Invalid Data");
    }
});

// get user post only
export const getUserPost = asyncHandler(async(req, res) => {
    const {userId} = req.params;
    const post = await Post.find({userId});
    if (post) {
        res.status(200).json(post);
    } else {
        res.status(400);
        throw new Error("Invalid Data");
    }
});

// update posts
export const likePost = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const {userId} = req.body;
    const post = await Post.findById(id)
    const isLiked = post.likes.get(userId);

    if(isLiked) {
        post.likes.delete(userId);
    } else {
        post.likes.set(userId, true)
    }

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        {likes: post.likes},
        {new: true},

    );
    res.status(200).json(updatedPost)
    if(err) {
        res.status(400);
        throw new Error("Invalid Data")
    };
});

