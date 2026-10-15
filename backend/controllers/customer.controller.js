import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory to fill",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existCustomer = await Customer.findOne({ email });

    if (existCustomer) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    const customerResponse = {
      _id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
    };

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      customer: customerResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const loginCustomer = async (req, res) => {
  try{

    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid  email or password",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, customer.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      message: "Login successfull ",
      token,
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
        console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const logoutCustomer =  (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logout successfull",
  });
};
export const getMe = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Profile error", error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
export const changePassword = async(req,res)=>{
  try{
    const {oldPassword,newPassword} =req.body;
    
    if(!oldPassword||!newPassword){
      return res.status(400).json({
        success:false,
        message:"Old password and new password are required",
      });
    }
    const customer = await Customer.findById(req.user.id);
    if(!customer){
      return res.status(404).json({
        success:false,
        message:"Customer not found",
      });
    }
    const isOldPasscheck = await bcrypt.compare(
      oldPassword,
      customer.password
    );
    if(!isOldPasscheck){
      return res.status(401).json({
        success:false,
        message:"Old password is incorrect",
      });
    }
    const hashpass = await bcrypt.hash(newPassword,10);
    customer.password =hashpass;
    await customer.save();
    return res.status(200).json({
      success:true,
      message:"Password changed successfully"
    })
  }catch (error){
   return res.status(500).json({
    success:false,
    message:"Internal server error",
   });
  }
};