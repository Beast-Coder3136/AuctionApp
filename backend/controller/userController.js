import User from "../models/user.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import getDataUri from "../middlewares/dataUri.js";
import cloudinary from "../middlewares/cloudinary.js";


export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(req.file)
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Required Fields"
      })
    }
    const userExist = await User.findOne({ name: name, email: email })
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Account Exist Already"
      })
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    if (!req.file.mimetype.startsWith('image')) {
      return res.status(400).json({ success: false, message: 'Only images allowed' });
    }
    const file = req.file
    let cloudResponse;
    if (file) {
      const fileUri = getDataUri(file)
      cloudResponse = cloudinary.uploader.upload(fileUri.content, {
        folder: "AuctionApp/avatars"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 13)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    })

    if (cloudResponse) {
      user.avatar = (await cloudResponse).secure_url
    }

    await user.save()
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' });
    return res.status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None"
      })
      .json({
        message: "You are now registered",
        user,
        success: true
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Required Fields"
      })
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400)
        .json({
          message: "Incorrect Email",
          success: false
        })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400)
        .json({
          message: "Password is Incorrect",
          success: false
        })
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' });
    return res.status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None"
      })
      .json({
        message: "You are now logged In",
        user,
        success: true
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "You are Logged Out",
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}