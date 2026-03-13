// const accountModel = require('../models/account.model');
const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next){

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token) return res.status(401).json({ msg: "Unauthorize access "});

    // verify token
    // const user = await userModel.findOne({token});
    try {

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decodedToken.id);

        if(!user) return res.status(401).json({ msg: "Unauthorize access "});

        req.user = user;
        next();

    } catch (error) {

        return res.status(401).json({ msg: "Unauthorize error "});

    }   

};

async function systemUserMW(req, res, next){
    const token = req.cookies.token || req.headers.authorizaiton?.split(" ")[1]

    if(!token){
        return res.status(401).json({ msg: " Unauthorize access, token is Missing"});
    };
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        const user = await userModel.findById(decoded.id).select("+systemUser");
        if(!user.systemUser){
            return res.status(403).json({ msg: " Forbidden access, not authorized"});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ msg: " Unauthorize access, token is invalid"});
    }
}

module.exports = {authMiddleware, systemUserMW}