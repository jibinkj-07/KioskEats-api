const mongoose = require("mongoose");
const Category = require("./category.model");
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
      validate: {
        validator: async function (value) {
          const categoryExists = await Category.findById(value);
          return !!categoryExists;
        },
        message: "Invalid category ID. No matching category found.",
      },
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
    variants: [
      {
        type: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
