const { error } = require("../../core/util/response");
const Admin = require("../models/admin.model");

const isAdmin = async (req, res, next) => {
  if (!req.userId) return error(res, "User is not authorised", 401);
  const admin = await Admin.findById(req.userId);
  if (admin.role !== "admin") {
    return error(res, "User has no access to perform this operation", 401);
  }
  next();
};

module.exports = isAdmin;
