const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        index: true,
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Must a from account"],
        ref: "account"
    },
    toAccount: {
        index: true,
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Must a To account"],
        ref: "account"
    },
    status:{
        type: String,
        enum: ["pending", "success", "failed", "reversed"],
        default: "pending"
    },
    amount:{
        type: Number,
        required: [true, "Must a amount"]   
    },
    idempotencyKey:{
        type: String,
        required: [true, "Must a idempotency key"],
        index: true,
        unique: true
    },
    
}, { timestamps: true});

const transactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = transactionModel;