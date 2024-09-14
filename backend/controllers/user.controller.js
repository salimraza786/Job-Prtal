import {User} from "../models/user.model.js"
import bcryt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// register
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    // console.log(fullname, email, phoneNumber, password, role)
    //  validation

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file)
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist this email",
        success: false,
      });
    }
    const hashPassword = await bcryt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashPassword,
      role,
      profile:{
        profilePhoto:cloudResponse.secure_url,
      }
    });
    res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// login

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // console.log(email , password , role)
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcryt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorect email or password",
        success: false,
      });
    }
    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }

    // generate token
    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (err) {
    console.log(err);
  }
};

// logout

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "User Logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// update profile
export const updateProfile = async(req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    // cloudinary section
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    
   
    let skillsArray;
    if(skills){
       skillsArray = skills.split(",")
    }
  
    const userId = req.id // middlwere authentication
    let user = await User.findById(userId);

    if(!user){
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
// updating data
    if(fullname) user.fullname = fullname
    if(email) user.email = email
    if(phoneNumber) user.phoneNumber = phoneNumber
    if(bio) user.profile.bio = bio 
    if(skills) user.profile.skills = skillsArray
    

    //  resume comes later here
    if(cloudResponse){
      user.profile.resume = cloudResponse.secure_url // save the cloudinary url
      user.profile.resumeOriginalName = file.originalname // save the original file name
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      success: true ,
      message : "Profile updated successfully",
      user
    })

  } catch (error) {
    console.log(error)
  }
};
