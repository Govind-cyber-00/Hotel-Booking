import express from "express";
import cors from "cors";
import dotenv from "dotenv/config"
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkwebhooks.js";


 connectDB();

 
const app = express();
app.use(cors()); // Enable cross-origin resource sharing

// middleware
app.use(express.json());
app.use(clerkMiddleware());

// API to Listen to clerk webhooks
app.use("/api/clerk",clerkWebhooks);

app.get('/',(req,res) =>res.send("API is Working ") )


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));


