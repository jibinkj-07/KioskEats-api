const router = require("express").Router();
const verifyjwt = require("../../lib/middleware/verifyjwt");
const controller = require("../../lib/controllers/store.controller");

// GET METHODS

// POST METHODS
router.post("/", verifyjwt, controller.createStore);

module.exports = router;
