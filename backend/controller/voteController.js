const VoteEvent = require("../models/voteEvent");
const Vote = require("../models/vote");

// Create voting event (Admin)
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

// Vote (anonymous + area stored)
exports.vote = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote, area } = req.body;

    const event = await VoteEvent.findById(id);

    const now = new Date();
    if (now < event.startTime || now > event.endTime) {
      return res.status(400).json({ message: "Voting is closed" });
    }

    const newVote = new Vote({
      eventId: id,
      area,
      choice: vote
    });

    await newVote.save();

    res.json({ message: "Vote submitted anonymously" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
