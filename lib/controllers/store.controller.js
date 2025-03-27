const storeValidator = require("../validators/store.validator");
const { success, error } = require("../../core/util/response");
const Store = require("../models/store.model");
const Admin = require("../models/admin.model");

const serverError = "Internal server error";

const createStore = async (req, res) => {
  const validationError = storeValidator.createStoreReq(req);
  if (validationError) return error(res, validationError);
  const { name, address, city, state, country, postalCode, email, phone } =
    req.body;
  const adminId = req.userId;

  try {
    const locData = {
      address,
      city,
      stateProvince: state,
      country,
      postalCode,
    };
    // Create and store Store Details
    const store = await Store.create({
      name,
      contact: { location: locData, email, phone },
      ownerId: adminId,
    });

    // Update admin store list
    await Admin.findByIdAndUpdate(
      adminId,
      {
        $addToSet: { storeList: store._id }, // Adds only if not already in the list
      },
      { new: true, runValidators: true }
    );

    return success(res, store, 201);
  } catch (err) {
    console.log(`createStore ${err}`);
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map((e) => e.message);
      return error(res, errorMessages.join(", "), 400);
    }
    return error(res, serverError, 500);
  }
};

const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().select(
      "name contact status ownerId workingTime createdAt"
    );
    return success(res, stores);
  } catch (err) {
    console.log(`getAllStores ${err}`);
    return error(res, serverError, 500);
  }
};

const getStoreByOwner = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const stores = await Store.find({ ownerId }).select(
      "name contact status ownerId workingTime createdAt"
    );
    if (stores.length > 0) return success(res, stores);
    return error(res, "No store found for this owner", 404);
  } catch (err) {
    console.log(`getStoreByOwner ${err}`);
    return error(res, serverError, 500);
  }
};

const getStore = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select(
      "name contact status ownerId workingTime createdAt"
    );
    if (store) return success(res, store);
    return error(res, "No store found", 404);
  } catch (err) {
    console.log(`getStore ${err}`);
    return error(res, serverError, 500);
  }
};

const getStoreStatus = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("status");
    if (store) return success(res, store);
    return error(res, "No store found", 404);
  } catch (err) {
    console.log(`getStoreStatus ${err}`);
    return error(res, serverError, 500);
  }
};

const getStoreMenu = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id menuItems");
    if (store) return success(res, store);
    return error(res, "No store found", 404);
  } catch (err) {
    console.log(`getStoreMenu ${err}`);
    return error(res, serverError, 500);
  }
};

const getStoreCategories = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id categories");
    if (store) return success(res, store);
    return error(res, "No store found", 404);
  } catch (err) {
    console.log(`getStoreCategories ${err}`);
    return error(res, serverError, 500);
  }
};

const getStoreOffers = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id offers");
    if (store) return success(res, store);
    return error(res, "No store found", 404);
  } catch (err) {
    console.log(`getStoreOffers ${err}`);
    return error(res, serverError, 500);
  }
};

const getStoreOrders = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id orders");
    if (store) return success(res, store);
    return error(res, "No store found", 404);
  } catch (err) {
    console.log(`getStoreOrders ${err}`);
    return error(res, serverError, 500);
  }
};

const getStoreFeedback = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id feedback");
    if (store) return success(res, store);
    return error(res, "No store found", 404);
  } catch (err) {
    console.log(`getStoreFeedback ${err}`);
    return error(res, serverError, 500);
  }
};

const storeControllers = {
  createStore,
  getAllStores,
  getStoreByOwner,
  getStore,
  getStoreStatus,
  getStoreMenu,
  getStoreCategories,
  getStoreOffers,
  getStoreOrders,
  getStoreFeedback,
};

module.exports = storeControllers;
