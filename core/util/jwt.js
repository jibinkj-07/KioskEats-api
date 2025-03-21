const jwt = require("jsonwebtoken");

const generateJWT = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Setting cookie
  res.cookie("authToken", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.ENV !== "development",
  });

  return token;
};

module.exports = generateJWT;
