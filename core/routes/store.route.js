const router = require("express").Router();
const verifyjwt = require("../../lib/middleware/verifyjwt");
const isAdmin = require("../../lib/middleware/isAdmin");
const storeController = require("../../lib/controllers/store.controller");
const menuController = require("../../lib/controllers/menu.controller");
const categoryController = require("../../lib/controllers/category.controller");

// GET METHODS
router.get("/", storeController.getAllStores); // All Stores details
router.get("/owner/:ownerId", storeController.getStoreByOwner); // All Stores by ownerId

router.get("/:storeId", storeController.getStore); // Store basic details
router.get("/:storeId/status", storeController.getStoreStatus); // Store status
router.get("/:storeId/menu", menuController.getMenuItems); // Store menuItems
router.get("/:storeId/categories", categoryController.getCategories); // Store categories
router.get("/:storeId/orders", verifyjwt, storeController.getStoreOrders); // Store orders
router.get("/:storeId/offers", storeController.getStoreOffers); // Store offer
router.get("/:storeId/feedback", storeController.getStoreFeedback); // Store feedback

// POST METHODS
router.post("/", verifyjwt, isAdmin, storeController.createStore);
router.post("/:storeId/menu", verifyjwt, isAdmin, menuController.addMenuItem);
router.post(
  "/:storeId/categories",
  verifyjwt,
  isAdmin,
  categoryController.addCategory
);

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
  isAdmin,
  menuController.updateMenuItem
);

router.patch(
  "/:storeId/categories/:categoryId",
  verifyjwt,
  isAdmin,
  categoryController.updateCategory
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
  categoryController.deleteAllCategory
);

module.exports = router;
