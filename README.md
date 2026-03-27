# 🎬 Movie Ticket Booking System

A professional **BookMyShow-style** movie ticket booking application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time seat locking, concurrent booking prevention, and AI-powered chatbot assistance.

![Movie Booking](https://img.shields.io/badge/MERN-Stack-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange) ![AI](https://img.shields.io/badge/AI-Powered-purple)

🌐 **Live Demo**: [https://movie-ticket-bookings-93ni.vercel.app](https://movie-ticket-bookings-mch1.vercel.app/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [AI Tools Used](#-ai-tools-used)
- [Setup Steps](#-setup-steps)
- [Deployment Steps](#-deployment-steps)
- [Concurrent Booking System](#-concurrent-booking-system)
- [Admin Panel & Real-time Updates](#-admin-panel--real-time-updates)
- [Refund & Cancellation System](#-refund--cancellation-system)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)

---

## ✨ Features

### 🎭 User Features
| Feature | Description |
|---------|-------------|
| **User Authentication** | Register, Login with JWT-based secure sessions |
| **Browse Movies** | View all movies with posters, ratings, genres |
| **Movie Details** | Hero banner, cast info, trailers, description |
| **Theater Selection** | Multiple theaters per movie with location info |
| **Showtime Selection** | Date picker with available time slots |
| **Seat Selection** | BookMyShow-style interactive seat map |
| **Secure Booking** | Atomic transactions prevent double-booking |
| **Payment Integration** | Simulated payment with UPI, Card, Net Banking |
| **Booking History** | View all past and upcoming bookings |
| **E-Tickets** | Downloadable booking confirmation with QR code |
| **AI Chatbot** | 24/7 assistance for booking help |

### 🔐 Admin Features
| Feature | Description |
|---------|-------------|
| **Dashboard** | Real-time stats, revenue, bookings overview |
| **Movie Management** | Add, edit, delete movies |
| **Theater Management** | Manage theaters, screens, capacity |
| **Showtime Management** | Create schedules, set pricing |
| **Booking Management** | View, filter, cancel bookings |
| **User Management** | View users, manage roles |
| **Seat Monitor** | Real-time seat availability tracking |
| **Refund Processing** | Cancel bookings with seat release |

### 🔒 Concurrent Booking Prevention
| Feature | Description |
|---------|-------------|
| **Atomic Transactions** | MongoDB sessions prevent race conditions |
| **Seat Locking** | 5-minute temporary lock during selection |
| **Real-time Detection** | Instant conflict notification |
| **Auto-cleanup** | Scheduler releases expired locks |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Library |
| Vite | 7.2.4 | Build Tool & Dev Server |
| React Router | 7.13.0 | Client-side Navigation |
| Axios | 1.13.4 | HTTP Client |
| React Toastify | 11.0.5 | Toast Notifications |
| React Icons | 5.5.0 | Icon Library |
| CSS3 | - | Custom Styling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime Environment |
| Express.js | 5.2.1 | Web Framework |
| MongoDB Atlas | - | Cloud Database |
| Mongoose | 9.1.5 | ODM for MongoDB |
| JWT | 9.0.3 | Authentication Tokens |
| bcryptjs | 3.0.3 | Password Hashing |
| dotenv | 17.2.3 | Environment Variables |
| CORS | 2.8.6 | Cross-Origin Resource Sharing |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| Vercel | Frontend & Backend Hosting |
| MongoDB Atlas | Cloud Database |
| Git/GitHub | Version Control |

---

## 🤖 AI Tools Used

This project was developed with the assistance of **GitHub Copilot** (Claude Opus 4.5 model) for:

| AI Usage | Description |
|----------|-------------|
| **Code Generation** | React components, Express routes, Mongoose schemas |
| **Architecture Design** | Concurrent booking prevention system design |
| **Bug Fixing** | Debugging null reference errors, race conditions |
| **Code Review** | Optimizing database queries, improving security |
| **Documentation** | README, API docs, inline comments |
| **CSS Styling** | BookMyShow-inspired UI design |
| **Chatbot Logic** | AI-powered customer support responses |

### AI Chatbot Integration
The application includes an AI-powered chatbot (`Chatbot.jsx`) that provides:
- Booking assistance and step-by-step guidance
- FAQ responses about movies, theaters, showtimes
- Payment and refund information
- Real-time support for user queries

---

## 🚀 Setup Steps

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (free tier available)
- **Git** for version control

### Step 1: Clone Repository
```bash
git clone https://github.com/adithya11sci/movie_ticket_bookings.git
cd movie_ticket_booking
```

### Step 2: Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
# Create a .env file with the following:
```

**.env file (backend):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/movie_booking
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

```bash
# Start backend server
npm start

# For development with auto-reload
npm run dev
```

### Step 3: Frontend Setup
```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file (optional for local development)
# Create .env file:
```

**.env file (frontend) - for local development:**
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev
```

### Step 4: Access Application
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |

### Step 5: Seed Sample Data (Optional)
```bash
cd backend
node seedData.js
```

### Default Admin Credentials
```
Email: admin@moviebook.com
Password: admin123
```

---

## 🌐 Deployment Steps

### Deploying to Vercel

#### Backend Deployment

1. **Create Vercel Account** at [vercel.com](https://vercel.com)

2. **Configure Backend for Vercel**
   
   The `vercel.json` is already configured:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "server.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "server.js" }
     ]
   }
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`

#### Frontend Deployment

1. **Update API URL**
   
   In `frontend/src/api/axios.js`:
   ```javascript
   baseURL: import.meta.env.VITE_API_URL || 'https://your-backend.vercel.app/api'
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Set Environment Variables**
   - Add: `VITE_API_URL=https://your-backend.vercel.app/api`

### Deployment Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Browser  │────▶│  Vercel (React) │────▶│ Vercel (Express)│
│                 │     │   Frontend      │     │    Backend      │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │  MongoDB Atlas  │
                                               │   (Database)    │
                                               └─────────────────┘
```

---

## 🔄 Concurrent Booking System

### How Multiple Users Booking Same Seat is Handled

The system uses a **3-layer protection mechanism** to prevent double booking:

### Layer 1: Seat Locking (Frontend)
When a user selects a seat:
```javascript
// POST /api/bookings/lock-seats
{
  showTimeId: "...",
  seatNumbers: ["K7", "K8"]
}
```
- Seats are locked for **5 minutes**
- Other users see these seats as "locked" (light gray)
- Lock includes user ID and expiry timestamp

### Layer 2: Atomic Transactions (Backend)
```javascript
// MongoDB Transaction for booking
const session = await mongoose.startSession();
session.startTransaction();

try {
    // 1. Verify seats are still available
    // 2. Create booking
    // 3. Update seat status to 'booked'
    // 4. Commit transaction
    await session.commitTransaction();
} catch (error) {
    // Rollback if any step fails
    await session.abortTransaction();
}
```

### Layer 3: Auto-cleanup Scheduler
```javascript
// Runs every 60 seconds
const cleanupExpiredLocks = async () => {
    // Find seats where lockExpiry < now
    // Remove lock, make seat available again
};
```

### Seat Status Flow
```
┌───────────────────────────────────────────────────────────────┐
│                      SEAT STATUS FLOW                         │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  AVAILABLE ──[User Selects]──▶ LOCKED ──[Payment]──▶ BOOKED  │
│      │                           │                      │     │
│      │                           │ (5 min timeout)      │     │
│      │                           ▼                      │     │
│      │◀─────────[Auto-release]───┘                      │     │
│      │                                                  │     │
│      │◀───────────[Cancel/Refund]───────────────────────┘     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Conflict Handling
If two users try to book the same seat simultaneously:
```javascript
// Response: 409 Conflict
{
  message: "Seat K7 is already booked",
  conflictSeat: "K7"
}
```
- UI automatically refreshes seat availability
- Removes conflicting seat from selection
- Shows toast notification to user

---

## 👨‍💼 Admin Panel & Real-time Updates

### How Admin Changes Reflect for Users

#### 1. Movie Management
| Admin Action | User Impact |
|--------------|-------------|
| Add Movie | Instantly visible in movie list |
| Edit Movie | Updated details show immediately |
| Delete Movie | Removed from listings, existing bookings preserved |

#### 2. Showtime Management
| Admin Action | User Impact |
|--------------|-------------|
| Add Showtime | New time slot appears for booking |
| Delete Showtime | Prevents new bookings, existing preserved |
| Modify Price | New bookings use updated price |

#### 3. Booking Management
| Admin Action | User Impact |
|--------------|-------------|
| Cancel Booking | Seats released instantly, user notified |
| View Bookings | No user impact (read-only) |

### Admin Dashboard Widgets
```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Total Users   │  Total Movies   │    Total Revenue       │
│      150+       │       15        │      ₹125,000          │
├─────────────────┴─────────────────┴─────────────────────────┤
│                   Recent Bookings                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ User       Movie          Seats    Amount   Status  │   │
│  │ John      Avengers        K7,K8    ₹560    Confirmed│   │
│  │ Sarah     Batman          H5       ₹280    Pending  │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                   Top Movies by Revenue                     │
│  1. Avengers: Secret Wars  - ₹45,000                       │
│  2. The Dark Knight        - ₹32,000                       │
│  3. Inception 2            - ₹28,000                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 💰 Refund & Cancellation System

### User Cancellation Flow
```
User Initiates Cancel ──▶ Verify Ownership ──▶ Update Booking Status
        │                                              │
        │                                              ▼
        │                                    Release Seats from ShowTime
        │                                              │
        │                                              ▼
        │                                    Update Available Seats Count
        │                                              │
        ▼                                              ▼
   Show Confirmation ◀────────────────────── Seats Now Bookable
```

### Admin Cancellation (with Refund)
```javascript
// PUT /api/admin/bookings/:id/cancel
const adminCancelBooking = async (req, res) => {
    // 1. Find booking
    // 2. Release seats back to showtime
    // 3. Update booking status to 'cancelled'
    // 4. Record cancellation timestamp and admin ID
    // 5. (Future: Trigger refund to payment gateway)
};
```

### Cancellation Rules
| Scenario | Action | Refund |
|----------|--------|--------|
| User cancels before show | Seats released | Full refund* |
| Admin cancels | Seats released | Full refund* |
| No-show | Seats remain booked | No refund |
| Show cancelled | All seats released | Full refund* |

*Refund processing depends on payment gateway integration

### Database Updates on Cancel
```javascript
// 1. Update Booking
booking.bookingStatus = 'cancelled';
booking.cancelledAt = new Date();

// 2. Release from ShowTime
showtime.bookedSeats = showtime.bookedSeats.filter(
    seat => !cancelledSeats.includes(seat)
);
showtime.availableSeats += cancelledSeats.length;

// 3. Remove from seatStatus array
showtime.seatStatus = showtime.seatStatus.filter(
    seat => !cancelledSeats.includes(seat.seatNumber)
);
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Movies
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/movies` | Get all movies | No |
| GET | `/api/movies/:id` | Get movie by ID | No |
| POST | `/api/movies` | Create movie | Admin |
| PUT | `/api/movies/:id` | Update movie | Admin |
| DELETE | `/api/movies/:id` | Delete movie | Admin |

### Showtimes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/showtimes` | Get all showtimes | No |
| GET | `/api/showtimes/:id` | Get showtime details | No |
| GET | `/api/showtimes/movie/:id` | Get showtimes for movie | No |
| POST | `/api/showtimes` | Create showtime | Admin |
| DELETE | `/api/showtimes/:id` | Delete showtime | Admin |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create booking | Yes |
| GET | `/api/bookings/my-bookings` | Get user's bookings | Yes |
| GET | `/api/bookings/:id` | Get booking details | Yes |
| PUT | `/api/bookings/:id/cancel` | Cancel booking | Yes |
| PUT | `/api/bookings/:id/payment` | Update payment | Yes |
| POST | `/api/bookings/lock-seats` | Lock seats | Yes |
| POST | `/api/bookings/release-seats` | Release seats | Yes |
| GET | `/api/bookings/showtime/:id/seat-status` | Get seat status | Yes |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/bookings` | Get all bookings | Admin |
| PUT | `/api/admin/bookings/:id/cancel` | Admin cancel booking | Admin |
| GET | `/api/admin/showtimes/availability` | Seat availability | Admin |

---

## 📁 Project Structure

```
movie_ticket_booking/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin operations
│   │   ├── authController.js     # Authentication
│   │   ├── bookingController.js  # Booking with atomic ops
│   │   ├── movieController.js    # Movie CRUD
│   │   ├── showTimeController.js # Showtime management
│   │   └── theaterController.js  # Theater CRUD
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT & role verification
│   ├── models/
│   │   ├── Booking.js            # Booking schema
│   │   ├── Movie.js              # Movie schema
│   │   ├── ShowTime.js           # Showtime with seat locking
│   │   ├── Theater.js            # Theater schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── adminRoutes.js        # Admin endpoints
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── bookingRoutes.js      # Booking endpoints
│   │   ├── movieRoutes.js        # Movie endpoints
│   │   ├── showTimeRoutes.js     # Showtime endpoints
│   │   └── theaterRoutes.js      # Theater endpoints
│   ├── utils/
│   │   ├── generateToken.js      # JWT token generation
│   │   └── seatCleanup.js        # Lock cleanup scheduler
│   ├── server.js                 # Entry point
│   ├── seedData.js               # Sample data seeder
│   ├── vercel.json               # Vercel configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # API client configuration
│   │   ├── components/
│   │   │   ├── Chatbot.jsx       # AI chatbot component
│   │   │   ├── Footer.jsx        # Footer component
│   │   │   ├── MovieCard.jsx     # Movie card component
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── ProtectedRoute.jsx# Auth route wrapper
│   │   │   └── SeatSelector.jsx  # BookMyShow seat grid
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication state
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Homepage
│   │   │   ├── Movies.jsx        # Movie listing
│   │   │   ├── MovieDetails.jsx  # Movie details page
│   │   │   ├── BookingPage.jsx   # Seat selection page
│   │   │   ├── PaymentPage.jsx   # Payment processing
│   │   │   ├── TicketPage.jsx    # E-ticket display
│   │   │   ├── MyBookings.jsx    # User bookings
│   │   │   └── admin/            # Admin pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── ARCHITECTURE.md               # Architecture diagrams
└── README.md                     # This file
```

---

## 🎫 Seat Layout

```
                    ╔════════════════════════════════════╗
                    ║           S C R E E N              ║
                    ╚════════════════════════════════════╝

    ┌─────────────────────────────────────────────────────────────┐
    │  Rs. 480 RECLINER (VIP)                                     │
    │  N:  [1][2][3]     [4][5][6][7][8][9]     [10][11][12]      │
    │  M:  [1][2][3]     [4][5][6][7][8][9]     [10][11][12]      │
    └─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │  Rs. 280 PRIME (Premium)                                    │
    │  L-G: [1][2][3][4]   [5][6][7][8][9][10][11][12]   [13]..[16]
    └─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │  Rs. 180 CLASSIC (Regular)                                  │
    │  F-A: [1][2][3][4][5] [6][7][8][9][10][11][12][13] [14]..[18]
    └─────────────────────────────────────────────────────────────┘
```

### Seat Colors
| Color | Status |
|-------|--------|
| 🟢 Green Border | Available |
| 🟢 Green Filled | Selected by you |
| ⚪ Gray | Sold/Booked |
| 🟠 Orange | Your previous booking |
| 🟡 Yellow | Bestseller seats |
| ⬜ Light Gray | Locked by another user |

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Adithya**
- GitHub: [@adithya11sci](https://github.com/adithya11sci)

---

<p align="center">Made with ❤️ using AI-assisted development</p>
