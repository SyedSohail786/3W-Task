const express = require("express");
const router = express.Router();
const {
  claimPoints,
  getHistory
} = require("../controllers/claimController");

router.post("/", claimPoints);
router.get("/history", getHistory);

module.exports = router;
