const express = require("express");
const router = express.Router();

router.get("/");
router.get("/login");
router.get("/register");

module.exports = router;
