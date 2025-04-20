const router = require("express").Router();
const controller = require("../../lib/controllers/general.controller");

router.get("/reach", controller.getReach);

module.exports = router;
