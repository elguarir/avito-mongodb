const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: String,
    publishedAt: Date,
    place: String,
    images: [String],
    attributes: [{ label: String, value: String }],
  },
  {
    versionKey: false,
  }
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
