const express = require("express");
const router = express.Router();
const voteController = require("../controller/voteController");

router.post("/create", voteController.createEvent);
router.get("/", voteController.getEvents);
router.post("/vote/:id", voteController.vote);

module.exports = router;