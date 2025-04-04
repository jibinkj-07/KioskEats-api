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
    currency: {
      code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },
      symbol: {
        type: String,
        required: true,
        trim: true,
      },
    },
    contact: {
      location: {
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        stateProvince: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        postalCode: { type: String, trim: true },
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: (v) => /.+@.+\..+/.test(v),
          message: (props) => `${props.value} is not a valid email!`,
        },
      },
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: (v) => /^\+?[1-9]\d{1,14}$/.test(v),
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
    },
    ownerId: { type: ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "closed",
    },
    workingTime: [
      {
        day: {
          type: String,
          trim: true,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        time: { type: String, trim: true },
      },
    ],
    menuItems: [{ type: ObjectId, ref: "MenuItem" }],
    categories: [{ type: ObjectId, ref: "Category" }],
    orders: [{ type: ObjectId, ref: "Order" }],
    offers: [{ type: ObjectId, ref: "Offer" }],
    feedbacks: [{ type: ObjectId, ref: "Feedback" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Store", storeSchema);
