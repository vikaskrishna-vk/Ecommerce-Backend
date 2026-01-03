const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const secretkey = process.env.SECRET_KEY;
const mongourl = process.env.MONGO_URI;

const app = express();

const mongoose = require("mongoose");
async function connection() {
  await mongoose.connect(mongourl);
}

//create a schema
let productschema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

//create a model
const productmodel = mongoose.model("product", productschema);

//create a user schema
let userschema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

//create a model for user
const finaluser = mongoose.model("user", userschema);

//middleware
app.use(cors());

app.use((req, res, next) => {
  console.log(`logic verified`);
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "Server is running",
  });
});

//CRUD operations
// app.post("/products", async (req, res) => {
//   try {
//     const { title, price, image } = req.body;
//     await productmodel.create({ title, price, image });
//     res.status(201).json({ msg: "Product added successfully" });
//   } catch (err) {
//     res.json({
//       msg: err.message,
//     });
//   }
// });

// app.get("/products", async (req, res) => {
//   try {
//     let products = await productmodel.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.json({
//       msg: error.message,
//     });
//   }
// });

// app.delete("/products", async (req, res) => {
//   try {
//     let products = await productmodel.findByIdAndDelete(req.body.id);
//     res.status(200).json({ msg: "Product deleted successfully" });
//   } catch (error) {
//     res.json({
//       msg: error.message,
//     });
//   }
// });

// app.put("/products", async (req, res) => {
//   try {
//     let products = await productmodel.findByIdAndUpdate(req.body.id, req.body);
//     res.status(200).json({ msg: "Product updated successfully" });
//   } catch (error) {
//     res.json({
//       msg: error.message,
//     });
//   }
// });

//register
app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let users = await finaluser.findOne({ email });
    if (users) return res.status(400).json({ msg: "User already exists" });
    //hash password
    let hashedpassword = await bcrypt.hash(password, 10);
    finaluser.create({ email, username, password: hashedpassword });
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.json({
      msg: err.message,
    });
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let users = await finaluser.findOne({ email });
    if (!users) return res.json({ msg: "Invallid Credentials" });
    let checkpassword = await bcrypt.compare(password, users.password);
    if (!checkpassword) return res.json({ msg: "Incorrect email or password" });
    //create a token
    let payload = { email: email };
    let token = await jwt.sign(payload, secretkey, { expiresIn: "1h" });
    res.json({ msg: "Login Successful", token });
  } catch (err) {
    res.json({
      msg: err.message,
    });
  }
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  connection();
  console.log("Database connected");
});
