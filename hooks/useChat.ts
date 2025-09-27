import { useState } from 'react';
import { ChatMessage } from '@/types';

const mockResponses = [
  "Based on your spending patterns, I predict you'll save $200 more this month if you reduce dining out by 20%. Would you like me to create a personalized plan?",
  "I notice you're spending 15% more on groceries than last month. Here are some money-saving tips: buy generic brands, use coupons, and plan meals ahead.",
  "Great news! You're on track to reach your emergency fund goal 2 weeks early. Consider increasing your target or starting a new goal.",
  "Your subscription spending is $45/month. I found 3 unused services: Netflix duplicate, unused gym membership, and old software license. Cancel them to save $540/year.",
  "Your coffee expenses are $120/month. Making coffee at home 3 days a week could save you $1,440 annually. Would you like me to set a reminder?",
  "I see irregular income patterns. Consider setting up automatic transfers on your highest earning days to maximize savings.",
  "Your utility bills increased 25% this month. This might be due to seasonal changes. I can help you find energy-saving tips.",
  "You've been consistently under budget for transportation. Consider reallocating $50 to your vacation fund to reach your goal faster."
];

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your AI financial assistant. I can help you with budget planning, spending analysis, and financial predictions. How can I help you today?",
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: "Hello! I'm your AI financial assistant. I can help you with budget planning, spending analysis, and financial predictions. How can I help you today?",
      isUser: false,
      timestamp: new Date().toISOString()
    }]);
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat
  };
};