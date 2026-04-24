
const mongoose = require('mongoose');

const govLinkSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String, 
      default: "General",
    },
    icon: {
      type: String, 
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GovLink', govLinkSchema);