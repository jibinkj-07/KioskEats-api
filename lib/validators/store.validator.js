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

  const { name, price, categoryId, variants } = req.body;

  if (!name) return "Name is required";
  if (!price) return "Price is required";
  if (!categoryId) return "Category id is required";
  if (!variants) return "One variant entry is required";
};

const addCategoryReq = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }

  const { title, icon } = req.body;

  if (!title) return "Title is required";
  if (!icon) return "Icon is required";
};

const addOrderReq = (req) => {
  if (!res.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }

  const { items, offers, paymentMethod, totalAmount, discountAmount } =
    req.body;

  if (!items?.length && !offers?.length) {
    return "At least one item is required";
  }

  if (!paymentMethod) return "Payment method is required";
  if (!totalAmount) return "Total amount is required";
  if (!discountAmount) return "Dicount amount is required";
};

const addFeedbackReq = (req) => {
  if (!res.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }

  const { rating } = req.body;

  if (!rating) return "Rating is required";
};
const addOfferReq = (req) => {
  if (!res.body || Object.keys(req.body).length === 0) {
    return "All fields are required";
  }

  const { title, actualPrice, discountPrice, applicableItems } = req.body;

  if (!applicableItems?.length) {
    return "At least one item is required";
  }

  if (!title) return "Title is required";
  if (!actualPrice) return "Actual amount is required";
  if (!discountPrice) return "Dicount amount is required";
};

const validators = {
  createStoreReq,
  addMenuItemReq,
  addCategoryReq,
  addOrderReq,
  addOfferReq,
  addFeedbackReq,
};

module.exports = validators;
