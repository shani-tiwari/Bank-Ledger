const transactionModel = require('../models/transaction.model');
const accountModel = require('../models/account.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.service');

async function createTransaction(req, res){
    
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;
    
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({ msg: "Missing required fields" });
    }

    // find users of provided account if exists
    const fromuser = await accountModel.findById(fromAccount);
    const touser = await accountModel.findById(toAccount);

    if(!fromuser || !touser){
        return res.status(404).json({ msg: "User not found" });
    }
    if(fromuser.userId === touser.userId){
        return res.status(400).json({ msg: "User cannot transfer to himself" });
    }
    if(fromuser.status !== "active" || touser.status !== "active"){
        return res.status(400).json({ msg: "User is not active" });
    }
    if(fromuser.currency !== touser.currency){
        return res.status(400).json({ msg: "User currency is not same" });
    }

    // check if idempotency key is unique
    const existingTransaction = await transactionModel.findOne({ idempotencyKey });
    if(existingTransaction){
        if(existingTransaction.status === "success"){
            return res.status(200).json({
                msg: "Transaction is processed",
                transaction: existingTransaction
            })
        }
        if(existingTransaction.status === "pending"){
            return res.status(200).json({
                msg: "Transaction is pending",
            })
        }
        if(existingTransaction.status === "failed"){
            return res.status(500).json({
                msg: "Transaction is failed",
                transaction: existingTransaction
            })
        }
        if(existingTransaction.status === "reversed"){
            return res.status(500).json({
                msg: "Transaction is reversed, retry",
                transaction: existingTransaction
            })
        }
    }

    // check if amount is valid
    if(amount <= 0){
        return res.status(400).json({ msg: "Invalid amount" });
    }

    // check if from user has enough balance
    if(fromuser.balance < amount){
        return res.status(400).json({ msg: "Insufficient balance" });
    }

    // update from user balance
    fromuser.balance -= amount;
    await fromuser.save();

    // update to user balance
    touser.balance += amount;
    await touser.save();

    // create
    const transaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey
    });

    transaction.save()
        .then(() => res.status(201).json({ msg: "Transaction created successfully" }))
        .catch((error) => res.status(500).json({ msg: "Failed to create transaction" }));   
}


module.exports = {
    createTransaction
}