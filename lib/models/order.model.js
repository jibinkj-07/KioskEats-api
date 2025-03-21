const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const orderSchema = new mongoose.Schema(
  {
    storeId: {
      type: ObjectId,
      ref: "Store",
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: false, // Optional if feedback is anonymous
    },
    orderNo: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        itemId: {
          type: ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["received", "in progress", "completed"],
      default: "received",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
