const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { sendWelcomeEmail } = require('../services/email.service');



/**
 *  - register controller
 *  - POST /api/auth/register
 */ 
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password) return res.status(400).json({ message: "All fields are required" });
        
        const exist = await userModel.findOne({ email });
        if(exist)  return res.status(400).json({ message: "User already exists" });
        
        // const hashPW = bcrypt.hash(password, 10);
        const user = await userModel.create({ username, email, password });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token);

        res.status(201).json({ 
            message: "User registered successfully", 
            // user
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });

        // send welcome email
        await sendWelcomeEmail(user);   

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



/**
 *  - login controller
 *  - POST /api/auth/login
 */
const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        //  default password won't come for security, access it explicitly 
        const user = await userModel.findOne({ email }).select("+password");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token);

        res.status(200).json({ message: "User logged in successfully", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { registerUser, loginUser };  