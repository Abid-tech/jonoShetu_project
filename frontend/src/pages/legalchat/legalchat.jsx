import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './legalchat.css';

const API_URL = 'http://localhost:5000/api/chatbot';

function LegalChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'আসসালামু আলাইকুম! আমি জনসেতু লিগ্যাল সহকারী। 🇧🇩\n\nআমি বাংলাদেশের সংবিধান ও আইন সম্পর্কিত যেকোনো প্রশ্নের উত্তর দিতে পারি। আপনি বাংলা বা ইংরেজি উভয় ভাষায় প্রশ্ন করতে পারেন।\n\nআমাকে জিজ্ঞাসা করুন: মৌলিক অধিকার, ফৌজদারি আইন, নারী ও শিশু অধিকার, শ্রম আইন, সাইবার আইন, ভোক্তা অধিকার ইত্যাদি।'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Fetch suggestions on mount
  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/suggestions`);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await axios.post(`${API_URL}/chat`, { message });
      
      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.reply
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'দুঃখিত, আপনার প্রশ্নের উত্তর দিতে সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।\n\nSorry, I\'m having trouble processing your request. Please try again in a moment.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    textareaRef.current?.focus();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const formatBotMessage = (content) => {
    // Convert markdown-like syntax to HTML
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
      .replace(/• (.*?)(<br\/>|$)/g, '<li>$1</li>')
      .replace(/<li>.*?<\/li>/g, (match) => `<ul>${match}</ul>`);
    
    return { __html: formatted };
  };

  return (
    <div className="legal-chat-wrapper">
      <div className="legal-chat-container">
        
        {/* Header */}
        <div className="chat-header">
          <h1>
            <i>⚖️</i> জনসেতু লিগ্যাল সহকারী
          </h1>
          <p>
            বাংলাদেশের সংবিধান ও আইন সম্পর্কে জেনে নিন | Get answers about Bangladesh Constitution and Laws
          </p>
        </div>

        {/* Main Chat Layout */}
        <div className="chat-main-layout">
          
          {/* Sidebar - Suggested Questions */}
          <div className="suggestions-sidebar">
            <h3>
              <i>💡</i> সাধারণ জিজ্ঞাসা
            </h3>
            <div className="suggestions-list">
              {suggestions.slice(0, 8).map((suggestion, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: '0.7rem', color: '#aac4b8', textAlign: 'center' }}>
              <i>🔍</i> প্রশ্নে ক্লিক করলেই টাইপ হবে
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            
            {/* Messages */}
            <div className="messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.type}`}>
                  <div className="message-content">
                    {msg.type === 'bot' ? (
                      <div dangerouslySetInnerHTML={formatBotMessage(msg.content)} />
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="message bot">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
              <div className="input-wrapper">
                <textarea
                  ref={textareaRef}
                  className="chat-input"
                  placeholder="আপনার প্রশ্ন লিখুন... (e.g., মৌলিক অধিকার কী?)"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                >
                  <i>📤</i> পাঠান
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="chat-info">
          <i>⚖️</i> এই তথ্য AI জেনারেটেড এবং শুধুমাত্র তথ্যের উদ্দেশ্যে। আইনি পরামর্শের জন্য পেশাদার আইনজীবীর সাথে পরামর্শ করুন।
          <br />
          <i>🔒</i> No conversation history is stored | কোনো তথ্য সংরক্ষণ করা হয় না
        </div>
      </div>
    </div>
  );
}

export default LegalChat;