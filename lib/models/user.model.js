const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => /.+@.+\..+/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    profileURL: {
      type: String,
      trim: true,
    },
    contact: {
      location: {
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        stateProvince: { type: String, trim: true },
        country: { type: String, trim: true },
        postalCode: { type: String, trim: true },
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
    selectedStore: { type: ObjectId, ref: "Store" },
    role: {
      type: String,
      enum: ["admin", "staff", "cashier", "user", "other"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    accessStores: [{ type: ObjectId, ref: "Store" }],
    resetPasswordToken: { type: String },
    resetPasswordExpiresIn: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
