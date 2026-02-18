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

module.exports = createAccount