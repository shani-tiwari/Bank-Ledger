const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        lowercase: true,
        minlength: [3, "More than 3 characters required"],
        maxlength: [30, "Less than 30 characters required"]
    },
    email: {
        type: String,
        // required: true,
        required: [true, "Email is required"],
        unique: [true, "Email Already Exists"],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"] // email regex
    },
    password: {
        type: String,
        required:  [true, "Password is required"],
        minlength: [6, "More than 6 characters required"],
        maxlength: [12, "Less than 12 characters required"],
        select: false
    },

},
   { timestamps: true } // create/update time save
);


// whenever u 'save' user data, this function will run first
// as we using async/await - so 'next' can't be used here 
    userSchema.pre("save", async function(){
        if(!this.isModified("password")) return;

        // this.password = await bcrypt.hashSync(this.password, 10);
        this.password = await bcrypt.hash(this.password, 10);
        return;
    });

// compare password - saved/old password and new password
    userSchema.methods.comparePassword = async function(password){
        return await bcrypt.compare(password, this.password);
    };



const userModel = mongoose.model("User", userSchema);

module.exports = userModel;