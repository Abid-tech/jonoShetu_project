const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "VoteEvent" },
  area: { type: String, required: true },
  choice: { type: String, enum: ["yes", "no"], required: true }
});

module.exports = mongoose.model("Vote", voteSchema);
