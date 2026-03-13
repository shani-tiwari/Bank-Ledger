const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account: {
        index: true,
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Must a account"],
        ref: "account"
    },
    transaction: {
        index: true,
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Must a transaction"],
        ref: "transaction"
    },
    amount: {
        type: Number,
        required: [true, "Must a amount"],
        immutable: true 
    },
    balance: {
        type: Number,
        required: [true, "Must a balance"]
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: [true, "Must a type"]
    },

}); 

function preventLedgerModification(){
    throw new Error("entries are immutable");
}

ledgerSchema.pre("save", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);

ledgerSchema.index({account: 1, transaction: 1}, {unique: true});   
ledgerSchema.index({account: 1, balance: 1});

const ledgerModel = mongoose.model('Ledger', ledgerSchema);
module.exports = ledgerModel;