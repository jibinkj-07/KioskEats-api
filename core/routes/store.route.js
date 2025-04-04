const router = require("express").Router();
const verifyjwt = require("../../lib/middleware/verifyjwt");
const isAdmin = require("../../lib/middleware/isAdmin");
const hasStoreAccess = require("../../lib/middleware/hasStoreAccess");
const hasOrderAccess = require("../../lib/middleware/hasOrderAccess");
const hasFeedbackAccess = require("../../lib/middleware/hasFeedbackAccess");
const storeController = require("../../lib/controllers/store.controller");
const menuController = require("../../lib/controllers/menu.controller");
const categoryController = require("../../lib/controllers/category.controller");
const orderController = require("../../lib/controllers/order.controller");
const offerController = require("../../lib/controllers/offer.controller");
const feedbackController = require("../../lib/controllers/feedback.controller");

// GET METHODS
router.get("/", storeController.getAllStores); // All Stores details
router.get("/owner/:ownerId", storeController.getStoreByOwner); // All Stores by ownerId

router.get("/:storeId", storeController.getStore); // Store basic details
router.get("/:storeId/status", storeController.getStoreStatus); // Store status
router.get("/:storeId/menu", menuController.getMenuItems); // Store menuItems
router.get("/:storeId/categories", categoryController.getCategories); // Store categories
router.get(
  "/:storeId/orders",
  verifyjwt,
  hasStoreAccess,
  orderController.getOrders
); // Store orders
router.get("/:storeId/offers", offerController.getOffers); // Store offer
router.get("/:storeId/feedbacks", feedbackController.getFeedbacks); // Store feedback

// POST METHODS
router.post("/", verifyjwt, isAdmin, storeController.createStore);
router.post(
  "/:storeId/menu",
  verifyjwt,
  hasStoreAccess,
  menuController.addMenuItem
);
router.post(
  "/:storeId/categories",
  verifyjwt,
  hasStoreAccess,
  categoryController.addCategory
);

router.post("/:storeId/orders", orderController.addOrder); // Anyone can order
router.post("/:storeId/offers", verifyjwt, isAdmin, offerController.addOffer);
router.post("/:storeId/feedbacks", feedbackController.addFeedback);

// PATCH METHODS
router.patch(
  "/:storeId/details",
  verifyjwt,
  isAdmin,
  storeController.updateStore
);

router.patch(
  "/:storeId/menu/:itemId",
  verifyjwt,
  hasStoreAccess,
  menuController.updateMenuItem
);

router.patch(
  "/:storeId/categories/:categoryId",
  verifyjwt,
  hasStoreAccess,
  categoryController.updateCategory
);

router.patch(
  "/:storeId/orders/:orderId",
  verifyjwt,
  (req, res, next) => {
    hasStoreAccess(req, res, (err) => {
      if (!err) return next(); // If hasStoreAccess passes, continue

      hasOrderAccess(req, res, next); // Otherwise, check hasOrderAccess
    });
  },
  storeController.updateStore
);

router.patch(
  "/:storeId/offers/:offerId",
  verifyjwt,
  isAdmin,
  offerController.updateOffer
);
router.patch(
  "/:storeId/feedbacks/:feedbackId",
  verifyjwt,
  (req, res, next) => {
    hasFeedbackAccess(req, res, (err) => {
      if (!err) return next(); // If hasFeedbackAccess passes, continue

      isAdmin(req, res, next); // Otherwise, check isAdmin
    });
  },
  feedbackController.updateFeedback
);

// DELETE METHODS
router.delete("/:storeId", verifyjwt, isAdmin, storeController.deleteStore);

router.delete(
  "/:storeId/menu/:itemId",
  verifyjwt,
  isAdmin,
  menuController.deleteMenuItem
);
router.delete(
  "/:storeId/menu",
  verifyjwt,
  isAdmin,
  menuController.deleteAllMenu
);

router.delete(
  "/:storeId/categories/:categoryId",
  verifyjwt,
  isAdmin,
  categoryController.deleteCategory
);
router.delete(
  "/:storeId/categories",
  verifyjwt,
  isAdmin,
  categoryController.deleteAllCategories
);

router.delete(
  "/:storeId/orders/:orderId",
  verifyjwt,
  (req, res, next) => {
    isAdmin(req, res, (err) => {
      if (!err) return next(); // If isAdmin passes, continue

      hasOrderAccess(req, res, next); // Otherwise, check hasOrderAccess
    });
  },
  orderController.deleteOrder
);

router.delete(
  "/:storeId/orders",
  verifyjwt,
  isAdmin,
  orderController.deleteAllOrders
);

router.delete(
  "/:storeId/offers/:offerId",
  verifyjwt,
  isAdmin,
  offerController.deleteOffer
);
router.delete(
  "/:storeId/offers",
  verifyjwt,
  isAdmin,
  offerController.deleteAllOffers
);
router.delete(
  "/:storeId/feedbacks/:feedbackId",
  verifyjwt,
  (req, res, next) => {
    hasFeedbackAccess(req, res, (err) => {
      if (!err) return next(); // If hasFeedbackAccess passes, continue

      isAdmin(req, res, next); // Otherwise, check isAdmin
    });
  },
  feedbackController.deleteFeedback
);
router.delete(
  "/:storeId/feedbacks",
  verifyjwt,
  isAdmin,
  feedbackController.deleteAllFeedbacks
);

module.exports = router;
