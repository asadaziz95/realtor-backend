import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
});

export default mongoose.model("User", UserSchema);