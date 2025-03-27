const router = require("express").Router();
const verifyjwt = require("../../lib/middleware/verifyjwt");
const isAdmin = require("../../lib/middleware/isAdmin");
const controller = require("../../lib/controllers/store.controller");

// GET METHODS
router.get("/", controller.getAllStores); // All Stores details
router.get("/owner/:ownerId", controller.getStoreByOwner); // All Stores by ownerId

router.get("/:storeId", controller.getStore); // Store basic details
router.get("/:storeId/status", controller.getStoreStatus); // Store status
router.get("/:storeId/menu", controller.getStoreMenu); // Store menuItems
router.get("/:storeId/categories", controller.getStoreCategories); // Store categories
router.get("/:storeId/orders", verifyjwt, controller.getStoreOrders); // Store orders
router.get("/:storeId/offers", controller.getStoreOffers); // Store offer
router.get("/:storeId/feedback", controller.getStoreFeedback); // Store feedback

// POST METHODS
router.post("/", verifyjwt, isAdmin, controller.createStore);

// PATCH METHODS
router.patch("/:storeId/details", verifyjwt, isAdmin, controller.updateStore);

// DELETE METHODS
router.delete("/:storeId", verifyjwt, isAdmin, controller.deleteStore);
module.exports = router;
