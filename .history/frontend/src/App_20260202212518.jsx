import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import MyBookings from './pages/MyBookings';
import TicketPage from './pages/TicketPage';

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
                            <Route path="/movies" element={<Movies />} />

                            {/* Protected User Routes */}
                            <Route path="/booking/:showtimeId" element={
                                <ProtectedRoute>
                                    <BookingPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/payment/:bookingId" element={
                                <ProtectedRoute>
                                    <PaymentPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/my-bookings" element={
                                <ProtectedRoute>
                                    <MyBookings />
                                </ProtectedRoute>
                            } />

                            {/* Admin Routes */}
                            <Route path="/admin" element={
                                <ProtectedRoute adminOnly={true}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/movies" element={
                                <ProtectedRoute adminOnly={true}>
                                    <ManageMovies />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/theaters" element={
                                <ProtectedRoute adminOnly={true}>
                                    <ManageTheaters />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/showtimes" element={
                                <ProtectedRoute adminOnly={true}>
                                    <ManageShowtimes />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/bookings" element={
                                <ProtectedRoute adminOnly={true}>
                                    <ManageBookings />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/users" element={
                                <ProtectedRoute adminOnly={true}>
                                    <ManageUsers />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                    <Footer />
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
