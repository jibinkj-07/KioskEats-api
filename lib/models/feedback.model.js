const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const feedbackSchema = new mongoose.Schema(
  {
    storeId: {
      type: ObjectId,
      ref: "Store",
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: false, // Optional if feedback is anonymous
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
