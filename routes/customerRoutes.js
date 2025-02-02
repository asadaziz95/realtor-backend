import express from "express";
import Customer from "../models/Customer.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all customers
router.get("/", authMiddleware, async (req, res) => {
  const customers = await Customer.find().populate("createdBy", "name email");
  res.json(customers);
});

// Get single customer
router.get("/:customerId", authMiddleware, async (req, res) => {
  const customer = await Customer.findOne({ customerId: req.params.customerId }).populate("createdBy");
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  res.json(customer);
});

// Create customer
router.post("/", authMiddleware, async (req, res) => {
  const { customerName, customerContactNumber, totalDownPayment, totalPayment, commission, dealerName } = req.body;
  const customerId = `CUST${Date.now()}`; // Generate unique customerId

  const customer = new Customer({
    customerId,
    customerName,
    customerContactNumber,
    totalDownPayment,
    totalPayment,
    commission,
    dealerName,
    createdBy: req.user.userId,
  });

  await customer.save();
  res.status(201).json(customer);
});

export default router;