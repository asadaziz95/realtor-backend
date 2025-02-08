import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
console.log('process.env.MONGO_URI',process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://asadazizjs:ZEZjz8EhJVMsbSv@cluster0.9fkd1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

export default connectDB;