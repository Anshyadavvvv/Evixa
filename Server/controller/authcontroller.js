import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import OTP from "../models/OTP.js";
import { sendotpemail, sendbookingconfirmationemail } from "../utils/email.js";

export const registeruser = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedpassword,
      role: "user",
      isVerified: false,
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Here you would typically send the OTP via email or SMS
    console.log(`OTP for ${email}: ${otp}`);
    await OTP.create({
      email,
      otp,
      action: "account_verification",
    });
    await sendotpemail(email, otp, "account_verification");

    res
      .status(201)
      .json({
        message: "User registered successfully.Please verify your email.",
      });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" , error: error.message });
  }
};

// Login user

export const loginuser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified && user.role === "user") {
    await OTP.deleteMany({ email: user.email, action: "account_verification" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({
      email: user.email,
      otp: otp,
      action: "account_verification",
    });

    await sendotpemail(user.email, otp, "account_verification");
    return res
      .status(400)
      .json({
        message:
          "Please verify your email before logging in. OTP sent to your email.",
      });
  }

  res.json({
    message: "Login successful",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }),
  });
};



// Verify OTP
export const verifyotp = async (req, res) => {
    const { email , otp } = req.body;
    const otprecord = await OTP.findOne({email , otp , action : 'account_verification'});
    if(!otprecord){
        return res.status(400).json({message : 'Invalid OTP'});
    }

    const user = await User.findOneAndUpdate({ email }, { isVerified: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await OTP.deleteMany({ email, otp, action: 'account_verification' });
    res.json({
        message: 'Email verified successfully , now you can login and access all features hehe',
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }),
    });
   
}
