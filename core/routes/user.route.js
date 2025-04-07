const router = require("express").Router();
const userController = require("../../lib/controllers/user.controller");

// GET METHODS
router.get("/", userController.currentUserData);
router.get("/:userId", userController.userData);
router.get("/orders", userController.orders);
router.get("/feedbacks", userController.feedbacks);

// PATCH METHODS
router.patch("/update", userController.updateProfile);

// DELETE METHODS
router.delete("/delete", userController.deleteAccount);

module.exports = router;
