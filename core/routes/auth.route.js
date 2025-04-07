const router = require("express").Router();
const verifyjwt = require("../../lib/middleware/verifyjwt");
const path = require("path");

const controller = require("../../lib/controllers/auth.controller");

// GET METHODS
router.get("/reset-password", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../public/reset-password.html"));
});

router.get("/signout", verifyjwt, controller.signout);

// POST METHODS
router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/forgot-password", controller.forgotPassword);

router.post("/update-password", controller.updatePassword);

module.exports = router;
