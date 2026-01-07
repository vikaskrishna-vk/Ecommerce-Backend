const Product = require("../models/product");
const emailService = require("../services/emailService");

async function createProduct(req, res) {
  try {
    const { title, price, image } = req.body;
    const product = await Product.create({ title, price, image });
    res.status(201).json({ msg: "Product added successfully", product });
    // notify (best-effort)
    try {
      await emailService.sendProductAdded({
        to: process.env.GMAIL_NOTIFY || "vkvivky2918@gmail.com",
        product,
      });
      console.log("Product notification sent");
    } catch (e) {
      console.log("Failed to send product email:", e.message);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);
    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id, ...updates } = req.body;
    await Product.findByIdAndUpdate(id, updates, { new: true });
    res.json({ msg: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
