const User = require("../model/User");



// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name } = req.body;
    if(!name) return res.send({code:501, msg:"user name is required"})
    const user = new User({ name });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Get leaderboard (sorted by totalPoints)
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    const leaderboard = users.map((user, index) => ({
      name: user.name,
      totalPoints: user.totalPoints,
      rank: index + 1
    }));
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
};
