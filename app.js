const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { connectDB } = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const logger = require("./middlewares/logger");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => res.json({ msg: "Server is running" }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await connectDB();
});
