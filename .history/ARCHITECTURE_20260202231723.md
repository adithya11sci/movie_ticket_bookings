# 🏗️ Architecture & Flow Diagrams

## Movie Ticket Booking System - Technical Architecture

This document provides detailed architecture diagrams and flow charts for the Movie Ticket Booking System.

---

## 📋 Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Database Schema Diagram](#2-database-schema-diagram)
3. [Authentication Flow](#3-authentication-flow)
4. [Booking Flow](#4-booking-flow)
5. [Concurrent Booking Prevention](#5-concurrent-booking-prevention)
6. [Seat Locking Mechanism](#6-seat-locking-mechanism)
7. [Admin Operations Flow](#7-admin-operations-flow)
8. [Refund & Cancellation Flow](#8-refund--cancellation-flow)
9. [API Request/Response Flow](#9-api-requestresponse-flow)
10. [Component Architecture](#10-component-architecture)

---

## 1. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MOVIE TICKET BOOKING SYSTEM                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│   │   Mobile    │    │   Desktop   │    │   Tablet    │    │  Admin PC   │ │
│   │   Browser   │    │   Browser   │    │   Browser   │    │   Browser   │ │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘ │
│          │                  │                  │                  │         │
│          └──────────────────┼──────────────────┼──────────────────┘         │
│                             │                  │                            │
│                             ▼                  ▼                            │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                         FRONTEND (React + Vite)                      │  │
│   │                         Hosted on Vercel                             │  │
│   │   ┌──────────────────────────────────────────────────────────────┐  │  │
│   │   │  Components: Navbar, MovieCard, SeatSelector, Chatbot        │  │  │
│   │   │  Pages: Home, Movies, MovieDetails, Booking, Payment, Admin  │  │  │
│   │   │  Context: AuthContext (User State Management)                 │  │  │
│   │   │  API Client: Axios with JWT Interceptor                       │  │  │
│   │   └──────────────────────────────────────────────────────────────┘  │  │
│   └──────────────────────────────────┬──────────────────────────────────┘  │
│                                      │ HTTPS (REST API)                    │
│                                      ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                       BACKEND (Node.js + Express)                    │  │
│   │                         Hosted on Vercel                             │  │
│   │   ┌──────────────────────────────────────────────────────────────┐  │  │
│   │   │  Routes: auth, movies, theaters, showtimes, bookings, admin  │  │  │
│   │   │  Controllers: Business Logic Layer                            │  │  │
│   │   │  Middleware: JWT Auth, Admin Role Check                       │  │  │
│   │   │  Utils: Token Generation, Seat Cleanup Scheduler              │  │  │
│   │   └──────────────────────────────────────────────────────────────┘  │  │
│   └──────────────────────────────────┬──────────────────────────────────┘  │
│                                      │ MongoDB Driver                      │
│                                      ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                       DATABASE (MongoDB Atlas)                       │  │
│   │                         Cloud Hosted                                 │  │
│   │   ┌──────────────────────────────────────────────────────────────┐  │  │
│   │   │  Collections: users, movies, theaters, showtimes, bookings   │  │  │
│   │   │  Features: Transactions, Indexes, Replica Set                 │  │  │
│   │   └──────────────────────────────────────────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Three-Tier Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION TIER                                 │
│                         (React Frontend)                                    │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Home     │  │   Movies   │  │  Booking   │  │   Admin    │           │
│  │   Page     │  │   Page     │  │   Page     │  │   Panel    │           │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘           │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    Shared Components                                │   │
│  │  Navbar | MovieCard | SeatSelector | Footer | Chatbot             │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    State Management                                 │   │
│  │  AuthContext (User, Token) | React Router (Navigation)            │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ REST API (JSON)
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION TIER                                 │
│                         (Express.js Backend)                                │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                         ROUTES                                      │   │
│  │  /api/auth | /api/movies | /api/theaters | /api/showtimes         │   │
│  │  /api/bookings | /api/admin                                        │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                     │                                      │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                       MIDDLEWARE                                    │   │
│  │  JWT Verification | Admin Check | Error Handler | CORS            │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                     │                                      │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                      CONTROLLERS                                    │   │
│  │  authController | movieController | bookingController              │   │
│  │  showTimeController | theaterController | adminController          │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                     │                                      │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                       UTILITIES                                     │   │
│  │  generateToken | seatCleanup (Scheduler)                           │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ Mongoose ODM
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                              DATA TIER                                      │
│                          (MongoDB Atlas)                                    │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                         COLLECTIONS                                   │ │
│  ├────────────┬────────────┬────────────┬────────────┬────────────────┐ │ │
│  │   users    │   movies   │  theaters  │ showtimes  │    bookings    │ │ │
│  │            │            │            │            │                │ │ │
│  │  - name    │  - title   │  - name    │  - movie   │  - user        │ │ │
│  │  - email   │  - genre   │  - location│  - theater │  - showTime    │ │ │
│  │  - password│  - rating  │  - screens │  - date    │  - seats       │ │ │
│  │  - role    │  - poster  │  - capacity│  - time    │  - amount      │ │ │
│  │            │            │            │  - seats   │  - status      │ │ │
│  └────────────┴────────────┴────────────┴────────────┴────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Diagram

### Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA (MongoDB)                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
│       USERS        │       │       MOVIES       │       │     THEATERS       │
├────────────────────┤       ├────────────────────┤       ├────────────────────┤
│ _id: ObjectId (PK) │       │ _id: ObjectId (PK) │       │ _id: ObjectId (PK) │
│ name: String       │       │ title: String      │       │ name: String       │
│ email: String (U)  │       │ description: Text  │       │ location: String   │
│ password: Hash     │       │ genre: [String]    │       │ city: String       │
│ phone: String      │       │ duration: Number   │       │ screens: Number    │
│ role: Enum         │       │ language: String   │       │ totalSeats: Number │
│ createdAt: Date    │       │ releaseDate: Date  │       │ amenities: [String]│
└─────────┬──────────┘       │ posterUrl: String  │       │ createdAt: Date    │
          │                  │ trailerUrl: String │       └─────────┬──────────┘
          │                  │ rating: Number     │                 │
          │                  │ isNowShowing: Bool │                 │
          │                  │ createdAt: Date    │                 │
          │                  └─────────┬──────────┘                 │
          │                            │                            │
          │                            │                            │
          │                            ▼                            │
          │              ┌────────────────────────┐                 │
          │              │      SHOWTIMES         │◀────────────────┘
          │              ├────────────────────────┤
          │              │ _id: ObjectId (PK)     │
          │              │ movie: ObjectId (FK)   │──────▶ MOVIES
          │              │ theater: ObjectId (FK) │──────▶ THEATERS
          │              │ showDate: Date         │
          │              │ showTime: String       │
          │              │ price: Object          │
          │              │   - regular: Number    │
          │              │   - premium: Number    │
          │              │   - vip: Number        │
          │              │ bookedSeats: [String]  │
          │              │ availableSeats: Number │
          │              │ seatStatus: [Object]   │
          │              │   - seatNumber: String │
          │              │   - status: Enum       │
          │              │   - lockedBy: ObjectId │
          │              │   - lockExpiry: Date   │
          │              │   - bookedBy: ObjectId │
          │              │ isActive: Boolean      │
          │              └───────────┬────────────┘
          │                          │
          │                          │
          ▼                          ▼
┌─────────────────────────────────────────────────┐
│                   BOOKINGS                       │
├─────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                              │
│ user: ObjectId (FK) ────────────────────────────│──▶ USERS
│ showTime: ObjectId (FK) ────────────────────────│──▶ SHOWTIMES
│ seats: [Object]                                 │
│   - seatNumber: String                          │
│   - seatType: Enum (regular/premium/vip)        │
│ totalSeats: Number                              │
│ totalAmount: Number                             │
│ bookingStatus: Enum (pending/confirmed/cancelled)│
│ paymentStatus: Enum (pending/completed/failed)  │
│ paymentId: String                               │
│ bookingDate: Date                               │
│ cancelledAt: Date                               │
│ cancelledBy: String                             │
│ createdAt: Date                                 │
└─────────────────────────────────────────────────┘

LEGEND:
  PK = Primary Key
  FK = Foreign Key
  U  = Unique Index
  ──▶ = Reference/Relationship
```

### Seat Status Schema Detail

```
┌─────────────────────────────────────────────────────────────┐
│                    SEAT STATUS OBJECT                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  seatStatus: [                                              │
│    {                                                        │
│      seatNumber: "K7",          // e.g., Row K, Seat 7     │
│      status: "locked",          // available|locked|booked │
│      lockedBy: ObjectId,        // User who locked         │
│      lockExpiry: ISODate,       // Lock expiration time    │
│      bookedBy: ObjectId         // User who booked (final) │
│    },                                                       │
│    {                                                        │
│      seatNumber: "K8",                                      │
│      status: "booked",                                      │
│      bookedBy: ObjectId                                     │
│    }                                                        │
│  ]                                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Authentication Flow

### User Registration Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          USER REGISTRATION FLOW                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────────┐
│  User   │      │  Frontend   │      │   Backend   │      │    MongoDB      │
│ Browser │      │   (React)   │      │  (Express)  │      │                 │
└────┬────┘      └──────┬──────┘      └──────┬──────┘      └────────┬────────┘
     │                  │                    │                      │
     │  Fill Form       │                    │                      │
     │─────────────────▶│                    │                      │
     │                  │                    │                      │
     │                  │  POST /api/auth/register                  │
     │                  │  {name, email, password, phone}           │
     │                  │───────────────────▶│                      │
     │                  │                    │                      │
     │                  │                    │  Check email exists  │
     │                  │                    │─────────────────────▶│
     │                  │                    │                      │
     │                  │                    │◀─────────────────────│
     │                  │                    │                      │
     │                  │                    │  Hash password       │
     │                  │                    │  (bcryptjs)          │
     │                  │                    │                      │
     │                  │                    │  Create User         │
     │                  │                    │─────────────────────▶│
     │                  │                    │                      │
     │                  │                    │◀─────────────────────│
     │                  │                    │                      │
     │                  │                    │  Generate JWT        │
     │                  │                    │                      │
     │                  │  {user, token}     │                      │
     │                  │◀───────────────────│                      │
     │                  │                    │                      │
     │                  │  Store in          │                      │
     │                  │  localStorage      │                      │
     │                  │                    │                      │
     │  Redirect to     │                    │                      │
     │  Home Page       │                    │                      │
     │◀─────────────────│                    │                      │
     │                  │                    │                      │
```

### User Login Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                             USER LOGIN FLOW                                   │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────────┐
│  User   │      │  Frontend   │      │   Backend   │      │    MongoDB      │
└────┬────┘      └──────┬──────┘      └──────┬──────┘      └────────┬────────┘
     │                  │                    │                      │
     │  Enter Credentials                    │                      │
     │─────────────────▶│                    │                      │
     │                  │                    │                      │
     │                  │  POST /api/auth/login                     │
     │                  │  {email, password} │                      │
     │                  │───────────────────▶│                      │
     │                  │                    │                      │
     │                  │                    │  Find user by email  │
     │                  │                    │─────────────────────▶│
     │                  │                    │                      │
     │                  │                    │  User document       │
     │                  │                    │◀─────────────────────│
     │                  │                    │                      │
     │                  │                    │  Compare password    │
     │                  │                    │  (bcrypt.compare)    │
     │                  │                    │                      │
     │                  │                    │         ┌────────────┴───────┐
     │                  │                    │         │  Password Match?   │
     │                  │                    │         └────────────┬───────┘
     │                  │                    │                      │
     │                  │                    │           ┌──────────┴──────────┐
     │                  │                    │           ▼                     ▼
     │                  │                    │        [YES]                 [NO]
     │                  │                    │           │                     │
     │                  │                    │    Generate JWT          Return 401
     │                  │                    │           │                     │
     │                  │  {user, token}     │◀──────────┘                     │
     │                  │◀───────────────────│                                 │
     │                  │                    │◀────────────────────────────────┘
     │                  │  Update            │
     │                  │  AuthContext       │
     │                  │                    │
     │  Show Dashboard  │                    │
     │◀─────────────────│                    │
```

### JWT Token Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           JWT TOKEN STRUCTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                            HEADER                                      │ │
│  │  {                                                                     │ │
│  │    "alg": "HS256",                                                    │ │
│  │    "typ": "JWT"                                                       │ │
│  │  }                                                                     │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                   .                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                            PAYLOAD                                     │ │
│  │  {                                                                     │ │
│  │    "id": "6789abc123def456",      // User's MongoDB _id              │ │
│  │    "role": "user",                 // user | admin                    │ │
│  │    "iat": 1738512000,              // Issued at timestamp             │ │
│  │    "exp": 1741104000               // Expires in 30 days              │ │
│  │  }                                                                     │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                   .                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                           SIGNATURE                                    │ │
│  │  HMACSHA256(                                                          │ │
│  │    base64UrlEncode(header) + "." + base64UrlEncode(payload),         │ │
│  │    JWT_SECRET                                                         │ │
│  │  )                                                                     │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Booking Flow

### Complete Booking Journey

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE BOOKING FLOW                                 │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐                                                    
    │  START  │                                                    
    └────┬────┘                                                    
         │                                                         
         ▼                                                         
┌─────────────────┐                                               
│   Browse Movies │                                               
│   /movies       │                                               
└────────┬────────┘                                               
         │                                                         
         ▼                                                         
┌─────────────────┐     ┌─────────────────┐                       
│  Select Movie   │────▶│  Movie Details  │                       
│  (Click Card)   │     │  /movies/:id    │                       
└─────────────────┘     └────────┬────────┘                       
                                 │                                 
                                 ▼                                 
                        ┌─────────────────┐                       
                        │  Select Date    │                       
                        │  (Date Picker)  │                       
                        └────────┬────────┘                       
                                 │                                 
                                 ▼                                 
                        ┌─────────────────┐                       
                        │ Select Theater  │                       
                        │ & Showtime      │                       
                        └────────┬────────┘                       
                                 │                                 
                                 ▼                                 
                        ┌─────────────────┐     ┌─────────────────┐
                        │ Check if User   │────▶│    Redirect to  │
                        │ Logged In?      │ NO  │    Login Page   │
                        └────────┬────────┘     └─────────────────┘
                                 │ YES                             
                                 ▼                                 
┌──────────────────────────────────────────────────────────────────┐
│                      SEAT SELECTION PAGE                          │
│                      /booking/:showtimeId                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                    SEAT MAP                               │  │
│   │   🟢 Available  🟢(filled) Selected  ⚪ Sold  ⬜ Locked │  │
│   │                                                          │  │
│   │   RECLINER (₹480):  [N1][N2]...[N12]                    │  │
│   │   PRIME (₹280):     [L1][L2]...[L16]                    │  │
│   │   CLASSIC (₹180):   [A1][A2]...[A18]                    │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  Selected: K7, K8                     Total: ₹560        │  │
│   │                                    [Pay ₹560]            │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                                 │                                 
                                 │ Click Pay                       
                                 ▼                                 
                        ┌─────────────────┐                       
                        │ Create Booking  │                       
                        │ POST /bookings  │                       
                        └────────┬────────┘                       
                                 │                                 
                                 ▼                                 
┌──────────────────────────────────────────────────────────────────┐
│                       PAYMENT PAGE                                │
│                       /payment/:bookingId                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌────────────────────┐  ┌────────────────────┐                │
│   │  💳 UPI Payment    │  │  💳 Card Payment   │                │
│   │  ○ Google Pay      │  │  Card Number: ___  │                │
│   │  ○ PhonePe         │  │  Expiry: __/__     │                │
│   │  ○ Paytm           │  │  CVV: ___          │                │
│   └────────────────────┘  └────────────────────┘                │
│                                                                  │
│   ┌────────────────────┐  ┌────────────────────┐                │
│   │  🏦 Net Banking    │  │  💰 Wallet         │                │
│   │  Select Bank ▼     │  │  Balance: ₹2000    │                │
│   └────────────────────┘  └────────────────────┘                │
│                                                                  │
│                        [Complete Payment]                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                                 │                                 
                                 │ Payment Success                 
                                 ▼                                 
                        ┌─────────────────┐                       
                        │ Update Payment  │                       
                        │ Status          │                       
                        └────────┬────────┘                       
                                 │                                 
                                 ▼                                 
┌──────────────────────────────────────────────────────────────────┐
│                       TICKET PAGE                                 │
│                       /ticket/:bookingId                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                    🎬 E-TICKET                           │  │
│   │                                                          │  │
│   │   Movie: Avengers: Secret Wars                          │  │
│   │   Theater: PVR Cinemas, Chennai                         │  │
│   │   Date: Feb 15, 2026 | Time: 7:30 PM                    │  │
│   │   Seats: K7, K8                                         │  │
│   │   Amount: ₹560                                          │  │
│   │                                                          │  │
│   │   ┌───────────┐                                         │  │
│   │   │  QR Code  │  Booking ID: BK12345                   │  │
│   │   │   [|||]   │                                         │  │
│   │   └───────────┘                                         │  │
│   │                                                          │  │
│   │                    [Download Ticket]                     │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                                 │                                 
                                 ▼                                 
                           ┌─────────┐                            
                           │   END   │                            
                           └─────────┘                            
```

---

## 5. Concurrent Booking Prevention

### Race Condition Scenario

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    RACE CONDITION SCENARIO (PREVENTED)                        │
└──────────────────────────────────────────────────────────────────────────────┘

WITHOUT PROTECTION (Problem):
─────────────────────────────

User A                    Server                    User B
  │                         │                         │
  │  Select Seat K7         │                         │
  │────────────────────────▶│                         │
  │                         │                         │
  │                         │◀────────────────────────│
  │                         │      Select Seat K7     │
  │                         │                         │
  │  Book Seat K7           │                         │
  │────────────────────────▶│                         │
  │                         │                         │
  │                         │◀────────────────────────│
  │                         │      Book Seat K7       │
  │                         │                         │
  │  ✓ Booking Success      │                         │
  │◀────────────────────────│                         │
  │                         │                         │
  │                         │────────────────────────▶│
  │                         │     ✓ Booking Success   │
  │                         │     (DOUBLE BOOKED!)    │
  │                         │                         │

─────────────────────────────────────────────────────────────────────────────────

WITH ATOMIC TRANSACTIONS (Solution):
────────────────────────────────────

User A                    Server                    User B
  │                         │                         │
  │  Select Seat K7         │                         │
  │────────────────────────▶│                         │
  │                         │                         │
  │                         │  START TRANSACTION      │
  │                         │  Lock Seat K7           │
  │                         │                         │
  │                         │◀────────────────────────│
  │                         │      Select Seat K7     │
  │                         │                         │
  │                         │  CHECK: K7 is LOCKED    │
  │                         │                         │
  │                         │────────────────────────▶│
  │                         │     ⚠ Seat K7 Locked    │
  │                         │     (Show Light Gray)   │
  │                         │                         │
  │  Complete Payment       │                         │
  │────────────────────────▶│                         │
  │                         │                         │
  │                         │  COMMIT TRANSACTION     │
  │                         │  Status → BOOKED        │
  │                         │                         │
  │  ✓ Booking Success      │                         │
  │◀────────────────────────│                         │
  │                         │                         │
  │                         │                         │
  │                         │◀────────────────────────│
  │                         │     Try to Book K7      │
  │                         │                         │
  │                         │────────────────────────▶│
  │                         │     ✗ 409 Conflict      │
  │                         │     Seat Already Booked │
```

### Atomic Transaction Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        ATOMIC TRANSACTION FLOW                                │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    ┌────────────────────────────┐                          │
│                    │     START TRANSACTION      │                          │
│                    │   session.startTransaction │                          │
│                    └─────────────┬──────────────┘                          │
│                                  │                                          │
│                                  ▼                                          │
│                    ┌────────────────────────────┐                          │
│                    │   1. Find Showtime         │                          │
│                    │   (with session)           │                          │
│                    └─────────────┬──────────────┘                          │
│                                  │                                          │
│                                  ▼                                          │
│                    ┌────────────────────────────┐                          │
│                    │   2. Check Each Seat       │                          │
│                    │   - Is it available?       │                          │
│                    │   - Is it locked by other? │                          │
│                    │   - Is it already booked?  │                          │
│                    └─────────────┬──────────────┘                          │
│                                  │                                          │
│                    ┌─────────────┴──────────────┐                          │
│                    ▼                            ▼                          │
│           ┌───────────────┐            ┌───────────────┐                   │
│           │   Available   │            │  Unavailable  │                   │
│           └───────┬───────┘            └───────┬───────┘                   │
│                   │                            │                            │
│                   ▼                            ▼                            │
│    ┌────────────────────────┐    ┌────────────────────────┐                │
│    │  3. Create Booking     │    │  ABORT TRANSACTION     │                │
│    │  (with session)        │    │  session.abortTransaction               │
│    └─────────────┬──────────┘    └─────────────┬──────────┘                │
│                  │                             │                            │
│                  ▼                             ▼                            │
│    ┌────────────────────────┐    ┌────────────────────────┐                │
│    │  4. Update Seat Status │    │  Return 409 Conflict   │                │
│    │  - Pull old status     │    │  {conflictSeat: "K7"}  │                │
│    │  - Push: booked        │    └────────────────────────┘                │
│    └─────────────┬──────────┘                                              │
│                  │                                                          │
│                  ▼                                                          │
│    ┌────────────────────────┐                                              │
│    │  5. Update bookedSeats │                                              │
│    │  - Add to array        │                                              │
│    │  - Decrement available │                                              │
│    └─────────────┬──────────┘                                              │
│                  │                                                          │
│                  ▼                                                          │
│    ┌────────────────────────┐                                              │
│    │   COMMIT TRANSACTION   │                                              │
│    │   session.commitTransaction                                           │
│    └─────────────┬──────────┘                                              │
│                  │                                                          │
│                  ▼                                                          │
│    ┌────────────────────────┐                                              │
│    │   Return Success       │                                              │
│    │   {booking: {...}}     │                                              │
│    └────────────────────────┘                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Seat Locking Mechanism

### Lock Lifecycle

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          SEAT LOCK LIFECYCLE                                  │
└──────────────────────────────────────────────────────────────────────────────┘

                            ┌─────────────────┐
                            │    AVAILABLE    │
                            │   (No Status)   │
                            └────────┬────────┘
                                     │
                    User selects seat│
                    POST /lock-seats │
                                     ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────────┐│
│   │                              LOCKED                                      ││
│   │                                                                         ││
│   │   seatStatus: {                                                         ││
│   │     seatNumber: "K7",                                                   ││
│   │     status: "locked",                                                   ││
│   │     lockedBy: ObjectId("user123"),                                      ││
│   │     lockExpiry: ISODate("2026-02-02T12:05:00Z")  // Now + 5 min        ││
│   │   }                                                                      ││
│   │                                                                         ││
│   └─────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
     ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
     │ User Completes │    │  Lock Expires  │    │  User Releases │
     │    Payment     │    │  (5 minutes)   │    │     Seats      │
     └───────┬────────┘    └───────┬────────┘    └───────┬────────┘
             │                     │                     │
             ▼                     ▼                     ▼
     ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
     │     BOOKED     │    │   AVAILABLE    │    │   AVAILABLE    │
     │                │    │  (Auto-cleanup │    │  (Immediate)   │
     │ status: booked │    │   scheduler)   │    │                │
     │ bookedBy: user │    │                │    │                │
     └────────────────┘    └────────────────┘    └────────────────┘
```

### Cleanup Scheduler

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        CLEANUP SCHEDULER FLOW                                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           Server Startup                                     │
│                                                                             │
│   startCleanupScheduler()                                                   │
│   └── setInterval(cleanupExpiredLocks, 60 * 1000)  // Every 60 seconds     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ Every 60 seconds
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        cleanupExpiredLocks()                                 │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  1. Find showtimes with expired locks                                │  │
│   │                                                                      │  │
│   │  ShowTime.find({                                                     │  │
│   │    'seatStatus': {                                                   │  │
│   │      $elemMatch: {                                                   │  │
│   │        status: 'locked',                                             │  │
│   │        lockExpiry: { $lt: now }                                      │  │
│   │      }                                                               │  │
│   │    }                                                                 │  │
│   │  })                                                                  │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  2. For each showtime, filter out expired locks                      │  │
│   │                                                                      │  │
│   │  showtime.seatStatus = seatStatus.filter(seat => {                  │  │
│   │    if (seat.status === 'locked' && seat.lockExpiry < now) {         │  │
│   │      return false;  // Remove this lock                              │  │
│   │    }                                                                 │  │
│   │    return true;  // Keep this seat status                           │  │
│   │  });                                                                 │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  3. Save updated showtime                                            │  │
│   │                                                                      │  │
│   │  await showtime.save();                                              │  │
│   │  console.log(`🧹 Cleaned up ${count} expired seat locks`);          │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Admin Operations Flow

### Admin Dashboard Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        ADMIN DASHBOARD DATA FLOW                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           GET /api/admin/stats                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Parallel Aggregations                               │
│                                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│   │ Count Users │  │Count Movies │  │Count Theater│  │Count Booking│       │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│          │                │                │                │               │
│          ▼                ▼                ▼                ▼               │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                     Aggregate Revenue                                │  │
│   │                                                                      │  │
│   │   Booking.aggregate([                                                │  │
│   │     { $match: { paymentStatus: 'completed' } },                     │  │
│   │     { $group: { _id: null, total: { $sum: '$totalAmount' } } }      │  │
│   │   ])                                                                 │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                     Recent Bookings (Last 10)                        │  │
│   │                                                                      │  │
│   │   Booking.find()                                                     │  │
│   │     .populate('user')                                                │  │
│   │     .populate({path: 'showTime', populate: ['movie', 'theater']})   │  │
│   │     .sort({ bookingDate: -1 })                                       │  │
│   │     .limit(10)                                                       │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                     Daily Bookings (Last 7 Days)                     │  │
│   │                                                                      │  │
│   │   Booking.aggregate([                                                │  │
│   │     { $match: { bookingDate: { $gte: sevenDaysAgo } } },            │  │
│   │     { $group: {                                                      │  │
│   │         _id: { $dateToString: { format: '%Y-%m-%d', date } },       │  │
│   │         count: { $sum: 1 },                                          │  │
│   │         revenue: { $sum: '$totalAmount' }                            │  │
│   │     }}                                                               │  │
│   │   ])                                                                 │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                     Top Movies by Revenue                            │  │
│   │                                                                      │  │
│   │   Booking.aggregate([                                                │  │
│   │     { $lookup: { from: 'showtimes', ... } },                        │  │
│   │     { $lookup: { from: 'movies', ... } },                           │  │
│   │     { $group: { _id: movie, revenue: { $sum: '$totalAmount' } } },  │  │
│   │     { $sort: { revenue: -1 } },                                      │  │
│   │     { $limit: 5 }                                                    │  │
│   │   ])                                                                 │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │   Response to Frontend  │
                        │                        │
                        │   {                    │
                        │     stats: {...},      │
                        │     recentBookings,    │
                        │     dailyBookings,     │
                        │     topMovies          │
                        │   }                    │
                        └────────────────────────┘
```

### Admin Action → User Impact Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      ADMIN ACTION → USER IMPACT                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ADMIN                         DATABASE                         USER      │
│                                                                             │
│   ┌─────────────────┐                                                      │
│   │  Add New Movie  │                                                      │
│   └────────┬────────┘                                                      │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐      │
│   │ POST /movies    │────▶│  Insert Movie   │────▶│  Next API call  │      │
│   │                 │     │  Collection     │     │  sees new movie │      │
│   └─────────────────┘     └─────────────────┘     └─────────────────┘      │
│                                                                             │
│   ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│   ┌─────────────────┐                                                      │
│   │ Delete Showtime │                                                      │
│   └────────┬────────┘                                                      │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐      │
│   │ DELETE          │────▶│  Remove from    │────▶│  Showtime not   │      │
│   │ /showtimes/:id  │     │  Collection     │     │  visible to user│      │
│   └─────────────────┘     └─────────────────┘     └─────────────────┘      │
│                                                                             │
│   ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│   ┌─────────────────┐                                                      │
│   │ Cancel Booking  │                                                      │
│   └────────┬────────┘                                                      │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐      │
│   │ PUT /admin/     │────▶│ 1. Update       │────▶│  Seats become   │      │
│   │ bookings/:id/   │     │    booking      │     │  available for  │      │
│   │ cancel          │     │    status       │     │  other users    │      │
│   └─────────────────┘     │                 │     └─────────────────┘      │
│                           │ 2. Release      │                              │
│                           │    seats from   │                              │
│                           │    showtime     │                              │
│                           │                 │                              │
│                           │ 3. Update       │                              │
│                           │    available    │                              │
│                           │    seats count  │                              │
│                           └─────────────────┘                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Refund & Cancellation Flow

### User Cancellation Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        USER CANCELLATION FLOW                                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  User   │    │  Frontend   │    │   Backend   │    │  Database   │
└────┬────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
     │                │                  │                  │
     │  Click Cancel  │                  │                  │
     │───────────────▶│                  │                  │
     │                │                  │                  │
     │                │  PUT /bookings/:id/cancel           │
     │                │─────────────────▶│                  │
     │                │                  │                  │
     │                │                  │  Find Booking    │
     │                │                  │─────────────────▶│
     │                │                  │                  │
     │                │                  │  Booking Doc     │
     │                │                  │◀─────────────────│
     │                │                  │                  │
     │                │                  │  Verify Owner    │
     │                │                  │  (user._id match)│
     │                │                  │                  │
     │                │                  │  Update Status   │
     │                │                  │  → 'cancelled'   │
     │                │                  │─────────────────▶│
     │                │                  │                  │
     │                │                  │  Find Showtime   │
     │                │                  │─────────────────▶│
     │                │                  │                  │
     │                │                  │  ┌───────────────────────────────┐
     │                │                  │  │  Release Seats:               │
     │                │                  │  │  1. Remove from bookedSeats   │
     │                │                  │  │  2. Remove from seatStatus    │
     │                │                  │  │  3. Increment availableSeats  │
     │                │                  │  └───────────────────────────────┘
     │                │                  │─────────────────▶│
     │                │                  │                  │
     │                │  {message: success}                 │
     │                │◀─────────────────│                  │
     │                │                  │                  │
     │  Show Toast    │                  │                  │
     │  "Cancelled"   │                  │                  │
     │◀───────────────│                  │                  │
     │                │                  │                  │
     │  Update UI     │                  │                  │
     │  (remove from  │                  │                  │
     │   list)        │                  │                  │
     │◀───────────────│                  │                  │
```

### Admin Cancellation with Refund

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ADMIN CANCELLATION WITH REFUND                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ┌────────────────────────────────────────────────────────────────────┐   │
│   │                    ADMIN TRIGGERS CANCEL                            │   │
│   │                                                                     │   │
│   │   PUT /api/admin/bookings/:bookingId/cancel                        │   │
│   └─────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  1. FIND BOOKING                                                     │  │
│   │                                                                      │  │
│   │  const booking = await Booking.findById(id).populate('showTime');   │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  2. VALIDATE                                                         │  │
│   │                                                                      │  │
│   │  - Check booking exists                                              │  │
│   │  - Check not already cancelled                                       │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  3. RELEASE SEATS                                                    │  │
│   │                                                                      │  │
│   │  const showtime = await ShowTime.findById(booking.showTime._id);    │  │
│   │  const seatNumbers = booking.seats.map(s => s.seatNumber);          │  │
│   │                                                                      │  │
│   │  // Remove from bookedSeats array                                    │  │
│   │  showtime.bookedSeats = showtime.bookedSeats.filter(                │  │
│   │      seat => !seatNumbers.includes(seat)                             │  │
│   │  );                                                                  │  │
│   │                                                                      │  │
│   │  // Increment available count                                        │  │
│   │  showtime.availableSeats += seatNumbers.length;                      │  │
│   │                                                                      │  │
│   │  await showtime.save();                                              │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  4. UPDATE BOOKING STATUS                                            │  │
│   │                                                                      │  │
│   │  booking.bookingStatus = 'cancelled';                                │  │
│   │  booking.cancelledAt = new Date();                                   │  │
│   │  booking.cancelledBy = 'admin';                                      │  │
│   │                                                                      │  │
│   │  await booking.save();                                               │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  5. TRIGGER REFUND (Future Implementation)                           │  │
│   │                                                                      │  │
│   │  // Integration with payment gateway                                 │  │
│   │  // await paymentGateway.refund({                                    │  │
│   │  //   paymentId: booking.paymentId,                                  │  │
│   │  //   amount: booking.totalAmount                                    │  │
│   │  // });                                                              │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  6. RETURN SUCCESS                                                   │  │
│   │                                                                      │  │
│   │  res.json({                                                          │  │
│   │    message: 'Booking cancelled successfully',                        │  │
│   │    booking: updatedBooking                                           │  │
│   │  });                                                                 │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. API Request/Response Flow

### Request Lifecycle

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         API REQUEST LIFECYCLE                                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (React)                                  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  API.get('/bookings/my-bookings')                                    │  │
│   │                                                                      │  │
│   │  ┌─────────────────────────────────────────────────────────────┐    │  │
│   │  │              Axios Interceptor                               │    │  │
│   │  │                                                              │    │  │
│   │  │  const user = localStorage.getItem('user');                  │    │  │
│   │  │  if (user) {                                                 │    │  │
│   │  │    config.headers.Authorization = `Bearer ${token}`;        │    │  │
│   │  │  }                                                           │    │  │
│   │  └─────────────────────────────────────────────────────────────┘    │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ HTTPS Request
                                     │ Authorization: Bearer <JWT>
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             SERVER (Express)                                 │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  1. CORS Middleware                                                  │  │
│   │                                                                      │  │
│   │  app.use(cors({                                                      │  │
│   │    origin: ['http://localhost:5173', 'https://...vercel.app']       │  │
│   │  }));                                                                │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  2. Body Parser                                                      │  │
│   │                                                                      │  │
│   │  app.use(express.json());                                            │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  3. Router                                                           │  │
│   │                                                                      │  │
│   │  app.use('/api/bookings', bookingRoutes);                           │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  4. Auth Middleware (protect)                                        │  │
│   │                                                                      │  │
│   │  - Extract token from Authorization header                           │  │
│   │  - Verify JWT signature                                              │  │
│   │  - Decode user ID from payload                                       │  │
│   │  - Attach user to req.user                                          │  │
│   │                                                                      │  │
│   │  ┌────────────────────────────────────────────────────────────┐     │  │
│   │  │  if (!token)     → 401 Not authorized                      │     │  │
│   │  │  if (invalid)    → 401 Token invalid                       │     │  │
│   │  │  if (expired)    → 401 Token expired                       │     │  │
│   │  │  if (valid)      → next()                                  │     │  │
│   │  └────────────────────────────────────────────────────────────┘     │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  5. Controller                                                       │  │
│   │                                                                      │  │
│   │  getMyBookings(req, res)                                            │  │
│   │                                                                      │  │
│   │  const bookings = await Booking.find({ user: req.user._id })        │  │
│   │    .populate(...)                                                    │  │
│   │                                                                      │  │
│   │  res.json(bookings);                                                │  │
│   └─────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                     │
                                     │ JSON Response
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (React)                                  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  const response = await API.get('/bookings/my-bookings');           │  │
│   │  setBookings(response.data);                                         │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Component Architecture

### Frontend Component Tree

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       REACT COMPONENT HIERARCHY                               │
└──────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │      App        │
                              │   (App.jsx)     │
                              └────────┬────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
     ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
     │  AuthProvider  │      │    Navbar      │      │    Footer      │
     │ (AuthContext)  │      │  (Navbar.jsx)  │      │  (Footer.jsx)  │
     └───────┬────────┘      └────────────────┘      └────────────────┘
             │
             │  Provides: user, login, logout, token
             │
             ▼
     ┌────────────────────────────────────────────────────────────────┐
     │                         Router                                  │
     │                     (React Router)                              │
     └──────────────────────────┬─────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────────┐
        │                       │                           │
        ▼                       ▼                           ▼
┌───────────────┐      ┌───────────────┐          ┌───────────────┐
│  Public Routes│      │Protected Route│          │  Admin Routes │
└───────┬───────┘      └───────┬───────┘          └───────┬───────┘
        │                      │                          │
   ┌────┴────┐           ┌─────┴─────┐              ┌─────┴─────┐
   │         │           │           │              │           │
   ▼         ▼           ▼           ▼              ▼           ▼
┌──────┐  ┌──────┐   ┌────────┐  ┌────────┐   ┌──────────┐  ┌────────┐
│ Home │  │Movies│   │Booking │  │Payment │   │Dashboard │  │Manage  │
│ Page │  │ Page │   │  Page  │  │  Page  │   │  (Admin) │  │ Pages  │
└──────┘  └──┬───┘   └────┬───┘  └────────┘   └──────────┘  └────────┘
             │            │
             ▼            ▼
        ┌────────┐   ┌────────────┐
        │MovieCard│   │SeatSelector│
        └────────┘   └────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                          COMPONENT DETAILS                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           Navbar.jsx                                    │ │
│  │  - Navigation links                                                     │ │
│  │  - User menu (if logged in)                                            │ │
│  │  - Admin link (if admin)                                               │ │
│  │  - Uses: AuthContext                                                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          MovieCard.jsx                                  │ │
│  │  - Movie poster                                                        │ │
│  │  - Title, rating, genre                                                │ │
│  │  - Book Now button                                                     │ │
│  │  - Props: movie                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        SeatSelector.jsx                                 │ │
│  │  - Interactive seat grid                                               │ │
│  │  - Color-coded status                                                  │ │
│  │  - Click to select/deselect                                            │ │
│  │  - Props: theater, bookedSeats, selectedSeats, onSeatSelect,          │ │
│  │           userBookedSeats, lockedSeats, prices                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          Chatbot.jsx                                    │ │
│  │  - Floating chat button                                                │ │
│  │  - Chat window                                                         │ │
│  │  - AI-powered responses                                                │ │
│  │  - Quick suggestion buttons                                            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       ProtectedRoute.jsx                                │ │
│  │  - Checks if user is authenticated                                     │ │
│  │  - Redirects to login if not                                          │ │
│  │  - Checks admin role for admin routes                                  │ │
│  │  - Uses: AuthContext                                                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Summary

This document provides comprehensive architecture and flow diagrams for understanding:

1. **System Architecture** - Three-tier architecture with clear separation of concerns
2. **Database Design** - MongoDB collections and relationships
3. **Authentication** - JWT-based secure authentication flow
4. **Booking Process** - Complete user journey from browsing to ticket
5. **Concurrency Control** - Atomic transactions and seat locking
6. **Admin Operations** - Dashboard data flow and user impact
7. **Refund System** - Cancellation and seat release process
8. **API Design** - Request lifecycle and middleware chain
9. **Component Structure** - React component hierarchy

For more details, refer to the source code and README.md.

---

<p align="center">📐 Architecture Documentation for Movie Ticket Booking System</p>
