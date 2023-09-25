import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const verifyToken = asyncHandler(async(req, res, next) => {
    let token = req.header("Authorization");
    if(!token) {
        res.status(403);
        throw new Error("Access Denied");
    }
    if(token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
    if(err) {
        res.status(500);
        throw new Error("User not Authorized");
    }
});