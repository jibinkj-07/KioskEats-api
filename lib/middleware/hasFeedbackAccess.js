const { error } = require("../../core/util/response");
const Feedback = require("../models/feedback.model");

const hasFeedbackAccess = async (req, res, next) => {
  const { feedbackId } = req.params;
  const userId = req.userId;

  if (!feedbackId) return error(res, "Feedback id not found", 404);
  try {
    const feedback = await Feedback.findOne({ _id: feedbackId, userId });

    // Check if feedback exists
    if (!feedback) {
      return error(
        res,
        "Feedback not found or user doesn't have permission to do this operation",
        404
      );
    }
    next();
  } catch (err) {
    console.log(`hasFeedbackAccess ${err}`);
  }
};

module.exports = hasFeedbackAccess;
