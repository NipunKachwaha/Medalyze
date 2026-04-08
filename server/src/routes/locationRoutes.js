const express = require("express");
const router = express.Router();
const {
  getLocations,
  createLocation,
} = require("../controllers/locationController");
const { authGuard, requireRole } = require("../middleware/authGuard");

// @route  GET /api/locations
// @desc   Get all locations
// @access Private
router.get("/", authGuard, getLocations);

// @route  POST /api/locations
// @desc   Create a new location
// @access Private (admin only)
router.post(
  "/",
  authGuard,
  requireRole("admin", "pharmacist", "analyst"),
  createLocation,
);

module.exports = router;
