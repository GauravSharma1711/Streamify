import mongoose from 'mongoose'

import "dotenv/config"

const connectDB = async(req,res)=>{
    try {
        const res = await mongoose.connect(process.env.MONGO_URI);
console.log(`MongoDB Connected:${res.connection.host}`);

    } catch (error) {
        console.log("Error while connecting to mongoDB",error);
        process.exit(1)
    }
}
export default connectDB