import mongoose from "mongoose";
const connectDB = async () =>{

    const mongoURI = process.env.MONGO_URI;

    if(!mongoURI){
        throw new Error("MONGO_URI is not defined in the environment variables");
    }
 
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected....")
    } catch (error) {
        console.error(error);
        process.exit(1)       
    }
}
export default connectDB;