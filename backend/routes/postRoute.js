import { getFeedPost, getUserPost, likePost } from "../controllers/postController.js";
import {verifyToken} from "../middleware/auth.js";
import express from "express";

const router = express.Router();

// create post
router.get('/', verifyToken, getFeedPost);
router.get('/:userId/post', verifyToken, getUserPost);

//update post router
router.patch('/:id/like', verifyToken, likePost);
export default router;