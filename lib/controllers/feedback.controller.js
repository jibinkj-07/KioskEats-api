const { success, error } = require("../../core/util/response");
const Store = require("../models/store.model");
const Feedback = require("../models/feedback.model");
const validator = require("../validators/store.validator");

const SERVER_ERROR = "Internal server error";
const STORE_NOT_FOUND = "Store not found";
const FEEDBACK_NOT_FOUND = "Feedback not found";

const getFeedbacks = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id feedbacks");
    if (store) return success(res, store);
    return error(res, STORE_NOT_FOUND, 404);
  } catch (err) {
    console.log(`getFeedbacks ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const addFeedback = async (req, res) => {
  const { storeId } = req.params;
  // Validating request
  const error = validator.addFeedbackReq(req);
  if (error) return error(res, error);

  const { rating, comment } = req.body;

  const userId = req.userId;
  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    // Create feedback
    const feedback = await Feedback.create({
      storeId,
      userId,
      rating,
      comment,
    });

    // Add feedback Id into Store feedbacks array
    store.feedbacks.push(feedback._id);
    await store.save();

    return success(res, feedback, 201);
  } catch (err) {
    console.log(`addFeedback ${err} `);
    if (err.name === "ValidationError") {
      return error(
        res,
        Object.values(err.errors)
          .map((e) => e.message)
          .join(", "),
        400
      );
    }
    return error(res, SERVER_ERROR, 500);
  }
};

const updateFeedback = async (req, res) => {
  const { storeId, feedbackId } = req.params;
  // Validating request
  if (!req.body || Object.keys(req.body).length === 0) {
    return error(res, "No changes provided", 400);
  }

  const { rating, comment } = req.body;
  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return error(res, FEEDBACK_NOT_FOUND, 404);

    // Update only provided fields
    if (rating) feedback.rating = rating;
    if (comment) feedback.comment = comment;

    await feedback.save();

    return success(res, offer);
  } catch (err) {
    console.log(`updateFeedback ${err} `);
    if (err.name === "ValidationError") {
      return error(
        res,
        Object.values(err.errors)
          .map((e) => e.message)
          .join(", "),
        400
      );
    }
    return error(res, SERVER_ERROR, 500);
  }
};

const deleteFeedback = async (req, res) => {
  const { storeId, feedbackId } = req.params;

  try {
    // Find and delete the offer item
    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!feedback) return error(res, FEEDBACK_NOT_FOUND, 404);

    // Remove the feedback reference from the Store model
    const storeUpdate = await Store.updateOne(
      { _id: storeId }, // Find store by ID
      { $pull: { feedbacks: feedbackId } } // Remove feedback from feedbacks array
    );

    if (storeUpdate.modifiedCount === 0) {
      return error(res, "Store not found or item not linked", 404);
    }

    return success(res, "Feedback deleted successfully");
  } catch (err) {
    console.error(`deleteFeedback Error: ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const deleteAllFeedbacks = async (req, res) => {
  const { storeId } = req.params;
  try {
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    // Remove all feedbacks linked to the store
    const result = await Feedback.deleteMany({ storeId });

    // Clear offers array in Store if it's stored
    await Store.updateOne({ _id: storeId }, { $set: { feedbacks: [] } });
    return success(
      res,
      `Feedbacks cleared; ${result.deletedCount} items deleted`
    );
  } catch (err) {
    console.log(`deleteAllFeedbacks ${err} `);
    return error(res, SERVER_ERROR, 500);
  }
};

const controllers = {
  getFeedbacks,
  addFeedback,
  updateFeedback,
  deleteFeedback,
  deleteAllFeedbacks,
};
module.exports = controllers;
