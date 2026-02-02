import { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I\'m MovieBot 🎬 How can I help you with movie ticket booking today?' }
    ]);
    const [inputText, setInputText] = useState('');

    // Quick suggestion buttons
    const quickSuggestions = [
        'How to book tickets?',
        'Show my bookings',
        'Seat selection help',
        'Payment info'
    ];

    // Comprehensive chatbot responses based on actual app features
    const getBotResponse = (userMessage) => {
        const msg = userMessage.toLowerCase();
        
        // ==========================================
        // GREETINGS
        // ==========================================
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('hii')) {
            return 'Hello! 👋 Welcome to MovieBook. I can help you with:\n\n🎬 Movie & Show Info\n💺 Seat Booking\n💳 Payment Help\n👤 Account Help\n\nWhat would you like to know?';
        }
        
        // ==========================================
        // 🎬 MOVIE & SHOW INFORMATION
        // ==========================================
        
        // What movies are running / available
        if (msg.includes('what movie') || msg.includes('which movie') || msg.includes('movies running') || msg.includes('movies available') || msg.includes('movies today') || msg.includes('now showing')) {
            return '🎬 To see all movies currently showing:\n\n1. Click on "Movies" in the navigation bar\n2. Browse all available movies\n3. Use filters to sort by language or genre\n\nYou can also see featured movies on the Home page!';
        }
        
        // Show timings
        if (msg.includes('show timing') || msg.includes('showtime') || msg.includes('timing') || msg.includes('what time') || msg.includes('when is the show')) {
            return '🕐 To check show timings:\n\n1. Go to the movie you want to watch\n2. Click on the movie card\n3. You\'ll see all available showtimes with theater names\n4. Each showtime shows the time, theater, and price\n\nSelect any showtime to proceed with booking!';
        }
        
        // Theaters / Theatres available
        if (msg.includes('theatre') || msg.includes('theater') || msg.includes('which cinema') || msg.includes('near me') || msg.includes('location')) {
            return '🏛️ To see available theaters:\n\n1. Select any movie from the Movies page\n2. Click on it to see movie details\n3. All theaters showing this movie will be listed\n4. Each theater shows its name, location, and available showtimes\n\nChoose your preferred theater and time!';
        }
        
        // Movie duration / How long
        if (msg.includes('how long') || msg.includes('duration') || msg.includes('runtime') || msg.includes('movie length')) {
            return '⏱️ Movie duration is shown on:\n\n• The movie card (in minutes)\n• The movie details page\n\nDuration is displayed as "XXX min" next to the movie info. Plan your schedule accordingly!';
        }
        
        // Movie details / info
        if (msg.includes('movie detail') || msg.includes('movie info') || msg.includes('about movie') || msg.includes('description')) {
            return '📋 To see movie details:\n\n1. Click on any movie card\n2. You\'ll see:\n   • Movie poster & title\n   • Genre & language\n   • Duration & release date\n   • Rating & description\n   • All available showtimes';
        }
        
        // ==========================================
        // 💺 SEAT & BOOKING
        // ==========================================
        
        // How to book / booking process
        if (msg.includes('how to book') || msg.includes('book ticket') || msg.includes('booking process') || msg.includes('guide me') || msg.includes('step by step')) {
            return '🎟️ How to Book Tickets:\n\n1️⃣ Browse movies on Home or Movies page\n2️⃣ Click a movie to see details\n3️⃣ Select a showtime & theater\n4️⃣ Choose your seats on the seat map\n5️⃣ Review your selection\n6️⃣ Click "Proceed to Pay"\n7️⃣ Complete payment\n8️⃣ Get your ticket! 🎉\n\nYour ticket will be saved in "My Bookings"';
        }
        
        // Seats available
        if (msg.includes('seat available') || msg.includes('seats available') || msg.includes('seats left') || msg.includes('how many seat')) {
            return '💺 To check seat availability:\n\n1. Select a movie and showtime\n2. The seat map will show:\n   • 🟢 Green = Available\n   • 🔴 Red = Already booked\n   • 🟡 Yellow = Your selection\n\nAvailable seat count is shown above the seat map!';
        }
        
        // Best seats
        if (msg.includes('best seat') || msg.includes('which seat') || msg.includes('good seat') || msg.includes('recommend seat')) {
            return '⭐ Best Seat Tips:\n\n• Middle rows (E-H) offer the best view\n• Center seats are ideal for sound\n• Premium seats are in prime locations\n• Avoid front rows for comfort\n\nPremium seats cost more but offer better viewing experience!';
        }
        
        // Seat selection help
        if (msg.includes('select seat') || msg.includes('choose seat') || msg.includes('seat selection') || msg.includes('pick seat')) {
            return '🪑 Seat Selection Guide:\n\n1. Green seats = Available (click to select)\n2. Click multiple seats for group booking\n3. Selected seats turn yellow\n4. Click again to deselect\n5. Price updates automatically\n\nYou can select up to 10 seats per booking!';
        }
        
        // Multiple seats / book together
        if (msg.includes('multiple seat') || msg.includes('book together') || msg.includes('group booking') || msg.includes('family booking')) {
            return '👨‍👩‍👧‍👦 Booking Multiple Seats:\n\n1. On the seat map, click each seat you want\n2. All selected seats will turn yellow\n3. You can select seats that are together\n4. Total price updates as you select\n5. All seats will be booked under your account\n\nMaximum 10 seats per booking!';
        }
        
        // Seat not available / why
        if (msg.includes('seat not available') || msg.includes('why is seat') || msg.includes('seat taken') || msg.includes('cannot select')) {
            return '🔴 If a seat is unavailable (red):\n\n• It\'s already booked by someone else\n• It might be temporarily locked by another user\n\nLocked seats are released after 10 minutes if not purchased. Try refreshing or selecting different seats!';
        }
        
        // Same seat / double booking
        if (msg.includes('same seat') || msg.includes('double book') || msg.includes('two people book')) {
            return '🔒 No, two people cannot book the same seat!\n\nOur system locks seats when selected and prevents double booking. If someone else has already booked or locked a seat, it will show as unavailable (red) for you.';
        }
        
        // ==========================================
        // 💳 PAYMENT & PRICING
        // ==========================================
        
        // Ticket price
        if (msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('ticket rate') || msg.includes('fare')) {
            return '💰 Ticket Pricing:\n\n• Prices vary by movie, theater, and seat type\n• Regular seats: Standard pricing\n• Premium seats: Higher pricing\n\nThe exact price is shown:\n• On each showtime button\n• During seat selection\n• In the booking summary\n\nTotal updates as you select seats!';
        }
        
        // Discounts
        if (msg.includes('discount') || msg.includes('offer') || msg.includes('coupon') || msg.includes('promo')) {
            return '🏷️ Currently, our platform shows direct ticket prices from theaters. Special discounts or offers will be displayed on the payment page when available.\n\nCheck the payment page for any active promotions!';
        }
        
        // Payment methods
        if (msg.includes('payment method') || msg.includes('how to pay') || msg.includes('card') || msg.includes('upi') || msg.includes('payment option')) {
            return '💳 Payment Information:\n\nOn the payment page, enter your card details:\n• Card number\n• Expiry date\n• CVV\n\nYour payment is processed securely. After successful payment, your ticket is confirmed instantly!';
        }
        
        // Payment failed
        if (msg.includes('payment fail') || msg.includes('payment error') || msg.includes('transaction fail') || msg.includes('not working')) {
            return '⚠️ If payment fails:\n\n1. Check your card details are correct\n2. Ensure sufficient balance\n3. Check your internet connection\n4. Try again after a few minutes\n\nYour seats remain locked for 10 minutes, so you can retry. No amount is deducted on failed payments.';
        }
        
        // Payment successful
        if (msg.includes('payment success') || msg.includes('payment done') || msg.includes('paid successfully')) {
            return '✅ After successful payment:\n\n1. You\'ll see a confirmation message\n2. Booking details are displayed\n3. Ticket is saved to "My Bookings"\n4. You can view/download your ticket anytime\n\nShow your ticket at the theater entrance!';
        }
        
        // ==========================================
        // 🔁 BOOKING MANAGEMENT
        // ==========================================
        
        // View bookings / my tickets
        if (msg.includes('my booking') || msg.includes('my ticket') || msg.includes('view ticket') || msg.includes('see ticket') || msg.includes('booking history') || msg.includes('where') && msg.includes('ticket')) {
            return '🎟️ To view your bookings:\n\n1. Click "My Bookings" in the navigation\n2. See all your past and upcoming bookings\n3. Each ticket shows:\n   • Movie name & poster\n   • Theater & showtime\n   • Seat numbers\n   • Booking status\n\nClick any booking to see full details!';
        }
        
        // Cancel booking
        if (msg.includes('cancel') && (msg.includes('booking') || msg.includes('ticket'))) {
            return '❌ To cancel a booking:\n\n1. Go to "My Bookings"\n2. Find the booking you want to cancel\n3. Click the "Cancel Booking" button\n4. Confirm cancellation\n\n⚠️ Note: Cancellation may be subject to timing restrictions. Cancelled bookings will be marked accordingly.';
        }
        
        // Seat lock / how long
        if (msg.includes('seat lock') || msg.includes('how long') && msg.includes('lock') || msg.includes('reserved for')) {
            return '⏳ Seat Lock Duration:\n\nWhen you select seats, they are temporarily locked for 10 minutes. This gives you time to complete payment.\n\nIf payment isn\'t completed within 10 minutes, seats are automatically released for others to book.';
        }
        
        // ==========================================
        // 👤 ACCOUNT & LOGIN
        // ==========================================
        
        // Create account / register
        if (msg.includes('create account') || msg.includes('register') || msg.includes('sign up') || msg.includes('new account')) {
            return '📝 To create an account:\n\n1. Click "Register" in the navigation bar\n2. Enter your details:\n   • Name\n   • Email\n   • Phone number\n   • Password\n3. Click "Register"\n4. You\'re ready to book! 🎉';
        }
        
        // Login
        if (msg.includes('login') || msg.includes('sign in') || msg.includes('log in')) {
            return '🔐 To login:\n\n1. Click "Login" in the navigation bar\n2. Enter your email and password\n3. Click "Login"\n\nOnce logged in, you can book tickets and view your booking history!';
        }
        
        // Without login / guest
        if (msg.includes('without login') || msg.includes('without account') || msg.includes('guest')) {
            return '🔒 You need to be logged in to book tickets.\n\nThis helps us:\n• Save your booking history\n• Send you ticket confirmations\n• Manage your bookings\n\nCreating an account takes less than a minute!';
        }
        
        // ==========================================
        // 🤖 GENERAL HELP
        // ==========================================
        
        // Help
        if (msg.includes('help') || msg.includes('what can you do') || msg.includes('assist')) {
            return '🤖 I can help you with:\n\n🎬 Movies & Shows\n   • What movies are showing\n   • Show timings & theaters\n   • Movie details\n\n💺 Booking\n   • How to book tickets\n   • Seat selection\n   • View your tickets\n\n💳 Payment\n   • Pricing info\n   • Payment help\n\n👤 Account\n   • Login & registration\n\nJust ask me anything!';
        }
        
        // Features of site
        if (msg.includes('feature') || msg.includes('what can i do') || msg.includes('functionality')) {
            return '✨ Our Website Features:\n\n🎬 Browse Movies\n• View all current movies\n• Filter by language/genre\n• See ratings & details\n\n🎟️ Easy Booking\n• Select showtimes\n• Interactive seat map\n• Secure payment\n\n📱 My Bookings\n• View all tickets\n• Ticket details\n• Cancel bookings\n\n👤 User Account\n• Register/Login\n• Booking history';
        }
        
        // Thank you
        if (msg.includes('thank') || msg.includes('thanks')) {
            return 'You\'re welcome! 😊 Enjoy your movie! 🍿🎬\n\nIf you have any more questions, feel free to ask!';
        }
        
        // Bye
        if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) {
            return 'Goodbye! 👋 Have a great time at the movies! 🎬🍿\n\nCome back anytime you need help!';
        }
        
        // ==========================================
        // DEFAULT RESPONSE
        // ==========================================
        return 'I\'m not sure I understand that. 🤔\n\nI can help you with:\n• Booking movie tickets\n• Checking showtimes\n• Seat selection\n• Payment queries\n• Your bookings\n\nTry asking something like "How to book tickets?" or type "help" for more options!';
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

    const handleQuickSuggestion = (suggestion) => {
        setInputText(suggestion);
        // Auto send
        const userMsg = { type: 'user', text: suggestion };
        setMessages(prev => [...prev, userMsg]);
        
        setTimeout(() => {
            const botResponse = getBotResponse(suggestion);
            setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
        }, 500);
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
                        <div className="chat-header-info">
                            <span>MovieBot</span>
                            <small>Always here to help</small>
                        </div>
                    </div>
                    
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Quick Suggestions */}
                    {messages.length <= 2 && (
                        <div className="quick-suggestions">
                            {quickSuggestions.map((suggestion, index) => (
                                <button 
                                    key={index}
                                    onClick={() => handleQuickSuggestion(suggestion)}
                                    className="suggestion-btn"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                    
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
