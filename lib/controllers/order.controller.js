const Store = require("../models/store.model");
const Category = require("../models/category.model");
const validator = require("../validators/store.validator");
const { success, error } = require("../../core/util/response");

const SERVER_ERROR = "Internal server error";
const STORE_NOT_FOUND = "Store not found";
const ORDER_NOT_FOUND = "Order not found";

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
  const error = validator.addCategoryReq(req);
  if (error) return error(res, error);

  const { title, icon, description } = req.body;
  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);
    // Create category
    const category = await Category.create({
      title,
      icon,
      description,
      storeId,
    });

    // Add Menu item Id into Store MenuItems array
    store.categories.push(category._id);
    await store.save();

    return success(res, category, 201);
  } catch (err) {
    console.log(`addCategory ${err} `);
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
  const { storeId, categoryId } = req.params;
  // Validating request
  if (!req.body || Object.keys(req.body).length === 0) {
    return error(res, "No changes provided", 400);
  }

  const { title, icon, description } = req.body;
  try {
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    const category = await Category.findById(categoryId);
    if (!category) return error(res, CATEGORY_NOT_FOUND, 404);

    // Update only provided fields
    if (title) category.title = title;
    if (icon) category.icon = icon;
    if (description) category.description = description;

    await category.save();

    return success(res, category);
  } catch (err) {
    console.log(`updateCategory ${err} `);
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
  const { storeId, categoryId } = req.params;

  try {
    // Find and delete the menu item
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) return error(res, CATEGORY_NOT_FOUND, 404);

    // Remove the menuItem reference from the Store model
    const storeUpdate = await Store.updateOne(
      { _id: storeId }, // Find store by ID
      { $pull: { categories: categoryId } } // Remove item from categories array
    );

    if (storeUpdate.modifiedCount === 0) {
      return error(res, "Store not found or category not linked", 404);
    }

    return success(res, "Category deleted successfully");
  } catch (err) {
    console.error(`deleteCategory Error: ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const deleteAllOrders = async (req, res) => {
  const { storeId } = req.params;
  try {
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) return error(res, STORE_NOT_FOUND, 404);

    // Remove all categories linked to the store
    const result = await Category.deleteMany({ storeId });

    // Clear categories array in Store if it's stored
    await Store.updateOne({ _id: storeId }, { $set: { categories: [] } });
    return success(
      res,
      `Categories cleared; ${result.deletedCount} items deleted`
    );
  } catch (err) {
    console.log(`deleteAllCategories ${err} `);
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
