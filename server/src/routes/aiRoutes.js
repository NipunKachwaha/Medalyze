const express = require("express");
const router = express.Router();
const { authGuard, requireRole } = require("../middleware/authGuard");
const {
  getDrugSummary,
  parseNaturalSearch,
  checkPriceAnomaly,
} = require("../services/aiService");
const Product = require("../models/Product");
const Price = require("../models/Price");

// Feature 1 — Drug Info Summarizer
// @route  GET /api/ai/drug-summary/:productId
// @access Private
router.get("/drug-summary/:productId", authGuard, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const result = await getDrugSummary(
      product.name,
      product.manufacturer || "Unknown",
      product.category || "General",
    );

    if (!result.success)
      return res.status(500).json({ message: "AI service error" });

    res.json({ summary: result.summary, product: product.name });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Feature 2 — Natural Language Price Search
// @route  POST /api/ai/parse-search
// @access Private
router.post("/parse-search", authGuard, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length === 0)
      return res.status(400).json({ message: "Query is required" });

    const result = await parseNaturalSearch(query);

    if (!result.success)
      return res.status(500).json({ message: "AI service error" });

    res.json({ filters: result.filters, query });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Feature 3 — Price Anomaly Detector
// @route  POST /api/ai/check-anomaly
// @access Private (admin and analyst only)
router.post(
  "/check-anomaly",
  authGuard,
  requireRole("admin", "analyst"),
  async (req, res) => {
    try {
      const { productId, submittedPrice, city } = req.body;

      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      // Get average price for this product
      const priceStats = await Price.aggregate([
        { $match: { product: product._id, status: "approved" } },
        { $group: { _id: null, avgPrice: { $avg: "$price" } } },
      ]);

      const avgPrice = priceStats[0]?.avgPrice || submittedPrice;

      const result = await checkPriceAnomaly(
        product.name,
        submittedPrice,
        avgPrice,
        city,
      );

      if (!result.success)
        return res.status(500).json({
          message: "AI service error",
          error: result.error,
        });

      res.json({
        flagged: result.flagged,
        reason: result.reason,
        submittedPrice,
        avgPrice: avgPrice.toFixed(2),
        ratio: result.ratio,
        product: product.name,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
);

module.exports = router;
