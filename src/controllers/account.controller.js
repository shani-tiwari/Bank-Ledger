const accountModel = require('../models/account.model');

async function createAccount(req, res){
    const user = req.user;
    if(!user) return res.status(401).json({ msg: "user details not available" });

    try {
        
        const account = await accountModel.create({ userId: user._id });
    
        // const decoded = jwt.verify({ userId: user._id }, process.env.JWT_SECRET);

        // res.cookie('token', token);

        return res.status(201).json({ msg: "Account created successfully", account });

    } catch (error) {
        return res.status(500).json({ msg: "Failed to create account", error });
    }

};

async function getAccount(req, res){
    const user = req.user;
    if(!user) return res.status(401).json({ msg: "user details not available" });

    try {
        
        const account = await accountModel.findOne({ userId: user._id });
    
        // const decoded = jwt.verify({ userId: user._id }, process.env.JWT_SECRET);

        // res.cookie('token', token);

        return res.status(201).json({ msg: "Account created successfully", account });

    } catch (error) {
        return res.status(500).json({ msg: "Failed to create account", error });
    }

};  


async function getBalance(req, res){
    const user = req.user;
    const {accountId} = req.params;
    if(!user) return res.status(401).json({ msg: "user details not available" });

    const account = await accountModel.findOne({_id: accountId, user: user_id})
    if(!account){
        return res.status(404).json({ msg: "Account not found" });
    }

    const balance = await account.getBalance();
    return res.status(200).json({ msg: "Account balance", balance });   

};      




module.exports = {createAccount, getAccount, getBalance}