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
    actualPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    applicableItems: [
      {
        itemId: { type: ObjectId, ref: "MenuItem", required: true },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
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
