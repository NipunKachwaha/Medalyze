const Location = require("../models/Location");

// Get all locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ city: 1 });
    res.json({ data: locations, total: locations.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create location
exports.createLocation = async (req, res) => {
  try {
    const { city, region, state, country, lat, lng } = req.body;
    const location = await Location.create({
      city,
      region,
      state,
      country,
      coords: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });
    res
      .status(201)
      .json({ message: "Location created successfully", data: location });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
