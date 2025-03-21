const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const offerSchema = new mongoose.Schema(
  {
    storeId: {
      type: ObjectId,
      ref: "Store",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // % discount or fixed amount
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    applicableItems: [
      {
        type: ObjectId,
        ref: "MenuItem",
      },
    ],
    status: {
      type: String,
      enum: ["active", "expired", "upcoming"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
