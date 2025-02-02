import express, { Router } from "express";
import serverless from "serverless-http";
const app = express();
const router = Router();

router.get("/", (req, res) => {
    res.send("App is running..");
});

app.use("/.netlify/functions/app", router);
export const handler = serverless(app);