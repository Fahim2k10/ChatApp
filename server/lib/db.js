import mongoose from "mongoose";

//connect to database
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (error) {
    console.log(error);
  }
};
