const Price = require("../models/Price");

// Get all pending prices
exports.getPendingPrices = async (req, res) => {
  try {
    const prices = await Price.find({ status: "pending" })
      .populate("product", "name genericName manufacturer")
      .populate("location", "city region state")
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ data: prices, total: prices.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Approve a price
exports.approvePrice = async (req, res) => {
  try {
    const price = await Price.findByIdAndUpdate(
      req.params.id,
      { status: "approved", verifiedAt: new Date(), verifiedBy: req.user.id },
      { new: true },
    );
    if (!price) return res.status(404).json({ message: "Price not found" });
    res.json({ message: "Price approved successfully", data: price });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reject a price
exports.rejectPrice = async (req, res) => {
  try {
    const price = await Price.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", verifiedAt: new Date(), verifiedBy: req.user.id },
      { new: true },
    );
    if (!price) return res.status(404).json({ message: "Price not found" });
    res.json({ message: "Price rejected successfully", data: price });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
