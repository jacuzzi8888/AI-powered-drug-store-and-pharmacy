import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getAiResponse } from '../services/geminiService';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from './icons/Icons';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const initializeChat = useCallback(async () => {
     setIsLoading(true);
      const initialPrompt = "Introduce yourself as specified in the system instructions.";
      const aiMessage: ChatMessage = { id: `ai-${Date.now()}`, sender: 'ai', text: '' };
      setMessages([aiMessage]);

      await getAiResponse(initialPrompt, true, (chunk) => {
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          const updatedMsg = { ...lastMsg, text: lastMsg.text + chunk };
          return [...prev.slice(0, -1), updatedMsg];
        });
      });
      setIsLoading(false);
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
        initializeChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
    };
    
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: '',
    };
    
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      await getAiResponse(currentInput, messages.length === 1, (chunk) => {
        setMessages(prev => {
            // Ensure we are updating the correct message
            const targetMessage = prev.find(m => m.id === aiMessage.id);
            if (targetMessage) {
                 return prev.map(m => m.id === aiMessage.id ? {...m, text: m.text + chunk } : m);
            }
            return prev;
        });
      });
    } catch (error) {
       setMessages(prev => {
            return prev.map(m => m.id === aiMessage.id ? {...m, text: "I'm sorry, but I'm having trouble connecting right now. Please try again later." } : m);
       });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 md:p-8">
       <header className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="mt-1 text-sm md:text-base text-gray-600">Get general information about medications and services.</p>
        </header>

      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'ai' && (
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <SparklesIcon className="h-6 w-6" />
                </div>
              )}
              <div className={`max-w-md p-4 rounded-2xl ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                 <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {message.text}
                    {isLoading && message.sender === 'ai' && messages[messages.length-1].id === message.id && <span className="inline-block w-2 h-4 bg-gray-800 ml-1 animate-pulse"></span>}
                 </p>
              </div>
               {message.sender === 'user' && (
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  <UserCircleIcon className="h-8 w-8" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length-1]?.sender === 'user' && (
            <div className="flex items-start gap-4 justify-start">
               <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <SparklesIcon className="h-6 w-6" />
                </div>
              <div className="max-w-md p-4 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none flex items-center space-x-2">
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
           <p className="text-xs text-center text-gray-500 mt-2">
            AI can make mistakes. For medical advice, please consult a pharmacist.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;