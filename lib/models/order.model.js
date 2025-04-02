const mongoose = require("mongoose");
const MenuItem = require("./menu.items.model");
const Offer = require("./offer.model");
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
          required: true,
          validate: {
            validator: async function (value) {
              const itemExists = await MenuItem.findById(value);
              return !!itemExists;
            },
            message: "Invalid Item ID. No matching item found.",
          },
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
          required: true,
          validate: {
            validator: async function (value) {
              const offerExists = await Offer.findById(value);
              return !!offerExists;
            },
            message: "Invalid offer ID. No matching offer found.",
          },
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
