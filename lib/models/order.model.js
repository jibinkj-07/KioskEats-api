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
      required: false, // Optional for guest users
    },
    orderNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    items: [
      {
        itemId: {
          type: ObjectId,
          ref: "MenuItem",
        },
        variant: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    offers: [
      {
        offerId: {
          type: ObjectId,
          ref: "Offer",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["received", "in progress", "completed", "cancelled", "delivered"],
      default: "received",
    },
    payment: {
      status: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
      },
      method: {
        type: String,
        enum: ["cash", "card", "upi", "other"],
        required: true,
      },
      transactionId: {
        type: String, // Required for online payments
        trim: true,
      },
      remark: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
