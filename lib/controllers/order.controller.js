const Store = require("../models/store.model");
const Order = require("../models/order.model");
const MenuItem = require("../models/menu.items.model");
const Offer = require("../models/offer.model");
const validator = require("../validators/store.validator");
const { success, error } = require("../../core/util/response");

const SERVER_ERROR = "Internal server error";
const STORE_NOT_FOUND = "Store not found";
const OFFER_NOT_FOUND = "Offer not found in store";
const ORDER_NOT_FOUND = "Order not found in store";
const ITEM_NOT_FOUND = "Item not found in store menu";

const getOrders = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id orders");
    if (store) return success(res, store);
    return error(res, STORE_NOT_FOUND, 404);
  } catch (err) {
    console.log(`getOrders ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const addOrder = async (req, res) => {
  const { storeId } = req.params;
  // Validating request
  const error = validator.addOrderReq(req);
  if (error) return error(res, error);

  // Getting user id if user is logged while ordering
  const userId = req.userId;
  const {
    offers,
    items,
    paymentStatus,
    paymentMethod,
    transactionId,
    paymentRemark,
    totalAmount,
    discountAmount,
  } = req.body;

  try {
    let offerItemTotalAmountInDB = 0;
    let totalDiscountAmountInDB = 0;
    let regularItemTotalAmountInDB = 0;

    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    // Use Promise.all to fetch offers and items in parallel
    const offerPromises = offers.map(({ offerId }) => Offer.findById(offerId));
    const itemPromises = items.map(({ itemId }) => MenuItem.findById(itemId));

    const [offerDetails, itemDetails] = await Promise.all([
      Promise.all(offerPromises),
      Promise.all(itemPromises),
    ]);

    // Validate offers and items
    offers.forEach((offer, index) => {
      const offerDetail = offerDetails[index];
      if (!offerDetail) return error(res, OFFER_NOT_FOUND, 404);
      if (!offer.offerId || !offer.prize || !offer.quantity) {
        return error(res, "Invalid offer item structure");
      }
      offerItemTotalAmountInDB += offerDetail.discountPrice * offer.quantity;
      totalDiscountAmountInDB += offerDetail.discountPrice * offer.quantity;
    });

    items.forEach((item, index) => {
      const itemDetail = itemDetails[index];
      if (!itemDetail) return error(res, ITEM_NOT_FOUND, 404);
      if (!item.itemId || !item.prize || !item.quantity || !item.variant) {
        return error(res, "Invalid item structure");
      }

      const variant = itemDetail.variants.find((v) => v.type === item.variant);
      if (!variant) return error(res, "No item variant found", 404);
      regularItemTotalAmountInDB += variant.price * item.quantity;
    });

    // Calculate total amount
    const totalFromDB = offerItemTotalAmountInDB + regularItemTotalAmountInDB;

    // Validate passed amount with DB calculated amount
    if (Math.abs(totalFromDB - totalAmount) > 0.01) {
      return error(
        res,
        `Total amount mismatch by ${totalFromDB - totalAmount}`
      );
    }

    if (Math.abs(totalDiscountAmountInDB - discountAmount) > 0.01) {
      return error(
        res,
        `Discount amount mismatch by ${
          totalDiscountAmountInDB - discountAmount
        }`
      );
    }

    // Generate order number
    const orderNo = Math.floor(100000 + Math.random() * 900000);

    // Create order
    const order = new Order({
      userId,
      storeId,
      orderNo,
      offers,
      items,
      payment: {
        status: paymentStatus,
        method: paymentMethod,
        transactionId,
        remark: paymentRemark,
      },
      discountAmount,
      totalAmount,
    });

    // Add order Id into Store orders array
    store.orders.push(order._id);

    await Promise.all([order.save(), store.save()]);

    return success(res, order, 201);
  } catch (err) {
    console.log(`addOrder ${err} `);
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

const updateOrder = async (req, res) => {
  const { storeId, orderId } = req.params;
  // Validating request
  if (!req.body || Object.keys(req.body).length === 0) {
    return error(res, "No changes provided", 400);
  }
  const { status, paymentStatus, paymentMethod, transactionId, paymentRemark } =
    req.body;

  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    const order = await Order.findById(orderId);
    if (!order) return error(res, ORDER_NOT_FOUND, 404);

    // Update only provided fields
    if (status) order.status = status;
    if (paymentStatus) order.payment.status = paymentStatus;
    if (paymentMethod) order.payment.method = paymentMethod;
    if (transactionId) order.payment.transactionId = transactionId;
    if (paymentRemark) order.payment.remark = paymentRemark;

    await order.save();

    return success(res, order);
  } catch (err) {
    console.log(`updateOrder ${err} `);
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

const deleteOrder = async (req, res) => {
  const { storeId, orderId } = req.params;

  try {
    // Find and delete the order
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return error(res, ORDER_NOT_FOUND, 404);

    // Remove the order reference from the Store model
    const storeUpdate = await Store.updateOne(
      { _id: storeId }, // Find store by ID
      { $pull: { orders: orderId } }
    );

    if (storeUpdate.modifiedCount === 0) {
      return error(res, "Store not found or order not linked", 404);
    }

    return success(res, "Order deleted successfully");
  } catch (err) {
    console.error(`deleteOrder Error: ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const deleteAllOrders = async (req, res) => {
  const { storeId } = req.params;
  try {
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    // Remove all orders linked to the store
    const result = await Order.deleteMany({ storeId });

    // Clear orders array in Store if it's stored
    await Store.updateOne({ _id: storeId }, { $set: { orders: [] } });
    return success(res, `Orders cleared; ${result.deletedCount} items deleted`);
  } catch (err) {
    console.log(`deleteAllOrders ${err} `);
    return error(res, SERVER_ERROR, 500);
  }
};

const controllers = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  deleteAllOrders,
};
module.exports = controllers;
