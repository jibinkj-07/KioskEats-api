const jwt = require("jsonwebtoken");
const { error } = require("../../core/util/response");

const errorMessage = "User is not authorised";
const verifyjwt = (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) return error(res, errorMessage, 401);
    //Verify jwt token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    // Attaching user id into req part
    req.userId = decodedData.userId;
    next();
  } catch (err) {
    console.log(`verifyjwt ${err}`);
    return error(res, errorMessage, 401);
  }
};

module.exports = verifyjwt;
