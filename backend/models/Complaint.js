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
  originalDepartment: {     // NEW: Store what user selected
    type: String,
    default: ""
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
  priority: {              // NEW: Priority level
    type: String,
    enum: ['urgent', 'high', 'medium', 'low'],
    default: 'medium'
  },
  priorityScore: {         // NEW: Numeric score for sorting
    type: Number,
    default: 0
  },
  assignedAt: {            // NEW: When complaint was assigned
    type: Date,
    default: Date.now
  },
  lastUpdated: {           // NEW: Last status update
    type: Date,
    default: Date.now
  },
  resolvedAt: {            // NEW: When resolved
    type: Date
  },
  remarks: {               // NEW: Admin remarks
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);