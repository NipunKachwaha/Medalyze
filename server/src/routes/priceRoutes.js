const express = require("express");
const router = express.Router();
const {
  submitPrice,
  getPrices,
  getPriceHistory,
} = require("../controllers/priceController");
const { authGuard, requireRole } = require("../middleware/authGuard");

// @route  GET /api/prices
// @desc   Get all approved prices with filters
// @access Private
router.get("/", authGuard, getPrices);

// @route  POST /api/prices
// @desc   Submit a new price record
// @access Private (pharmacist and above)
router.post(
  "/",
  authGuard,
  requireRole("pharmacist", "analyst", "admin"),
  submitPrice,
);

// @route  GET /api/prices/:productId/history
// @desc   Get price history for a product
// @access Private
router.get("/:productId/history", authGuard, getPriceHistory);

module.exports = router;
