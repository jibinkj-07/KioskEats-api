const { error } = require("../../core/util/response");
const User = require("../models/user.model");

const isAdmin = async (req, res, next) => {
  const { storeId } = req.params;

  if (!req.userId) return error(res, "User is not authorised", 401);

  const admin = await User.findById(req.userId);

  // Check if admin exists
  if (!admin) {
    return error(res, "Admin not found", 404);
  }

  // Check admin role
  if (admin.role !== "admin") {
    return error(res, "User has no access to perform this operation", 401);
  }

  // Check if storeId is in the admin's store list
  const hasStoreAccess = admin.storeList.includes(storeId);
  if (!hasStoreAccess) {
    return error(
      res,
      "Admin has no access to perform this operation on this store",
      401
    );
  }

  next();
};

module.exports = isAdmin;
