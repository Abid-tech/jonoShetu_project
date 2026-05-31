const Complaint = require("../models/Complaint");

// Helper function: Determine priority based on complaint type and time
const calculatePriority = (department, district, createdAt) => {
  // Priority scoring system: higher score = higher priority
  let score = 0;
  
  // ----- 1. Department/Category based priority -----
  const highPriorityDepts = [
    "ঢাকা", "চট্টগ্রাম"  // Metro cities - higher priority
  ];
  const mediumPriorityDepts = [
    "খুলনা", "রাজশাহী", "সিলেট", "রংপুর"
  ];
  
  if (highPriorityDepts.includes(department)) {
    score += 30;
  } else if (mediumPriorityDepts.includes(department)) {
    score += 15;
  }
  
  // ----- 2. District based urgency -----
  const urgentDistricts = [
    "ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "চট্টগ্রাম"
  ];
  if (urgentDistricts.includes(district)) {
    score += 25;
  }
  
  // ----- 3. Time-based aging (older complaints get higher priority after 7 days) -----
  const daysOld = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  if (daysOld >= 14) {
    score += 40;  // Very old
  } else if (daysOld >= 7) {
    score += 20;  // Moderately old
  } else if (daysOld >= 3) {
    score += 10;  // A few days old
  }
  
  // ----- 4. Return priority level based on score -----
  if (score >= 50) return "urgent";
  if (score >= 25) return "high";
  if (score >= 10) return "medium";
  return "low";
};

// Helper function: Get department based on district
const assignDepartment = (district) => {
  // District to Department mapping
  const departmentMapping = {
    // Dhaka division
    "ঢাকা": "ঢাকা সিটি কর্পোরেশন",
    "গাজীপুর": "গাজীপুর সিটি কর্পোরেশন",
    "নারায়ণগঞ্জ": "নারায়ণগঞ্জ সিটি কর্পোরেশন",
    "কিশোরগঞ্জ": "কিশোরগঞ্জ জেলা প্রশাসন",
    "মানিকগঞ্জ": "মানিকগঞ্জ জেলা প্রশাসন",
    "মুন্সীগঞ্জ": "মুন্সীগঞ্জ জেলা প্রশাসন",
    "নরসিংদী": "নরসিংদী জেলা প্রশাসন",
    "টাঙ্গাইল": "টাঙ্গাইল জেলা প্রশাসন",
    "শরীয়তপুর": "শরীয়তপুর জেলা প্রশাসন",
    "ফরিদপুর": "ফরিদপুর জেলা প্রশাসন",
    "রাজবাড়ী": "রাজবাড়ী জেলা প্রশাসন",
    
    // Chittagong division
    "চট্টগ্রাম": "চট্টগ্রাম সিটি কর্পোরেশন",
    "কুমিল্লা": "কুমিল্লা জেলা প্রশাসন",
    "ফেনী": "ফেনী জেলা প্রশাসন",
    "ব্রাহ্মণবাড়িয়া": "ব্রাহ্মণবাড়িয়া জেলা প্রশাসন",
    "চাঁদপুর": "চাঁদপুর জেলা প্রশাসন",
    "লক্ষ্মীপুর": "লক্ষ্মীপুর জেলা প্রশাসন",
    "নোয়াখালী": "নোয়াখালী জেলা প্রশাসন",
    "রাঙ্গামাটি": "রাঙ্গামাটি পার্বত্য জেলা পরিষদ",
    "বান্দরবান": "বান্দরবান পার্বত্য জেলা পরিষদ",
    "খাগড়াছড়ি": "খাগড়াছড়ি পার্বত্য জেলা পরিষদ",
    "কক্সবাজার": "কক্সবাজার জেলা প্রশাসন",
    
    // Khulna division
    "খুলনা": "খুলনা সিটি কর্পোরেশন",
    "যশোর": "যশোর জেলা প্রশাসন",
    "কুষ্টিয়া": "কুষ্টিয়া জেলা প্রশাসন",
    "বাগেরহাট": "বাগেরহাট জেলা প্রশাসন",
    "সাতক্ষীরা": "সাতক্ষীরা জেলা প্রশাসন",
    "ঝিনাইদহ": "ঝিনাইদহ জেলা প্রশাসন",
    "মাগুরা": "মাগুরা জেলা প্রশাসন",
    "নড়াইল": "নড়াইল জেলা প্রশাসন",
    "চুয়াডাঙ্গা": "চুয়াডাঙ্গা জেলা প্রশাসন",
    "মেহেরপুর": "মেহেরপুর জেলা প্রশাসন",
    
    // Rajshahi division
    "রাজশাহী": "রাজশাহী সিটি কর্পোরেশন",
    "বগুরা": "বগুরা জেলা প্রশাসন",
    "পাবনা": "পাবনা জেলা প্রশাসন",
    "নওগাঁ": "নওগাঁ জেলা প্রশাসন",
    "নাটোর": "নাটোর জেলা প্রশাসন",
    "সিরাজগঞ্জ": "সিরাজগঞ্জ জেলা প্রশাসন",
    "জয়পুরহাট": "জয়পুরহাট জেলা প্রশাসন",
    
    // Sylhet division
    "সিলেট": "সিলেট সিটি কর্পোরেশন",
    "সুনামগঞ্জ": "সুনামগঞ্জ জেলা প্রশাসন",
    "মৌলভীবাজার": "মৌলভীবাজার জেলা প্রশাসন",
    "হবিগঞ্জ": "হবিগঞ্জ জেলা প্রশাসন",
    
    // Barishal division
    "বরিশাল": "বরিশাল সিটি কর্পোরেশন",
    "ভোলা": "ভোলা জেলা প্রশাসন",
    "পটুয়াখালী": "পটুয়াখালী জেলা প্রশাসন",
    "বরগুনা": "বরগুনা জেলা প্রশাসন",
    "ঝালকাঠি": "ঝালকাঠি জেলা প্রশাসন",
    "পিরোজপুর": "পিরোজপুর জেলা প্রশাসন",
    
    // Rangpur division
    "রংপুর": "রংপুর সিটি কর্পোরেশন",
    "দিনাজপুর": "দিনাজপুর জেলা প্রশাসন",
    "কুড়িগ্রাম": "কুড়িগ্রাম জেলা প্রশাসন",
    "গাইবান্ধা": "গাইবান্ধা জেলা প্রশাসন",
    "নীলফামারী": "নীলফামারী জেলা প্রশাসন",
    "লালমনিরহাট": "লালমনিরহাট জেলা প্রশাসন",
    "পঞ্চগড়": "পঞ্চগড় জেলা প্রশাসন",
    "ঠাকুরগাঁও": "ঠাকুরগাঁও জেলা প্রশাসন",
    
    // Mymensingh division
    "ময়মনসিংহ": "ময়মনসিংহ সিটি কর্পোরেশন",
    "জামালপুর": "জামালপুর জেলা প্রশাসন",
    "নেত্রকোনা": "নেত্রকোনা জেলা প্রশাসন",
    "শেরপুর": "শেরপুর জেলা প্রশাসন"
  };
  
  return departmentMapping[district] || "সাধারণ প্রশাসন বিভাগ";
};

exports.createComplaint = async (req, res) => {
  try {
    const { name, department: userSelectedDept, district, description, location } = req.body;
    
    // FEATURE 12: Auto-assign department (override user selection)
    const assignedDepartment = assignDepartment(district);
    
    // FEATURE 13: Calculate priority based on type and time
    const priority = calculatePriority(userSelectedDept || assignedDepartment, district, new Date());
    
    const complaint = await Complaint.create({
      name,
      department: assignedDepartment,  // Auto-assigned by system
      originalDepartment: userSelectedDept,  // Store what user selected (for analytics)
      district,
      description,
      location: location || null,
      priority,  // Added priority field
      priorityScore: calculatePriorityScore(userSelectedDept || assignedDepartment, district, new Date()), // Store score
      status: "pending",
      assignedAt: new Date(),
      lastUpdated: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: "অভিযোগ সফলভাবে জমা হয়েছে",
      data: complaint,
      meta: {
        assignedDepartment: assignedDepartment,
        priority: priority,
        trackingId: complaint._id
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper to calculate numeric score (for sorting/filtering)
const calculatePriorityScore = (department, district, createdAt) => {
  let score = 0;
  const highPriorityDepts = ["ঢাকা", "চট্টগ্রাম"];
  const urgentDistricts = ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "চট্টগ্রাম"];
  
  if (highPriorityDepts.includes(department)) score += 30;
  if (urgentDistricts.includes(district)) score += 25;
  
  const daysOld = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  if (daysOld >= 14) score += 40;
  else if (daysOld >= 7) score += 20;
  else if (daysOld >= 3) score += 10;
  
  return score;
};

// FEATURE 13: Get complaints sorted by priority
exports.getComplaintsByPriority = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ priorityScore: -1, createdAt: 1 })
      .lean();
    
    // Add priority label in Bangla
    const priorityMap = {
      'urgent': 'জরুরি',
      'high': 'উচ্চ',
      'medium': 'মাঝারি',
      'low': 'নিম্ন'
    };
    
    const formattedComplaints = complaints.map(c => ({
      ...c,
      priorityLabel: priorityMap[c.priority] || c.priority
    }));
    
    res.json(formattedComplaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FEATURE 12 & 13 Combined: Get dashboard stats with assignment info
exports.getComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          urgent: { $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          processing: { $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ priorityScore: -1, createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update complaint status (for admin/department)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        remarks, 
        lastUpdated: new Date(),
        ...(status === 'resolved' && { resolvedAt: new Date() })
      },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Assign personnel to complaint
exports.assignPersonnel = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: assignedTo,
        lastUpdated: new Date()
      },
      { new: true }
    );
    
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    
    res.json({
      success: true,
      message: "কর্মী বরাদ্দ করা হয়েছে",
      data: complaint
    });
  } catch (err) {
    console.error('Error assigning personnel:', err);
    res.status(500).json({ error: err.message });
  }
};

// Unassign personnel from complaint
exports.unassignPersonnel = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: null,
        lastUpdated: new Date()
      },
      { new: true }
    );
    
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    
    res.json({
      success: true,
      message: "বরাদ্দ বাতিল করা হয়েছে",
      data: complaint
    });
  } catch (err) {
    console.error('Error unassigning personnel:', err);
    res.status(500).json({ error: err.message });
  }
};


// Get complaints by user ID
exports.getComplaintsByUser = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};