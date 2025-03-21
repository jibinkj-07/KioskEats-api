const adminRegister = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }
  const { email, name, password } = req.body;

  if (!email) return "Email is required";
  if (!name) return "Name is required";
  if (!password) return "Password is required";
  if (password.length < 6)
    return "Password should be greater than 6 characters";

  return null;
};

const adminLogin = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }
  const { email, name, password } = req.body;

  if (!email) return "Email is required";
  if (!password) return "Password is required";
  if (password.length < 6)
    return "Password should be greater than 6 characters";

  return null;
};

const forgotPassword = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }
  const { email } = req.body;

  if (!email) return "Email is required";

  return null;
};
const updatePassword = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }
  const { token, password } = req.body;

  if (!token) return "Reset token is missing";
  if (!password) return "Password is required";
  if (password.length < 6)
    return "Password should be greater than 6 characters";

  return null;
};

const validators = {
  adminRegister,
  adminLogin,
  forgotPassword,
  updatePassword,
};

module.exports = validators;
