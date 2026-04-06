const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  discount: Number,
  category: String,
  colors: [String],
  stock: Number,
  image: String
});

module.exports = mongoose.model("Product", productSchema);