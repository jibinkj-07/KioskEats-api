const createStoreReq = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }
  const { name, address, city, state, country, currencyCode, currencySymbol } =
    req.body;
  if (!name) return "Name is required";
  if (!address) return "Address is required";
  if (!city) return "City is required";
  if (!state) return "State or Province is required";
  if (!country) return "Country is required";
  if (!currencyCode) return "Currency code is required";
  if (!currencySymbol) return "Currency symbol is required";
};

const addMenuItemReq = (req) => {
  if (!res.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }

  const { name, price, categoryId } = req.body;

  if (!name) return "Name is required";
  if (!price) return "Price is required";
  if (!categoryId) return "Category id is required";
};
const addCategoryReq = (req) => {
  if (!res.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }

  const { title, icon } = req.body;

  if (!title) return "Title is required";
  if (!icon) return "Icon is required";
};

const validators = { createStoreReq, addMenuItemReq, addCategoryReq };

module.exports = validators;
