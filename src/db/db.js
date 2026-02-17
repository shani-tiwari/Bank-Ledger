const mongoose = require("mongoose");

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected");
//     } catch (error) {
//         console.log("connection error" + error);
//     }
// }

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("connection error" + error);
        process.exit(1); // close server - if connect fails / without data/db running server is pointless
    })
}

module.exports = connectDB;