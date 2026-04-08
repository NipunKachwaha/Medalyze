const Product = require("../models/Product");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { name, category, manufacturer } = req.query;
    const filter = { isActive: true };
    if (name) filter.name = { $regex: name, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };
    if (manufacturer)
      filter.manufacturer = { $regex: manufacturer, $options: "i" };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ data: products, total: products.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully", data: product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
