import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database connected");
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error.message);
       
    }
}

export default connectDB;