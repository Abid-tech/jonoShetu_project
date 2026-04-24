
const GovLink = require('../models/govLink');


exports.createLink = async (req, res) => {
  try {
    const link = await GovLink.create(req.body);
    res.status(201).json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getLinks = async (req, res) => {
  try {
    const links = await GovLink.find({ isActive: true });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getLinkById = async (req, res) => {
  try {
    const link = await GovLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateLink = async (req, res) => {
  try {
    const updated = await GovLink.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteLink = async (req, res) => {
  try {
    await GovLink.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Link deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};