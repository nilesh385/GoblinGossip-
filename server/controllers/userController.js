import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $and: [
        {
          $or: [
            { email: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } },
          ],
        },
        { _id: { $ne: req.user._id } },
        { blockedUsers: { $nin: [req.user._id] } },
      ],
    }).select("username fullName profilePic");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio } = req.body;
    const updates = { fullName, bio };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "chat-app/profiles",
        transformation: [{ width: 500, height: 500, crop: "fill" }],
      });
      updates.profilePic = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (user.blockedUsers.includes(userId)) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    user.blockedUsers.push(userId);
    user.friends = user.friends.filter(id => id.toString() !== userId);
    await user.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Failed to block user" });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== req.user._id.toString());

    await Promise.all([user.save(), friend.save()]);

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Remove friend error:", error);
    res.status(500).json({ message: "Failed to remove friend" });
  }
};