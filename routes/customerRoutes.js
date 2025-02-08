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

// Update customer
router.put("/:customerId", authMiddleware, async (req, res) => {
  const { customerName, customerContactNumber, totalDownPayment, totalPayment, commission, dealerName } = req.body;

  try {
    const customer = await Customer.findOneAndUpdate(
      { customerId: req.params.customerId },
      {
        customerName,
        customerContactNumber,
        totalDownPayment,
        totalPayment,
        commission,
        dealerName,
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete customer
router.delete("/:customerId", authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ customerId: req.params.customerId });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;