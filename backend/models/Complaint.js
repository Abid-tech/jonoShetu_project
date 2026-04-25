const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    lat: Number,
    lng: Number,
    coordinates: [Number]
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'resolved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);