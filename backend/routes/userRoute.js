import express from "express";
import { addRemoveFriend, getUser, getUsetFriends, login} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// login route
router.post('/login', login);

// read routes
router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUsetFriends);

// update
router.patch('/:id/friendId', verifyToken, addRemoveFriend);

export default router;