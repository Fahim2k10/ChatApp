import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// Signup
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "incomplete details" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "user with ts email alrdy exists gng",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "account created succ",
    });

    //catch
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      res.json({ success: false, message: "incorrect details" });
    }

    const token = generateToken(userData._id);

    res.json({ success: true, userData, token, message: "Login successful" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

//2.55

//controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    res.json({ success: true, message: newMessage }); // ✅ FIXED
  } catch (error) {
    console.log(error.message + " error in user controller");
    res.status(500).json({ success: false, message: error.message }); // ✅ Better error response
  }
};

//3.37
