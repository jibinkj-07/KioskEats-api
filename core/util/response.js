const success = (res, message = "OK", statusCode = 200) => {
  return res.status(statusCode).json({
    status: "success",
    result: message,
  });
};
const error = (res, message = "error", statusCode = 400) => {
  return res.status(statusCode).json({
    status: "failure",
    result: message,
  });
};

module.exports = { success, error };
