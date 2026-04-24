
const Notice = require('../models/notice');


exports.createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true })
      .sort({ publishedAt: -1 });

    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateNotice = async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Notice deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};