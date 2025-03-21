const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: null,
    },
    storeId: {
      type: ObjectId,
      ref: "Store",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
