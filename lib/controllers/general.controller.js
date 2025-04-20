const { success, error } = require("../../core/util/response");
const Store = require("../models/store.model");
const User = require("../models/user.model");
const Orders = require("../models/order.model");

const SERVER_ERROR = "Internal server error";

const getReach = async (req, res) => {
  try {
    const stores = await Store.countDocuments();
    const users = await User.countDocuments();
    const orders = await Orders.countDocuments();

    return success(res, {
      stores,
      users,
      orders,
    });
  } catch (err) {
    console.log(err);
    return error(res, SERVER_ERROR, 500);
  }
};

const controllers = { getReach };

module.exports = controllers;
