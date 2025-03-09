import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true },
  customerName: String,
  customerContactNumber: String,
  dateOfSale: { type: Date, default: Date.now },
  totalDownPayment: Number,
  totalPayment: Number,
  commission: Number,
  dealerName: String,
  plotNumber: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Customer", CustomerSchema);