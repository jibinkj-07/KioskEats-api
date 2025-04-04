const { success, error } = require("../../core/util/response");
const Store = require("../models/store.model");
const Offer = require("../models/offer.model");
const validator = require("../validators/store.validator");

const SERVER_ERROR = "Internal server error";
const STORE_NOT_FOUND = "Store not found";
const OFFER_NOT_FOUND = "Offer not found";

const getOffers = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id offers");
    if (store) return success(res, store);
    return error(res, STORE_NOT_FOUND, 404);
  } catch (err) {
    console.log(`getOffers ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const addOffer = async (req, res) => {
  const { storeId } = req.params;
  // Validating request
  const error = validator.addOfferReq(req);
  if (error) return error(res, error);

  const {
    title,
    description,
    actualPrice,
    discountPrice,
    applicableItems,
    image,
    status,
  } = req.body;

  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    // Create offer
    const offer = await Offer.create({
      storeId,
      title,
      description,
      applicableItems,
      actualPrice,
      discountPrice,
      image,
      status,
    });

    // Add offer Id into Store offers array
    store.offers.push(offer._id);
    await store.save();

    return success(res, offer, 201);
  } catch (err) {
    console.log(`addOffer ${err} `);
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

const updateOffer = async (req, res) => {
  const { storeId, offerId } = req.params;
  // Validating request
  if (!req.body || Object.keys(req.body).length === 0) {
    return error(res, "No changes provided", 400);
  }

  const {
    title,
    description,
    actualPrice,
    discountPrice,
    applicableItems,
    image,
    status,
  } = req.body;
  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    const offer = await Offer.findById(offerId);
    if (!offer) return error(res, OFFER_NOT_FOUND, 404);

    // Update only provided fields
    if (title) offer.title = title;
    if (description) offer.description = description;
    if (applicableItems) offer.applicableItems = applicableItems;
    if (actualPrice) offer.actualPrice = actualPrice;
    if (discountPrice) offer.discountPrice = discountPrice;
    if (image) offer.image = image;
    if (status) offer.status = status;

    await offer.save();

    return success(res, offer);
  } catch (err) {
    console.log(`updateOffer ${err} `);
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

const deleteOffer = async (req, res) => {
  const { storeId, offerId } = req.params;

  try {
    // Find and delete the offer item
    const offer = await Offer.findByIdAndDelete(offerId);
    if (!offer) return error(res, OFFER_NOT_FOUND, 404);

    // Remove the offer reference from the Store model
    const storeUpdate = await Store.updateOne(
      { _id: storeId }, // Find store by ID
      { $pull: { offers: offerId } } // Remove offer from menuItems array
    );

    if (storeUpdate.modifiedCount === 0) {
      return error(res, "Store not found or item not linked", 404);
    }

    return success(res, "Offer deleted successfully");
  } catch (err) {
    console.error(`deleteOffer Error: ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const deleteAllOffers = async (req, res) => {
  const { storeId } = req.params;
  try {
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    // Remove all offers linked to the store
    const result = await Offer.deleteMany({ storeId });

    // Clear offers array in Store if it's stored
    await Store.updateOne({ _id: storeId }, { $set: { offers: [] } });
    return success(res, `Offer cleared; ${result.deletedCount} items deleted`);
  } catch (err) {
    console.log(`deleteAllOffer ${err} `);
    return error(res, SERVER_ERROR, 500);
  }
};

const controllers = {
  getOffers,
  addOffer,
  updateOffer,
  deleteOffer,
  deleteAllOffers,
};
module.exports = controllers;
