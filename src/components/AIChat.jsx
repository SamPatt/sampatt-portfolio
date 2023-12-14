import { useState } from 'react';
import '../App.css';

const AIChat = () => {
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);

    const handleSubmit = () => {
        const userMessage = { role: 'user', content: userInput };
        setConversation(prev => [...prev, userMessage]);

        const eventSource = new EventSource(`http://localhost:4000/api/stream-response?message=${encodeURIComponent(userInput)}`);

        eventSource.onmessage = (event) => {
            const chunk = JSON.parse(event.data);
        
            if (chunk.choices && chunk.choices.length > 0 && chunk.choices[0].delta) {
                const contentChunk = chunk.choices[0].delta.content || ''; // Fallback to empty string if undefined
        
                setConversation(prevConversation => {
                    const newConversation = [...prevConversation];
                    const lastMessageIndex = newConversation.length - 1;
        
                    // If the last message is from the assistant, append content to it
                    if (lastMessageIndex >= 0 && newConversation[lastMessageIndex].role === 'assistant') {
                        newConversation[lastMessageIndex].content += contentChunk;
                    } else {
                        // If the last message is not from the assistant, add a new assistant message
                        newConversation.push({ role: 'assistant', content: contentChunk });
                    }
        
                    return newConversation;
                });
            }
        };
        

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        setUserInput('');
    };

    return (
        <div className='AISection'>
            <h2>
                Ask my AI
            </h2>
            <p>This AI will respond to your questions about my portfolio, which technologies I use, my favorite language, etc. Ask whatever you want!</p>
            <div>
                {conversation.map((msg, index) => (
                    
                    <p key={index} className={msg.role === 'user' ? 'user-message' : 'assistant-message'}>
                        {msg.content}
                    </p>
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
