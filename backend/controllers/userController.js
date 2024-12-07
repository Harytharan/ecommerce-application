const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "7279ff3ce4cbb7c4b3fcf5baccTOKENKEY";

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully!",
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};




exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Find user by email
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            console.error(`Login Error: No user found for email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password." });
        }

        if (!user.password) {
            console.error(`Login Error: Password is missing for user with email: ${email}`);
            return res.status(500).json({ message: "Internal server error." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // code for comparing password
        if (hashedPassword === user.password) {
            console.error("Login Error: Password mismatch");
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful!",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

exports.logoutUser = (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};
