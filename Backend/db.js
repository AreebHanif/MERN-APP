const dotenv = require("dotenv")
dotenv.config({path:"./config.env"})
const mongoose = require("mongoose");
const mongoURI = process.env.DATABASE; 

let connectToMongo = () => {
  mongoose.connect(mongoURI)
    .then(() => {
      console.log("MongoDB is connected successfully");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};

module.exports = connectToMongo;
