const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getLeaderboard,
} = require("../controllers/userController");

router.post("/add", createUser);
router.get("/", getUsers);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
