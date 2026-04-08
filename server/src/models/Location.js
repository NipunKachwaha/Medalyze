const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    region: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
    coords: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
  },
  { timestamps: true },
);

LocationSchema.index({ coords: "2dsphere" });

module.exports = mongoose.model("Location", LocationSchema);
