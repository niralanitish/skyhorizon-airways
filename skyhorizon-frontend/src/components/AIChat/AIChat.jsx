import React, { useState, useEffect, useRef } from 'react';
import { MdClose, MdSend, MdOutlineAutoAwesome } from 'react-icons/md';
import { IoSparklesSharp, IoAirplaneOutline } from 'react-icons/io5';
import api from '../../services/api';
import './AIChat.css';

const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold parsing
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const lineContent = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-bold text-white/90">{part.slice(2, -2)}</strong>;
      }
      return <span key={j}>{part}</span>;
    });

    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <div key={i} className="flex gap-2 my-1">
          <span className="text-gold mt-1">•</span>
          <span>{lineContent}</span>
        </div>
      );
    }
    if (/^\d+\.\s/.test(trimmed)) {
      return (
        <div key={i} className="flex gap-2 my-1">
          <span className="text-gold">{trimmed.match(/^\d+/)[0]}.</span>
          <span>{lineContent}</span>
        </div>
      );
    }
    
    return <div key={i} className={i !== lines.length - 1 ? 'mb-2' : ''}>{lineContent}</div>;
  });
};

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await api.askAI(text);
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.response || "I didn't receive a proper response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {

    const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Sorry, I couldn't connect to the AI service. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    };

    setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-chat-container">
      {/* Floating Action Button - hidden when chat is open */}
      <button 
        className={`ai-chat-fab ${isOpen ? 'hidden-fab' : ''}`} 
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Chat"
      >
        <div className="ai-chat-fab-icon-wrapper">
          <IoAirplaneOutline className="ai-chat-fab-wing" />
          <IoSparklesSharp className="ai-chat-fab-sparkle" />
        </div>
      </button>

      {/* Chat Window */}
      <div className={`ai-chat-window ${isOpen ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-info">
            <div className="ai-chat-logo">
              <IoAirplaneOutline className="ai-chat-logo-icon" />
              <IoSparklesSharp className="ai-chat-logo-sparkle" />
            </div>
            <div className="ai-chat-title-group">
              <span className="ai-chat-title">SkyHorizon AI</span>
              <span className="ai-chat-subtitle">
                <span className="ai-chat-status-dot"></span>
                AI Travel Assistant
              </span>
            </div>
          </div>
          <div className="ai-chat-header-actions">
            <button className="ai-chat-action-btn" onClick={() => setIsOpen(false)}>
              <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="ai-chat-action-btn" onClick={() => setIsOpen(false)}>
              <MdClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="ai-chat-messages">
          
          {/* Welcome Card */}
          {messages.length === 0 && (
            <div className="ai-chat-welcome-card">
              <div className="ai-chat-welcome-icon">
                <MdOutlineAutoAwesome />
              </div>
              <h3>Welcome to SkyHorizon AI</h3>
              <p className="ai-chat-welcome-subtitle">Luxury travel assistance powered by AI.</p>
              
              <div className="ai-chat-capabilities">
                <div className="ai-chat-capability">
                  <span className="ai-chat-check">✓</span> Flight Policies
                </div>
                <div className="ai-chat-capability">
                  <span className="ai-chat-check">✓</span> Baggage Rules
                </div>
                <div className="ai-chat-capability">
                  <span className="ai-chat-check">✓</span> Refunds
                </div>
                <div className="ai-chat-capability">
                  <span className="ai-chat-check">✓</span> Airline Operations
                </div>
                <div className="ai-chat-capability">
                  <span className="ai-chat-check">✓</span> Travel Guidelines
                </div>
              </div>
            </div>
          )}

          {/* Messages Map */}
          {messages.map((msg) => (
            <div key={msg.id} className={`ai-chat-message-row ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="ai-chat-message-avatar">
                  <IoAirplaneOutline className="ai-chat-avatar-icon" />
                  <IoSparklesSharp className="ai-chat-avatar-sparkle" />
                </div>
              )}
              
              <div className={`ai-chat-message-bubble ${msg.sender}`}>
                <div className="ai-chat-message-content">
                  {msg.sender === 'bot' ? renderMarkdown(msg.text) : msg.text}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="ai-chat-message-row bot">
              <div className="ai-chat-message-avatar">
                <IoAirplaneOutline className="ai-chat-avatar-icon" />
                <IoSparklesSharp className="ai-chat-avatar-sparkle" />
              </div>
              <div className="ai-chat-message-bubble bot typing">
                <div className="ai-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="ai-chat-footer">
          <div className="ai-chat-input-wrapper">
            <textarea
              ref={inputRef}
              className="ai-chat-input"
              placeholder="Ask anything about your journey..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              onChange={(e) => {

    setInputValue(e.target.value);

    e.target.style.height = "auto";

    e.target.style.height = e.target.scrollHeight + "px";

}}
            />
            <button 
              className="ai-chat-send-btn" 
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
            >
              <MdSend />
            </button>
          </div>
          
          <div className="ai-chat-powered-by">
            <IoSparklesSharp className="w-3 h-3" />
            <span>Powered by SkyHorizon AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
