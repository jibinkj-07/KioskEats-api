const { error } = require("../../core/util/response");
const User = require("../models/user.model");

const hasStoreAccess = async (req, res, next) => {
  const { storeId } = req.params;

  if (!req.userId) return error(res, "User is not authorised", 401);

  const user = await User.findById(req.userId);

  // Check if admin exists
  if (!user) {
    return error(res, "User not found", 404);
  }

  // Check if storeId is in the user's store list
  const storeAccess = user.storeList.includes(storeId);
  if (!storeAccess) {
    return error(
      res,
      "User has no access to perform this operation on this store",
      401
    );
  }

  next();
};

module.exports = hasStoreAccess;
