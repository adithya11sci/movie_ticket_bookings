# 🎬 Movie Ticket Booking System

A professional **BookMyShow-style** movie ticket booking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

![Movie Booking](https://img.shields.io/badge/MERN-Stack-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [Seat Booking System](#-seat-booking-system)
- [User Guide](#-user-guide)
- [Admin Panel](#-admin-panel)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎭 User Features
- **User Authentication** - Register, Login, JWT-based sessions
- **Browse Movies** - View all available movies with posters, ratings, genres
- **Movie Details** - Full movie info with hero banner, cast, description
- **Theater Selection** - Choose from multiple theaters showing the movie
- **Showtime Selection** - Pick preferred date and time slots
- **Seat Selection** - BookMyShow-style interactive seat map
- **Secure Booking** - Atomic transactions prevent double-booking
- **Payment Integration** - Simulated payment flow
- **Booking History** - View all past and upcoming bookings
- **E-Tickets** - Download/view booking confirmation

### 🔐 Admin Features
- **Dashboard** - Overview of bookings, revenue, statistics
- **Movie Management** - Add, edit, delete movies
- **Theater Management** - Manage theaters and screens
- **Showtime Management** - Create and manage show schedules
- **Booking Management** - View all bookings, cancel if needed
- **User Management** - View registered users

### 🔒 Concurrent Booking Prevention
- **Atomic MongoDB Transactions** - Prevents race conditions
- **Seat Locking** - Temporarily locks seats during selection (5 min)
- **Real-time Conflict Detection** - Shows error if seat taken
- **Auto-cleanup** - Releases expired locks automatically

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| Vite | Build Tool |
| React Router v6 | Navigation |
| Axios | HTTP Client |
| React Toastify | Notifications |
| React Icons | Icon Library |
| CSS3 | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| dotenv | Environment Variables |

---

## 📁 Project Structure

```
movie_ticket_booking/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── bookingController.js  # Booking with atomic ops
│   │   ├── movieController.js    # Movie CRUD
│   │   ├── showTimeController.js # Showtime management
│   │   └── theaterController.js  # Theater CRUD
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── Booking.js            # Booking schema
│   │   ├── Movie.js              # Movie schema
│   │   ├── ShowTime.js           # Showtime with seat locking
│   │   ├── Theater.js            # Theater schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── showTimeRoutes.js
│   │   └── theaterRoutes.js
│   ├── utils/
│   │   └── seatCleanup.js        # Expired lock cleanup
│   ├── server.js                 # Entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios config
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieCard.css
│   │   │   ├── SeatSelector.jsx  # BookMyShow seat grid
│   │   │   └── SeatSelector.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomePage.css
│   │   │   ├── MovieDetailsPage.jsx
│   │   │   ├── MovieDetailsPage.css
│   │   │   ├── BookingPage.jsx
│   │   │   ├── BookingPage.css
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageMovies.jsx
│   │   │       ├── ManageTheaters.jsx
│   │   │       └── ManageShowtimes.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js v18+ 
- MongoDB Atlas account (or local MongoDB)
- Git

### Clone Repository
```bash
git clone https://github.com/adithya11sci/movie_ticket_bookings.git
cd movie_ticket_booking
```

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/movie_ticket_booking
JWT_SECRET=your_super_secret_jwt_key
```

Start backend:
```bash
npm start
# or for development
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | `mysecretkey123` |

### Default Admin Account
```
Email: admin@moviebook.com
Password: admin123
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Get all movies |
| GET | `/api/movies/:id` | Get movie by ID |
| POST | `/api/movies` | Create movie (Admin) |
| PUT | `/api/movies/:id` | Update movie (Admin) |
| DELETE | `/api/movies/:id` | Delete movie (Admin) |

### Theaters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/theaters` | Get all theaters |
| GET | `/api/theaters/:id` | Get theater by ID |
| POST | `/api/theaters` | Create theater (Admin) |
| PUT | `/api/theaters/:id` | Update theater (Admin) |
| DELETE | `/api/theaters/:id` | Delete theater (Admin) |

### Showtimes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/showtimes` | Get all showtimes |
| GET | `/api/showtimes/:id` | Get showtime by ID |
| GET | `/api/showtimes/movie/:movieId` | Get showtimes for movie |
| POST | `/api/showtimes` | Create showtime (Admin) |
| DELETE | `/api/showtimes/:id` | Delete showtime (Admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my-bookings` | Get user's bookings |
| GET | `/api/bookings/:id` | Get booking by ID |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| PUT | `/api/bookings/:id/payment` | Update payment status |
| POST | `/api/bookings/lock-seats` | Lock seats (atomic) |
| POST | `/api/bookings/release-seats` | Release locked seats |
| GET | `/api/bookings/showtime/:id/my-seats` | Get user's seats for showtime |
| GET | `/api/bookings/showtime/:id/seat-status` | Get seat lock status |
| GET | `/api/bookings` | Get all bookings (Admin) |

---

## 🎫 Seat Booking System

### Seat Layout (BookMyShow Style)

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
    │  L:  [1][2][3][4]     [5][6][7][8][9][10][11][12]     [13]..[16]
    │  K:  [1][2][3][4]     [5][6][7][8][9][10][11][12]     [13]..[16]
    │  J:  [1][2][3][4]     [5][6][7][8][9][10][11][12]     [13]..[16]
    │  I:  [1][2][3][4]     [5][6][7][8][9][10][11][12]     [13]..[16]
    │  H:  [1][2][3][4]     [5][6][7][8][9][10][11][12]     [13]..[16]
    │  G:  [1][2][3][4]     [5][6][7][8][9][10][11][12]     [13]..[16]
    └─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │  Rs. 180 CLASSIC (Regular)                                  │
    │  F:  [1][2][3][4][5]   [6][7][8][9][10][11][12][13]   [14]..[18]
    │  E:  [1][2][3][4][5]   [6][7][8][9][10][11][12][13]   [14]..[18]
    │  D:  [1][2][3][4][5]   [6][7][8][9][10][11][12][13]   [14]..[18]
    │  C:  [1][2][3][4][5]   [6][7][8][9][10][11][12][13]   [14]..[18]
    │  B:  [1][2][3][4][5]   [6][7][8][9][10][11][12][13]   [14]..[18]
    │  A:  [1][2][3][4][5]   [6][7][8][9][10][11][12][13]   [14]..[18]
    └─────────────────────────────────────────────────────────────┘
```

### Seat Status Colors

| Color | Status | Description |
|-------|--------|-------------|
| 🟢 Green Border | Available | Seat is available for booking |
| 🟢 Green Filled | Selected | Currently selected by you |
| ⚪ Gray | Sold | Already booked by another user |
| 🟠 Orange | Your Booking | Seats you have already booked |
| 🟡 Yellow | Bestseller | Popular center seats |
| ⬜ Light Gray | Locked | Temporarily locked by another user |

### Pricing Tiers

| Section | Rows | Price |
|---------|------|-------|
| **RECLINER (VIP)** | N, M | ₹480 |
| **PRIME (Premium)** | L, K, J, I, H, G | ₹280 |
| **CLASSIC (Regular)** | F, E, D, C, B, A | ₹180 |

### Concurrent Booking Prevention

The system uses **atomic MongoDB transactions** to prevent race conditions:

1. **Seat Locking**: When a user selects seats, they are temporarily locked
2. **Lock Duration**: 5 minutes (configurable)
3. **Auto-cleanup**: Expired locks are automatically released every minute
4. **Conflict Handling**: If another user tries to book a locked/booked seat, they get a 409 error

```javascript
// Seat Status Schema
{
    seatNumber: "K7",
    status: "available" | "locked" | "booked",
    lockedBy: ObjectId (user),
    lockExpiry: Date,
    bookedBy: ObjectId (user)
}
```

---

## 👤 User Guide

### 1. Registration & Login
1. Click "Register" to create an account
2. Enter name, email, phone, and password
3. Login with your credentials

### 2. Browse Movies
1. View all movies on the homepage
2. Use filters to find movies by genre/language
3. Click on a movie card to view details

### 3. Book Tickets
1. On movie details page, click "Book Tickets"
2. Select theater from the list
3. Choose preferred date and showtime
4. Select seats from the interactive seat map
5. Click "Pay" to proceed to payment
6. Complete payment to confirm booking

### 4. View Bookings
1. Go to "My Bookings" from navbar
2. View all past and upcoming bookings
3. Cancel upcoming bookings if needed

---

## 🔧 Admin Panel

### Access Admin Panel
1. Login with admin credentials
2. Navigate to `/admin` or click Admin link in navbar

### Manage Movies
- Add new movies with poster, cast, description
- Edit existing movie details
- Delete movies

### Manage Theaters
- Add theaters with name, location, screens
- Configure seating capacity
- Edit/delete theaters

### Manage Showtimes
- Create showtimes for movies
- Set theater, date, time, and pricing
- View/delete showtimes

### View Bookings
- See all user bookings
- Filter by date, movie, status
- Cancel bookings if needed

---

## 📸 Screenshots

### Home Page
- Hero carousel with featured movies
- Movie grid with posters and ratings
- Dark theme with gradient backgrounds

### Movie Details
- Large hero banner with movie poster
- Movie info, cast, and description
- Theater and showtime selection

### Seat Selection
- BookMyShow-style seat grid
- Color-coded seat status
- Section-wise pricing display

### Booking Confirmation
- E-ticket with QR code
- Booking details summary
- Download/print option

---

## 🔄 Recent Updates

### Version 1.0.0 (February 2026)
- ✅ Initial release with full booking flow
- ✅ BookMyShow-style UI implementation
- ✅ Concurrent booking prevention with atomic transactions
- ✅ User's booked seats shown in orange
- ✅ Seat lock cleanup scheduler
- ✅ 409 conflict handling for race conditions
- ✅ 15 sample movies with posters
- ✅ Admin panel for management

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Adithya**
- GitHub: [@adithya11sci](https://github.com/adithya11sci)

---

## 🙏 Acknowledgments

- BookMyShow for UI inspiration
- MongoDB Atlas for database hosting
- React community for amazing libraries

---

<p align="center">Made with ❤️ for movie lovers</p>
