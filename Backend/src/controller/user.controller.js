import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cloudinaryUpdateProfile, cloudinaryUploader } from "../utils/cloudinary.js";

const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JSON_SECRET, { expiresIn: "7d" })
}

export const signUp = async (req, res) => {
  const { fullName, userName, email, password } = req.body;

  if ([fullName, userName, email, password].some(field => field?.trim === "")) {
    return res.status(400).json("All fields Required");
  }

  if (await User.findOne({ email })) {
    return res.status(409).json("User already Exist");
  }

  const cryptPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName,
    userName,
    email,
    password: cryptPassword
  });

  const data = await User.findById(newUser._id).select("-password");

  const token = generateToken(newUser._id);

  res
    .cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .status(200)
    .json(data);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some(field => field?.trim === "")) {
    return res.status(400).json("All fields Required");
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json("Invalid Credentials");
  }

  const match = await bcrypt.compare(password, existingUser.password);

  if (!match) {
    return res.status(400).json("Incorrect Password");
  }

  const data = await User.findById(existingUser._id).select("-password");
  const token = generateToken(existingUser._id);

  res
    .cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .status(200)
    .json(data);
};


export const logout = async (req, res) => {
  res
    .x("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production"
    })
    .status(200)
    .json("Logout Successfully");
};

export const updateProfile = async (req, res) => {
  try {
    const { file } = req.body;
    const userId = req.user._id
    const profilePic = req.user.profilePic

    const newProfile = (!profilePic || profilePic == "") ? await cloudinaryUploader(file) : await cloudinaryUpdateProfile(profilePic, file)

    const response = await User.findOneAndUpdate(userId, { profilePic: newProfile }, { new: true })

    return res.status(200).json({
      message: "Profile updated successfully",
      profilePic: updatedUser.profilePic
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
}

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};  