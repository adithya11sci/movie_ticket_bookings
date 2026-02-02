import { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! Im MovieBot 🎬 How can I help you with movie ticket booking today?' }
    ]);
    const [inputText, setInputText] = useState('');

    // simple chatbot responses - rule based
    const getBotResponse = (userMessage) => {
        const msg = userMessage.toLowerCase();
        
        // greetings
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            return 'Hello! Welcome to MovieBook. How can I assist you today?';
        }
        
        // booking related
        if (msg.includes('book') || msg.includes('ticket')) {
            return 'To book tickets: \n1. Browse movies on the home page\n2. Click on a movie to see showtimes\n3. Select your preferred showtime\n4. Choose your seats\n5. Proceed to payment\n\nWould you like to know anything else?';
        }
        
        // cancel booking
        if (msg.includes('cancel')) {
            return 'To cancel a booking:\n1. Go to "My Bookings" in the navigation\n2. Find the booking you want to cancel\n3. Click the "Cancel" button\n\nNote: Cancellations may be subject to our refund policy.';
        }
        
        // payment
        if (msg.includes('payment') || msg.includes('pay')) {
            return 'We accept various payment methods including credit/debit cards. Your payment is secure and encrypted. If payment fails, please try again or contact support.';
        }
        
        // seats
        if (msg.includes('seat')) {
            return 'You can select your preferred seats during the booking process. Green seats are available, red ones are already booked. Click on the seats you want and they will be highlighted.';
        }
        
        // refund
        if (msg.includes('refund')) {
            return 'Refunds are processed within 5-7 business days after cancellation. The amount will be credited to your original payment method.';
        }
        
        // showtimes
        if (msg.includes('showtime') || msg.includes('timing') || msg.includes('time')) {
            return 'Showtimes vary by movie and theater. Select a movie from our homepage to view all available showtimes and theaters.';
        }
        
        // account
        if (msg.includes('account') || msg.includes('register') || msg.includes('signup') || msg.includes('login')) {
            return 'You can create an account by clicking "Sign Up" in the navigation bar. If you already have an account, click "Login" to access your profile and bookings.';
        }
        
        // price
        if (msg.includes('price') || msg.includes('cost') || msg.includes('charge')) {
            return 'Ticket prices vary by movie, theater, and seat type. Regular seats and premium seats have different pricing. You can see the exact price when selecting showtimes.';
        }
        
        // help
        if (msg.includes('help')) {
            return 'I can help you with:\n• Booking tickets\n• Cancellation process\n• Payment queries\n• Seat selection\n• Account related issues\n\nJust ask me anything!';
        }
        
        // thank you
        if (msg.includes('thank') || msg.includes('thanks')) {
            return 'You\'re welcome! Enjoy your movie! 🍿🎬';
        }
        
        // bye
        if (msg.includes('bye') || msg.includes('goodbye')) {
            return 'Goodbye! Have a great day and enjoy your movies! 🎬';
        }
        
        // default response
        return 'I\'m not sure about that. I can help you with booking tickets, cancellations, payments, and seat selection. Could you please rephrase your question or type "help" to see what I can assist with?';
    };

    const handleSend = () => {
        if (!inputText.trim()) return;
        
        // add user message
        const userMsg = { type: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        
        // get bot response after small delay
        setTimeout(() => {
            const botResponse = getBotResponse(inputText);
            setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
        }, 500);
        
        setInputText('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            {/* chat toggle button */}
            <button 
                className={`chat-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes /> : <FaRobot />}
            </button>

            {/* chat window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <FaRobot />
                        <span>MovieBot</span>
                    </div>
                    
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="chat-input">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                        />
                        <button onClick={handleSend}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
