const createStoreReq = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }
  const { name, address, city, state, country } = req.body;
  if (!name) return "Name is required";
  if (!address) return "Address is required";
  if (!city) return "City is required";
  if (!state) return "State or Province is required";
  if (!country) return "Country is required";
};

const validators = { createStoreReq };

module.exports = validators;
