/**
 * Pharmacist Messaging Page Wrapper
 * Manages messaging state and renders PharmacistMessaging component
 */

import React, { useState } from 'react';
import PharmacistMessaging from '../components/PharmacistMessaging';
import { PharmacistMessage } from '../types';

export default function PharmacistMessagingPage() {
    // Simple local state for now, could be moved to a context later
    const [messages, setMessages] = useState<PharmacistMessage[]>([
        { id: '1', sender: 'pharmacist', text: 'Hello! I am a licensed pharmacist. How can I help you today?', timestamp: new Date() }
    ]);

    const handleSendMessage = (text: string) => {
        const newMessage: PharmacistMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);

        // Simulate pharmacist response
        setTimeout(() => {
            const response: PharmacistMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'pharmacist',
                text: "Thank you for your message. I'm reviewing your inquiry and will get back to you shortly.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, response]);
        }, 1000);
    };

    return (
        <PharmacistMessaging
            messages={messages}
            onSendMessage={handleSendMessage}
        />
    );
}
