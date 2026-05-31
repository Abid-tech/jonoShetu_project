const VoteEvent = require("../models/voteEvent");
const Vote = require("../models/vote");

// Create voting event (Admin only)
exports.createEvent = async (req, res) => {
  try {
    const { question, startTime, endTime } = req.body;

    const event = new VoteEvent({ question, startTime, endTime });
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all events with aggregated results
exports.getEvents = async (req, res) => {
  try {
    const events = await VoteEvent.find();

    const results = await Promise.all(
      events.map(async (event) => {
        const votes = await Vote.find({ eventId: event._id });

        const yesCount = votes.filter(v => v.choice === "yes").length;
        const noCount = votes.filter(v => v.choice === "no").length;

        return {
          ...event._doc,
          yesCount,
          noCount
        };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's votes
exports.getUserVotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const votes = await Vote.find({ userId });
    res.json(votes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if user has voted in specific event
exports.checkUserVote = async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const vote = await Vote.findOne({ userId, eventId });
    res.json({ hasVoted: !!vote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Vote with user tracking and duplicate prevention
exports.vote = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote, area, userId, userNid, userName } = req.body;

    const event = await VoteEvent.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const now = new Date();
    if (now < event.startTime || now > event.endTime) {
      return res.status(400).json({ message: "Voting is closed" });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ eventId: id, userId });
    if (existingVote) {
      return res.status(400).json({ message: "Already voted", error: "DUPLICATE_VOTE" });
    }

    const newVote = new Vote({
      eventId: id,
      userId,
      userNid,
      userName,
      area,
      choice: vote
    });

    await newVote.save();

    res.json({ message: "Vote submitted successfully", success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};