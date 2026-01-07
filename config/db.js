const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not defined in environment");
  try {
    await mongoose.connect(uri);
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err.message || err);
    throw err;
  }
}

module.exports = { connectDB };
