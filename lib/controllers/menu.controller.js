const { success, error } = require("../../core/util/response");
const Store = require("../models/store.model");
const MenuItem = require("../models/menu.items.model");
const validator = require("../validators/store.validator");

const SERVER_ERROR = "Internal server error";
const STORE_NOT_FOUND = "Store not found";
const ITEM_NOT_FOUND = "Item not found";

const getMenuItems = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await Store.findById(storeId).select("-_id menuItems");
    if (store) return success(res, store);
    return error(res, STORE_NOT_FOUND, 404);
  } catch (err) {
    console.log(`getMenuItems ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const addMenuItem = async (req, res) => {
  const { storeId } = req.params;
  // Validating request
  const error = validator.addMenuItemReq(req);
  if (error) return error(res, error);

  const { name, description, availability, imageURL, categoryId, variants } =
    req.body;
  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);
    // Create menu item
    const menuItem = await MenuItem.create({
      name,
      description,
      category: categoryId,
      availability,
      image: imageURL,
      storeId,
      variants,
    });

    // Add Menu item Id into Store MenuItems array
    store.menuItems.push(menuItem._id);
    await store.save();

    return success(res, menuItem, 201);
  } catch (err) {
    console.log(`addMenuItem ${err} `);
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

const updateMenuItem = async (req, res) => {
  const { storeId, itemId } = req.params;
  // Validating request
  if (!req.body || Object.keys(req.body).length === 0) {
    return error(res, "No changes provided", 400);
  }

  const { name, description, availability, imageURL, categoryId, variants } =
    req.body;
  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) return error(res, ITEM_NOT_FOUND, 404);

    // Update only provided fields
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (availability) menuItem.availability = availability;
    if (imageURL) menuItem.image = imageURL;
    if (categoryId) menuItem.category = categoryId;
    if (variants) menuItem.variants = variants;

    await menuItem.save();

    return success(res, menuItem);
  } catch (err) {
    console.log(`updateMenuItem ${err} `);
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

const deleteMenuItem = async (req, res) => {
  const { storeId, itemId } = req.params;

  try {
    // Find and delete the menu item
    const menuItem = await MenuItem.findByIdAndDelete(itemId);
    if (!menuItem) return error(res, ITEM_NOT_FOUND, 404);

    // Remove the menuItem reference from the Store model
    const storeUpdate = await Store.updateOne(
      { _id: storeId }, // Find store by ID
      { $pull: { menuItems: itemId } } // Remove item from menuItems array
    );

    if (storeUpdate.modifiedCount === 0) {
      return error(res, "Store not found or item not linked", 404);
    }

    return success(res, "Menu item deleted successfully");
  } catch (err) {
    console.error(`deleteMenuItem Error: ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const deleteAllMenu = async (req, res) => {
  const { storeId } = req.params;
  try {
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    // Remove all menu items linked to the store
    const result = await MenuItem.deleteMany({ storeId });

    // Clear menuItems array in Store if it's stored
    await Store.updateOne({ _id: storeId }, { $set: { menuItems: [] } });
    return success(res, `Menu cleared; ${result.deletedCount} items deleted`);
  } catch (err) {
    console.log(`deleteAllMenu ${err} `);
    return error(res, SERVER_ERROR, 500);
  }
};

const controllers = {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  deleteAllMenu,
};
module.exports = controllers;
