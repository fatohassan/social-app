import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Register User
export const register = asyncHandler(async(req, res) => {
    const {firstName, lastName, email, password, friends, picturePath, location, occupation} = req.body;
    // if user not complete
    if(!firstName || !lastName || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandotary!");
    }
    // if user already registered
    const userAvailable = await User.findOne({email});
    if(userAvailable) {
        res.status(400);
        throw new Error("User already exist!");
    }
    // password encryption
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
        firstName, lastName, email, password: passwordHash, friends, picturePath, location, occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    if(savedUser) {
        res.status(201).json(savedUser);
    } else {
        res.status(400);
        throw new Error("User data not valid");
    }

});

// Login User
export const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandotary");
    }
    const user = await User.findOne({email});
    if(!user) {
        res.status(400);
        throw new Error("User does not exist");
    }
    // compare between passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        res.status(400);
        throw new Error("Invalid Credentials");
    }
    if(user && isMatch) {
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});
        res.status(200).json({token, user});
    } else {
        res.status(400);
        throw new Error("Invalid Data");
    }

});

// get usser
export const getUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    res.status(200).json({user});
    if (err) {
        res.status(400);
        throw new Error("Data Invalid");
    }
});

// get user friends
export const getUsetFriends = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
        ({_id, firstName, lastName, occupation, location, picturePath}) => {
            return {_id, firstName, lastName, occupation, location, picturePath};
        }
    );
    res.status(200).json({formattedFriends});
});

// update user
export const addRemoveFriend = asyncHandler(async(req, res) => {
    const {id, friendId} = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if(user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id);
    } else {
        user.friends.push(friendId);
        friend.friends.push(id);
    }
    
    await user.save();
    await friend.save();

    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
        ({_id, firstName, lastName, occupation, location, picturePath}) => {
        return {_id, firstName, lastName, occupation, location, picturePath}
        }
    )

    res.status(200).json(formattedFriends);
    if (err) {
        res.status(400);
        throw new Error("Invalid Data");
    }
});

