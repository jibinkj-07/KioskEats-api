const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const storeSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    contact: {
      location: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    ownerId: { type: ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    workingTime: [
      {
        day: { type: String, trim: true },
        time: { type: Date },
      },
    ],
    menuItems: [{ type: ObjectId, ref: "MenuItem" }],
    categories: [{ type: ObjectId, ref: "Category" }],
    orders: [{ type: ObjectId, ref: "Order" }],
    offer: [{ type: ObjectId, ref: "Offer" }],
    feedback: [{ type: ObjectId, ref: "Feedback" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Store", storeSchema);
