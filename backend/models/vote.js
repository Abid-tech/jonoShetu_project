const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "VoteEvent", required: true },
  userId: { type: String, required: true },
  userNid: { type: String, required: true },
  userName: { type: String, required: true },
  area: { type: String, required: true },
  choice: { type: String, enum: ["yes", "no"], required: true },
  votedAt: { type: Date, default: Date.now }
});

// Ensure one user can vote only once per event
voteSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);