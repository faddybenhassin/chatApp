import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"


export async function signup(req, res) {
    const { email, username, password } = req.body;

    // Basic validation
    if (!email || !username || !password) {
        return res.status(400).json({ message: "Email, username and password are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        // Check for existing user
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // Generate auth token after successful save
        generateToken(savedUser._id, res);

        return res.status(201).json({
            _id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
            profilePic: savedUser.profilePic,
        });
    } catch (err) {
        console.error("error in signup controller", err);

        // Handle duplicate key error from MongoDB
        if (err.code === 11000) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Handle Mongoose validation errors
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

export async function login(req,res){
    res.send("login");
    
};

export async function logout(req,res){
    res.send("logout");
};