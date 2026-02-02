import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import MyBookings from './pages/MyBookings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMovies from './pages/admin/ManageMovies';
import ManageTheaters from './pages/admin/ManageTheaters';
import ManageShowtimes from './pages/admin/ManageShowtimes';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';

import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/movie/:id" element={<MovieDetails />} />
                            <Route path="/movies" element={<Home />} />
                            <Route path="/booking/:showtimeId" element={<BookingPage />} />
                            <Route path="/payment/:bookingId" element={<PaymentPage />} />
                            <Route path="/my-bookings" element={<MyBookings />} />
                            
                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/movies" element={<ManageMovies />} />
                            <Route path="/admin/theaters" element={<ManageTheaters />} />
                            <Route path="/admin/showtimes" element={<ManageShowtimes />} />
                            <Route path="/admin/bookings" element={<ManageBookings />} />
                            <Route path="/admin/users" element={<ManageUsers />} />
                        </Routes>
                    </main>
                    <Chatbot />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        theme="dark"
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
