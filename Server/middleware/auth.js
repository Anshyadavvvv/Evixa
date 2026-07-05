import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized , token failed" });
    }
  }else {
    res.status(401).json({ message: "Not authorized , no token" });
  }
};

export const admin = async (req, res, next) => {
    if( req.user && req.user == "admin"){
        next();
    }else {
        res.status(401).json({ message: "Not authorized , admin only" });
    }
};

