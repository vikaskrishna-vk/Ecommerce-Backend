const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const emailService = require("../services/emailService");

async function register(req, res) {
  try {
    const { email, username, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashed });
    res
      .status(201)
      .json({
        msg: "User registered successfully",
        user: { id: user._id, email: user.email, username: user.username },
      });
    try {
      await emailService.sendRegistration({ to: email, username });
    } catch (e) {
      console.log("Failed to send registration email:", e.message);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ msg: "Incorrect email or password" });
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ msg: "Login Successful", token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

module.exports = { register, login };
