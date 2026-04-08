const express = require("express");
const router = express.Router();
const {
  getPendingPrices,
  approvePrice,
  rejectPrice,
} = require("../controllers/adminController");
const { authGuard, requireRole } = require("../middleware/authGuard");

// @route  GET /api/admin/prices/pending
// @desc   Get all pending prices
// @access Private (admin only)
router.get(
  "/prices/pending",
  authGuard,
  requireRole("admin"),
  getPendingPrices,
);

// @route  PATCH /api/admin/prices/:id/approve
// @desc   Approve a price record
// @access Private (admin only)
router.patch(
  "/prices/:id/approve",
  authGuard,
  requireRole("admin"),
  approvePrice,
);

// @route  PATCH /api/admin/prices/:id/reject
// @desc   Reject a price record
// @access Private (admin only)
router.patch(
  "/prices/:id/reject",
  authGuard,
  requireRole("admin"),
  rejectPrice,
);

// @route  DELETE /api/admin/prices/:id
// @desc   Delete a price record
// @access Private (admin only)
router.delete('/prices/:id', authGuard, requireRole('admin'), async (req, res) => {
  try {
    const Price = require('../models/Price');
    await Price.findByIdAndDelete(req.params.id);
    res.json({ message: 'Price deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
