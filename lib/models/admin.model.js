const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const adminSchema = new Schema(
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
    role: {
      type: String,
      enum: ["admin", "staff", "cashier", "other"],
      default: "admin",
    },
    password: {
      type: String,
      required: true,
    },
    storeList: [{ type: ObjectId, ref: "Store" }],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresIn: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
