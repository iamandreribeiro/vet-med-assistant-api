import dotenv from "dotenv";
import mongoose, { connect } from "mongoose";

dotenv.config();

async function connectDB(params) {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DBNAME
    });
    console.log("Database connected.");
  } catch (error) {
    console.log("Database unconnected.", error);
  }
}

connectDB();