const express = require('express');
const router = express.Router();
const { getLegalAnswer } = require('../services/legalRagService');

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Legal Chatbot API' });
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Message is required',
        success: false 
      });
    }
    
    const answer = await getLegalAnswer(message.trim());
    
    res.json({
      success: true,
      reply: answer,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: 'Unable to process your request. Please try again later.',
      success: false
    });
  }
});

router.get('/suggestions', (req, res) => {
  const suggestions = [
    "মৌলিক অধিকারগুলো কী কী?",
    "What are my fundamental rights?",
    "আমি কিভাবে পুলিশে অভিযোগ করব?",
    "Someone captured my land, what should I do?",
    "গ্রেপ্তারের সময় আমার কী কী অধিকার?",
    "What are my rights during arrest?",
    "যৌতুক নিষিদ্ধ করার আইন কী বলে?",
    "ডিজিটাল নিরাপত্তা আইন কী?",
    "শ্রমিক হিসেবে আমার অধিকারগুলো কী?"
  ];
  res.json({ suggestions });
});

module.exports = router;