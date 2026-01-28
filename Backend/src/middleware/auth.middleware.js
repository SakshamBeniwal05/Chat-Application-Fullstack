import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json("Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JSON_SECRET);

    const currentUser = await User
      .findById(decoded._id)
      .select("-password");

    if (!currentUser) {
      return res.status(401).json("User not found");
    }

    // attach user info to request
    req.userId = currentUser._id;
    req.user = currentUser;

    next();
  }
  catch (err) {
    return res.status(401).json("Invalid or expired token");
  }
};
