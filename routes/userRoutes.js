import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get single user
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Register user
router.post("/register", async (req, res) => {
  const { name, email, age, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, age, password: hashedPassword });

  await user.save();
  res.status(201).json(user);
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Update user
router.put("/:id", async (req, res) => {
  let updateData = req.body;
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.json(updatedUser);
});

export default router;