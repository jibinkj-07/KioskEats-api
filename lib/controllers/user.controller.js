const User = require("../models/user.model");
const Feedback = require("../models/feedback.model");
const Order = require("../models/order.model");
const { success, error } = require("../../core/util/response");

const SERVER_ERROR = "Internal server error";
const USER_NOT_FOUND = "No user registered with this email";

const currentUserData = async (req, res) => {
  try {
    // Check user from mongo db
    const user = await User.findById(req.userId).select(
      "-password -resetPasswordToken -resetPasswordExpiresIn"
    );
    if (!user) return error(res, USER_NOT_FOUND, 404);

    return success(res, user, 200);
  } catch (err) {
    console.log(`userData ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};
const userData = async (req, res) => {
  let { userId } = req.params;
  if (!userId) return error(res, "No userid provided");
  try {
    // Check user from mongo db
    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpiresIn"
    );
    if (!user) return error(res, USER_NOT_FOUND, 404);

    return success(res, user, 200);
  } catch (err) {
    console.log(`userData ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const updateProfile = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return error(res, "No changes provided", 400);
  }

  const {
    name,
    profileURL,
    address,
    city,
    state,
    country,
    postalCode,
    phone,
    selectedStore,
  } = req.body;

  try {
    const user = await User.findById(req.userId).select(
      "-password -resetPasswordToken -resetPasswordExpiresIn"
    );
    if (!user) return error(res, USER_NOT_FOUND, 404);

    // Update only provided fields
    if (name) user.name = name;
    if (profileURL) user.profileURL = profileURL;
    if (address) user.contact.location.address = address;
    if (city) user.contact.location.city = city;
    if (state) user.contact.location.stateProvince = state;
    if (country) user.contact.location.country = country;
    if (postalCode) user.contact.location.postalCode = postalCode;
    if (phone) user.contact.phone = phone;
    if (selectedStore) user.selectedStore = selectedStore;

    await user.save();

    return success(res, user, 200);
  } catch (err) {
    console.error(`updateProfile Error: ${err}`);
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

const feedbacks = async (req, res) => {
  const userId = req.userId;
  try {
    // Fetch feedback with userid
    const result = await Feedback.find({ userId });
    return success(res, result);
  } catch (err) {
    console.log(`feedbacks ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const orders = async (req, res) => {
  const userId = req.userId;
  try {
    // Fetch orders with userid
    const result = await Order.find({ userId });
    return success(res, result);
  } catch (err) {
    console.log(`orders ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const deleteAccount = async (req, res) => {
  const userId = req.userId;
  try {
    // Check user from mongo db
    const user = await User.findById(userId);
    if (!user) return error(res, USER_NOT_FOUND, 404);

    // Only allow deletion if user role is [user]
    if (user.role !== "user") {
      return error(
        res,
        "Account deletion is restricted for admin users. Kindly reach out to the support team.",
        403
      );
    }

    // Delete orders and feedbacks
    await Order.deleteMany({ userId });
    await Feedback.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    // Clear JWT cookie
    res.clearCookie("authToken");
    return success(res, "Account delete successfully");
  } catch (err) {
    console.log(`deleteAccount ${err}`);
    return error(res, SERVER_ERROR, 500);
  }
};

const controller = {
  currentUserData,
  userData,
  updateProfile,
  orders,
  feedbacks,
  deleteAccount,
};

module.exports = controller;
