const mongoose = require("mongoose");

const voteEventSchema = new mongoose.Schema({
  question: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

module.exports = mongoose.model("VoteEvent", voteEventSchema);
