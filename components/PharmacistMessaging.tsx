
import React, { useState, useRef, useEffect } from 'react';
import { PharmacistMessage } from '../types';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from './icons/Icons';

interface PharmacistMessagingProps {
    messages: PharmacistMessage[];
    onSendMessage: (text: string) => void;
}

const PharmacistMessaging: React.FC<PharmacistMessagingProps> = ({ messages, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-background-cream p-4 md:p-8">
            <header className="mb-6">
                <h1 className="text-4xl font-bold font-lora text-text-dark">Pharmacist Chat</h1>
                <p className="mt-2 text-lg text-text-medium">Securely message with a licensed pharmacist.</p>
            </header>

            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-amber-50 border-b border-amber-200 text-center text-sm text-amber-800">
                    <strong>Disclaimer:</strong> This chat is for non-emergency questions only. For urgent medical issues, please contact emergency services.
                </div>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {message.sender === 'pharmacist' && (
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-teal flex items-center justify-center text-white"><SparklesIcon className="h-6 w-6" /></div>
                            )}
                            <div className={`max-w-md p-4 rounded-2xl ${message.sender === 'user' ? 'bg-primary-teal text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm leading-6" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                                <p className="text-xs opacity-70 mt-1 text-right">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            {message.sender === 'user' && (
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"><UserCircleIcon className="h-8 w-8" /></div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="relative">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="w-full pl-5 pr-14 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-teal text-base"/>
                        <button type="submit" disabled={!input.trim()} className="absolute inset-y-1.5 right-1.5 flex items-center justify-center w-11 h-11 text-white bg-primary-teal rounded-full hover:bg-opacity-90 disabled:bg-gray-300 transition-colors"><PaperAirplaneIcon className="h-5 w-5" /></button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PharmacistMessaging;
