const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  products: Array,
  totalAmount: Number,
  paymentId: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);