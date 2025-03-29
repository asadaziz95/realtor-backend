import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  status: Number, // Status: 0 SuperAdmin || status: 1 admin, || status: 2 observant
  adminId: String,
  age: Number,
  password: String,
  isActive: { type: Boolean, default: true},
  isDeleted: { type: Boolean, default: false}
});

export default mongoose.model("User", UserSchema);