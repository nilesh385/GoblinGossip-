import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import config from "../config/env.js";

const JWT_SECRET = config.jwtSecret;

export const signup = async (req, res) => {
  try {
    const { email, username, fullName, password, bio } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already in use"
            : "Username already taken",
      });
    }

    let profilePicUrl = "";

    // Handle profile picture upload
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "chat-app/profiles",
          transformation: [{ width: 500, height: 500, crop: "fill" }],
        });
        profilePicUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res
          .status(500)
          .json({ message: "Failed to upload profile picture" });
      }
    }

    const newUser = new User({
      email,
      username,
      fullName,
      password, // In production, hash the password
      profilePic: profilePicUrl,
      bio,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

    // Exclude password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    console.log("User Signed-up=>>>>>>>>>>>>> ", userResponse);

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // In production, use proper password comparison
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    // Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    console.log("User Logged-in Successfully=>>>>>>>>>>>>> ", userResponse);

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const validateToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
