import express, { Router } from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "../config/db.js";
import userRoutes from "../routes/userRoutes.js";
import customerRoutes from "../routes/customerRoutes.js";
const app = express();
const router = Router();
app.use(cors());
app.use(bodyParser.json());

dotenv.config();
connectDB();


app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
router.get("/", (req, res) => {
    res.send("App is running..");
});

app.use("/.netlify/functions/app", router);
export const handler = serverless(app);