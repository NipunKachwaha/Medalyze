const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { authGuard, requireRole } = require("../middleware/authGuard");

// @route  GET /api/products
// @desc   Get all products
// @access Private
router.get("/", authGuard, getProducts);

// @route  POST /api/products
// @desc   Create a new product
// @access Private (pharmacist and above)
router.post(
  "/",
  authGuard,
  requireRole("pharmacist", "analyst", "admin"),
  createProduct,
);

// @route  PUT /api/products/:id
// @desc   Update a product
// @access Private (pharmacist and above)
router.put(
  "/:id",
  authGuard,
  requireRole("pharmacist", "analyst", "admin"),
  updateProduct,
);

// @route  DELETE /api/products/:id
// @desc   Soft delete a product
// @access Private (admin only)
router.delete("/:id", authGuard, requireRole("admin"), deleteProduct);

module.exports = router;
