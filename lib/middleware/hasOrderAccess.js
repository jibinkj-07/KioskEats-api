const { error } = require("../../core/util/response");
const Order = require("../models/order.model");

const hasOrderAccess = async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  if (!orderId) return error(res, "Order id not found", 404);

  try {
    const order = await Order.findOne({ _id: orderId, userId });

    // Check if order exists
    if (!order) {
      return error(
        res,
        "Order not found or user doesn't have permission to do this operation",
        404
      );
    }
    next();
  } catch (err) {
    console.log(`hasOrderAccess ${err}`);
    return error(res, "Internal server error", 500);
  }
};

module.exports = hasOrderAccess;
