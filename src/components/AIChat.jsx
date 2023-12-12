import React, { useState } from 'react';
import axios from 'axios';

const AIChat = () => {
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);

    const handleSubmit = async () => {
        const userMessage = { role: 'user', content: userInput };
        const newConversation = [...conversation, userMessage];
        
        try {
            const response = await axios.post('http://localhost:4000/api/query', { messages: newConversation }); //TODO, change in production
            const aiMessage = { role: 'assistant', content: response.data };
            setConversation([...newConversation, aiMessage]);
        } catch (error) {
            console.error('Error in AI response:', error);
        }

        setUserInput('');
    };

    return (
        <div>
            <div>
                {conversation.map((msg, index) => (
                    <p key={index}><b>{msg.role}:</b> {msg.content}</p>
                ))}
            </div>
            <input 
                type="text" 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    );
};

export default AIChat;
