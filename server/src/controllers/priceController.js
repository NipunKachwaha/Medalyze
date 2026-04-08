const Price = require("../models/Price");
const mongoose = require("mongoose");

// Submit a price
exports.submitPrice = async (req, res) => {
  try {
    const { product, location, price, pharmacyName } = req.body;
    const newPrice = await Price.create({
      product,
      location,
      price,
      pharmacyName,
      submittedBy: req.user.id,
    });
    res
      .status(201)
      .json({ message: "Price submitted successfully", data: newPrice });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get prices with filters
exports.getPrices = async (req, res) => {
  try {
    const {
      drug,
      city,
      manufacturer,
      from,
      to,
      page = 1,
      limit = 20,
    } = req.query;

    const match = { status: "approved" };
    if (from || to) {
      match.recordedAt = {
        ...(from && { $gte: new Date(from) }),
        ...(to && { $lte: new Date(to) }),
      };
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "products",
          let: { productId: "$product" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
          as: "product",
        },
      },
      {
        $lookup: {
          from: "locations",
          let: { locationId: "$location" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$locationId"] } } }],
          as: "location",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$submittedBy" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }],
          as: "submittedBy",
        },
      },
      {
        $addFields: {
          product: { $arrayElemAt: ["$product", 0] },
          location: { $arrayElemAt: ["$location", 0] },
          submittedBy: { $arrayElemAt: ["$submittedBy", 0] },
        },
      },
      ...(drug
        ? [
            {
              $match: {
                $or: [
                  { "product.name": { $regex: drug, $options: "i" } },
                  { "product.genericName": { $regex: drug, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      ...(manufacturer
        ? [
            {
              $match: {
                "product.manufacturer": { $regex: manufacturer, $options: "i" },
              },
            },
          ]
        : []),
      ...(city
        ? [
            {
              $match: {
                "location.city": { $regex: city, $options: "i" },
              },
            },
          ]
        : []),
      { $sort: { recordedAt: -1 } },
      {
        $facet: {
          data: [{ $skip: (+page - 1) * +limit }, { $limit: +limit }],
          total: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await Price.aggregate(pipeline);
    res.json({
      data: result.data,
      total: result.total[0]?.count ?? 0,
      page: +page,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get price history for a product
exports.getPriceHistory = async (req, res) => {
  try {
    const { locationId } = req.query;
    const filter = { product: req.params.productId, status: "approved" };
    if (locationId) filter.location = locationId;
    const history = await Price.find(filter)
      .populate("location", "city region")
      .sort({ recordedAt: -1 });
    res.json({ data: history, total: history.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
