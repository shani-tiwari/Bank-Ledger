const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        // make the search very faster - B+ tree
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive', 'frozen'],
            message: 'status can be either active, frozen or closed'
        },
        default: 'active'
    },
    currency: {
        type: String,
        enum: {
            values: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
            message: 'currency can be either USD, EUR, GBP, JPY, INR'
        },
        default: 'INR',
        // required: true
    },
    accountNumber: {
        type: String,
        // required: true,
        unique: true
    },
    accountType: {
        type: String,
        enum: ['savings', 'current'],
        // required: true
    },
    // calculated managed through ledger
    // balance: {
    //     type: Number,
    //     required: true,
    //     default: 0
    // },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }   
}, {timestamps: true});

// can be find with status also - compound index 
accountSchema.index({user: 1, status: 1});

accountSchema.methods.getBalance = async function(){
    const balance = await ledgerModel.aggregate([
        {
            $match: {
                account: this._id
            }
        },
        {
            $group: {
                _id: null,

                totalDebit: { $sum: {
                    $cond: [
                        { $eq: ["$type", "debit"] },
                        "$amount",
                        0
                    ]
                } },

                totalCredit: { $sum: {
                    $cond: [
                        { $eq: ["$type", "credit"] },
                        "$amount",
                        0
                    ]   
                } }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredit", "$totalDebit"] } 
            }
        }   
    ]) ;
    if(balance.length === 0){
        return 0;
    }
    return balance[0].balance;  
}

const accountModel = mongoose.model('Account', accountSchema);  
module.exports = accountModel;