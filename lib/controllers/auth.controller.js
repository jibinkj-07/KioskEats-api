const validator = require("../validators/auth.validators");

const { success, error } = require("../../core/util/response");
const User = require("../models/user.model");
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

  const { name, email, password, role } = req.body;
  try {
    // Check duplication of admin email
    const existUser = await User.findOne({ email });
    if (existUser) return error(res, "User already registered with this email");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and store new admin user
    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    // Sending onboard mail
    await sendWelcomeMail(
      user.name,
      user.email,
      `${process.env.CLIENT_URL}/home`
    );

    // Generate jwt
    generateJWT(user._id, res);

    // Convert Mongoose document to a plain object
    const userData = user.toObject();

    //Remove unnecessary data
    delete userData.password;
    delete userData.resetPasswordToken;
    delete userData.resetPasswordExpiresIn;

    return success(res, userData, 201);
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
    const user = await User.findOne({ email });
    if (!user) return error(res, userNotFound, 404);

    // Comapare password
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) return error(res, "Invalid password");

    // Generate jwt
    generateJWT(user._id, res);

    // Convert Mongoose document to a plain object
    const userData = user.toObject();

    //Remove unnecessary data
    delete userData.password;
    delete userData.resetPasswordToken;
    delete userData.resetPasswordExpiresIn;

    return success(res, userData);
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
    const user = await User.findById(req.userId);
    if (!user) return error(res, userNotFound);

    // Convert Mongoose document to a plain object
    const userData = user.toObject();

    //Remove unnecessary data
    delete userData.password;
    delete userData.resetPasswordToken;
    delete userData.resetPasswordExpiresIn;

    return success(res, userData, 200);
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

  const TOKEN_LIFE = 10 * 60 * 1000; // 10 mins
  const COOLDOWN_GAP = 60 * 1000; // 1 mins

  try {
    // Get user from mongo db
    const user = await User.findOne({ email });
    if (!user) return error(res, userNotFound, 404);

    if (user.resetPasswordExpiresIn) {
      const lastRequestTime = user.resetPasswordExpiresIn - TOKEN_LIFE;
      const currentTime = Date.now();
      const requestTimeGap = currentTime - lastRequestTime;

      if (requestTimeGap <= COOLDOWN_GAP) {
        const remainingTime = Math.ceil((COOLDOWN_GAP - requestTimeGap) / 1000);

        return error(
          res,
          `Please wait ${remainingTime} seconds before requesting again`,
          429
        );
      }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const expiresIn = Date.now() + TOKEN_LIFE;

    // Save into database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresIn = expiresIn;
    await user.save();

    // send reset token
    const url = `${backendBaseUrl}/auth/reset-password?email=${user.email}&token=${resetToken}`;

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

    await sendResetMail(user.name, user.email, url, formattedDateTime);

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
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresIn: { $gt: Date.now() },
    });
    if (!user) return error(res, "Invalid or expired reset token");

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update fields to null in database
    user.resetPasswordToken = null;
    user.resetPasswordExpiresIn = null;
    user.password = hashedPassword;
    await user.save();

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
