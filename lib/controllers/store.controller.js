const storeValidator = require("../validators/store.validator");
const { success, error } = require("../../core/util/response");
const Store = require("../models/store.model");
const User = require("../models/user.model");

const SERVER_ERROR = "Internal server error";
const STORE_NOT_FOUND = "Store not found";
const VIEW_QUERY = "name currency contact status ownerId workingTime createdAt";

const createStore = async (req, res) => {
  const validationError = storeValidator.createStoreReq(req);
  if (validationError) return error(res, validationError);
  const {
    name,
    address,
    city,
    state,
    country,
    postalCode,
    email,
    phone,
    currencyCode,
    currencySymbol,
  } = req.body;
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
      currency: { code: currencyCode, symbol: currencySymbol },
      contact: { location: locData, email, phone },
      ownerId: adminId,
    });

    // Update admin store list
    await User.findByIdAndUpdate(
      adminId,
      {
        $addToSet: { accessStores: store._id }, // Adds only if not already in the list
      },
      { new: true, runValidators: true }
    ).select(VIEW_QUERY);

    return success(res, store, 201);
  } catch (err) {
    console.log(`createStore ${err}`);
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map((e) => e.message);
      return error(res, errorMessages.join(", "), 400);
    }
    return error(res, SERVER_ERROR, 500);
  }
};

const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().select(VIEW_QUERY);
    return success(res, stores);
  } catch (err) {
    console.log(`getAllStores ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const getStoreByOwner = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const stores = await Store.find({ ownerId }).select(VIEW_QUERY);
    if (stores.length > 0) return success(res, stores);
    return error(res, "No store found for this owner", 404);
  } catch (err) {
    console.log(`getStoreByOwner ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const getStore = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select(VIEW_QUERY);
    if (store) return success(res, store);
    return error(res, STORE_NOT_FOUND, 404);
  } catch (err) {
    console.log(`getStore ${err}`);
    return error(res, SERVER_ERROR, 500);
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

const getStoreOffers = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id offers");
    if (store) return success(res, store);
    return error(res, STORE_NOT_FOUND, 404);
  } catch (err) {
    console.log(`getStoreOffers ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const getStoreOrders = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id orders");
    if (store) return success(res, store);
    return error(res, STORE_NOT_FOUND, 404);
  } catch (err) {
    console.log(`getStoreOrders ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const getStoreFeedback = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id feedback");
    if (store) return success(res, store);
    return error(res, STORE_NOT_FOUND, 404);
  } catch (err) {
    console.log(`getStoreFeedback ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const updateStore = async (req, res) => {
  const { storeId } = req.params;

  if (!req.body || Object.keys(req.body).length === 0) {
    return error(res, "No changes provided", 400);
  }

  const {
    name,
    address,
    city,
    state,
    country,
    postalCode,
    email,
    phone,
    workingTime,
    currencyCode,
    currencySymbol,
  } = req.body;

  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    // Update only provided fields
    if (name) store.name = name;
    if (currencyCode) store.currency.code = currencyCode;
    if (currencySymbol) store.currency.symbol = currencySymbol;
    if (name) store.name = name;
    if (address) store.contact.location.address = address;
    if (city) store.contact.location.city = city;
    if (state) store.contact.location.stateProvince = state;
    if (country) store.contact.location.country = country;
    if (postalCode) store.contact.location.postalCode = postalCode;
    if (email) store.contact.email = email;
    if (phone) store.contact.phone = phone;
    if (workingTime) store.workingTime = workingTime;

    // await store.validate();
    await store.save();

    // Return only selected fields
    const updatedStore = {
      name: store.name,
      currency: store.currency,
      contact: store.contact,
      status: store.status,
      ownerId: store.ownerId,
      workingTime: store.workingTime,
      createdAt: store.createdAt,
    };

    return success(res, updatedStore, 200);
  } catch (err) {
    console.error(`updateStore Error: ${err}`);
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

const deleteStore = async (req, res) => {
  const { storeId } = req.params;
  try {
    // Find the store by its ID and delete it
    const store = await Store.findByIdAndDelete(storeId);

    // Check if the store exists
    if (!store) {
      return error(res, STORE_NOT_FOUND, 404);
    }

    // Remove the storeId from the accessStores of all admins
    await User.updateMany(
      { accessStores: storeId }, // Match admins where accessStores contains the storeId
      { $pull: { accessStores: storeId } } // Pull the storeId from the accessStores array
    );

    // Return a success response
    return success(res, "Store deleted successfully", 200);
  } catch (err) {
    console.log(`deleteStore error: ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const storeControllers = {
  createStore,
  getAllStores,
  getStoreByOwner,
  getStore,
  getStoreStatus,
  getStoreOffers,
  getStoreOrders,
  getStoreFeedback,
  updateStore,
  deleteStore,
};

module.exports = storeControllers;
