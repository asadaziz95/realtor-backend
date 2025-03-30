import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { adminsToken }  from "../middleware/token.js";

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
router.post("/register", adminsToken, async (req, res) => {

  try{
    const body = ["name", "email", "phone", "age", "password", "status"];
    const bodyErrors = [];

    for(const field of body){
      if(!req.body[field]){
      bodyErrors.push(`${field} is required.`)
    }
  }

    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    let idAdmin = null;
    if(req.body.status == 2){
      idAdmin = req.user.id
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const createUser = User.create({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      password: hashedPassword,
      status: req.body.status,
      phone: req.body.phone,
      adminId: idAdmin
    })

    return res.status(200).json({message: "register successfully"})

  }catch(error){
    console.log(error.message);
    return res.status(500).json({message: "error", status: false, error})
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email or password" });
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
  
  let userRole;
  if(user.status == 0) userRole = "superAdmin";
  if(user.status == 1) userRole = "admin";
  if(user.status == 2) userRole = "observant";

  const token = jwt.sign({
    id: user.id,
    status: user.status,
    role: userRole
  }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1h" }
  );

   return res.json({ token });

  }catch(error){
    console.log(error.message);
    return res.status(500).json({message: "error", error})
  }
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