import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import authroutes from "./routes/auth.js";
import eventroutes from "./routes/events.js";
import bookingroutes from "./routes/bookings.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`connected to mongoDB`);
  })
  .catch((error) => {
    console.log(`error occured`, error);
  });

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authroutes);
app.use("/api/events", eventroutes);
app.use("/api/bookings", bookingroutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
