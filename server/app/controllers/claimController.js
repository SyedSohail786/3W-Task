const History = require("../model/History");
const User = require("../model/User");


exports.claimPoints = async (req, res) => {
  try {
    const { userId } = req.body;

    // Generate random points
    const points = Math.floor(Math.random() * 10) + 1;

    // Update user's total points
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: points } },
      { new: true }
    );

    // Create claim history
    const history = new History({
      userId,
      points
    });
    await history.save();

    res.json({
      message: "Points claimed successfully",
      user,
      claimedPoints: points
    });
  } catch (error) {
    res.status(500).json({ error: "Error claiming points" });
  }
};

// Get history of claimed points
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find().populate("userId", "name").sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Error fetching history" });
  }
};
