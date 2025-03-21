const validator = require("../validators/auth.validators");

const { success, error } = require("../../core/util/response");
const Admin = require("../models/admin.model");
const generateJWT = require("../../core/util/jwt");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  sendWelcomeMail,
  sendResetMail,
} = require("../../core/util/emailService");

const serverError = "Internal server error";
const userNotFound = "No user registered with this email";
const backendBaseUrl = `http://localhost:${process.env.PORT}/api`;

const register = async (req, res) => {
  // Validating request body
  const validation = validator.adminRegister(req);
  if (validation) return error(res, validation);

  const { name, email, password } = req.body;
  try {
    // Check duplication of admin email
    const existAdmin = await Admin.findOne({ email });
    if (existAdmin)
      return error(res, "User already registered with this email");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and store new admin user
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // Sending onboard mail
    await sendWelcomeMail(
      admin.name,
      admin.email,
      `${process.env.CLIENT_URL}/admin/home`
    );

    // Generate jwt
    generateJWT(admin._id, res);

    // Convert Mongoose document to a plain object
    const adminData = admin.toObject();

    //Remove unnecessary data
    delete adminData.password;
    delete adminData.resetPasswordToken;
    delete adminData.resetPasswordExpiresIn;

    return success(res, adminData, 201);
  } catch (err) {
    console.log(`register ${err}`);
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map((e) => e.message);
      return error(res, errorMessages.join(", "), 400);
    }
    return error(res, serverError, 500);
  }
};

const login = async (req, res) => {
  // Validating request body
  const validation = validator.adminLogin(req);
  if (validation) return error(res, validation);

  const { email, password } = req.body;
  try {
    // Get user from mongo db
    const admin = await Admin.findOne({ email });
    if (!admin) return error(res, userNotFound, 404);

    // Comapare password
    const isCorrect = await bcrypt.compare(password, admin.password);
    if (!isCorrect) return error(res, "Invalid password");

    // Generate jwt
    generateJWT(admin._id, res);

    // Convert Mongoose document to a plain object
    const adminData = admin.toObject();

    //Remove unnecessary data
    delete adminData.password;
    delete adminData.resetPasswordToken;
    delete adminData.resetPasswordExpiresIn;

    return success(res, adminData);
  } catch (err) {
    console.log(`login ${err}`);
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map((e) => e.message);
      return error(res, errorMessages.join(", "), 400);
    }
    return error(res, serverError, 500);
  }
};

const me = async (req, res) => {
  try {
    // Check user from mongo db
    const admin = await Admin.findById(req.userId);
    if (!admin) return error(res, userNotFound);

    // Convert Mongoose document to a plain object
    const adminData = admin.toObject();

    //Remove unnecessary data
    delete adminData.password;
    delete adminData.resetPasswordToken;
    delete adminData.resetPasswordExpiresIn;

    return success(res, adminData, 200);
  } catch (err) {
    console.log(`me ${err}`);
    return error(res, serverError, 500);
  }
};

const forgotPassword = async (req, res) => {
  // Validating request body
  const validation = validator.forgotPassword(req);
  if (validation) return error(res, validation);

  const { email } = req.body;
  try {
    // Get user from mongo db
    const admin = await Admin.findOne({ email });
    if (!admin) return error(res, userNotFound, 404);

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const expiresIn = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    // Save into database
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpiresIn = expiresIn;
    await admin.save();

    // send reset token
    const url = `${backendBaseUrl}/auth/reset-password?email=${admin.email}&token=${resetToken}`;

    // Formatting date and time
    const formattedDate = new Date(expiresIn).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = new Date(expiresIn).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    await sendResetMail(admin.name, admin.email, url, formattedDateTime);

    success(res, "Password reset mail sent. Check your inbox");
  } catch (err) {
    console.log(`resetPassword ${err}`);
    return error(res, serverError, 500);
  }
};

const updatePassword = async (req, res) => {
  // Validating request body
  const validation = validator.updatePassword(req);
  if (validation) return error(res, validation);

  const { token, password } = req.body;
  try {
    // Get user from mongo db
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresIn: { $gt: Date.now() },
    });
    if (!admin) return error(res, "Invalid or expired reset token");

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update fields to null in database
    admin.resetPasswordToken = null;
    admin.resetPasswordExpiresIn = null;
    admin.password = hashedPassword;
    await admin.save();

    success(res, "Password update successfully");
  } catch (err) {
    console.log(`updatePassword ${err}`);
    return error(res, "Unable to update password", 500);
  }
};

const signout = async (_, res) => {
  try {
    // Clear JWT cookie
    res.clearCookie("authToken");
    return success(res, "User signed out successfully");
  } catch (err) {
    console.log(`signout ${err}`);
    return error(res, "Failed to sign out", 500);
  }
};

const authController = {
  register,
  login,
  me,
  forgotPassword,
  updatePassword,
  signout,
};

module.exports = authController;
