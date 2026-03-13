const mongoose = require("mongoose");

const tokenBlackList = new mongoose.Schema({
    token:{
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps: true});

tokenBlackList.index({ createdAt: 1}, {expireAfterSeconds: 60 * 60 * 24 * 7});

module.exports = mongoose.model("TokenBlackList", tokenBlackList);  