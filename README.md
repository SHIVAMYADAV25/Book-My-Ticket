Here is a **refined, detailed, and professional README.md** with a clean tone, no emojis, and strong structure suitable for GitHub, portfolios, and recruiters.

---

# Book My Ticket — Backend API

A scalable and production-ready backend system for a movie ticket booking platform. This project is designed to simulate real-world booking systems, focusing on reliability, security, and clean architecture.

It allows users to browse movies, view shows, check seat availability, and book tickets while handling critical challenges such as concurrent bookings and authentication.

---

## Project Overview

This system follows a modular and maintainable architecture where responsibilities are clearly separated between controllers, services, and data validation layers. It emphasizes clean code practices and production-level patterns such as transaction management, centralized error handling, and secure authentication.

---

## Live Application

Frontend URL:
[https://seatlele.netlify.app/](https://seatlele.netlify.app/)

---

## Demo Credentials

You can use the following account to test the application:

```json
{
  "email": "testuser123@gmail.com",
  "password": "Test@123"
}
```

Seeded accounts (after running seed script):

Admin
[admin@bookmyticket.com](mailto:admin@bookmyticket.com) / Admin@1234

Users
[rahul@example.com](mailto:rahul@example.com) / Rahul@1234
[priya@example.com](mailto:priya@example.com) / Priya@1234

---

## Features

Authentication and Authorization
User registration, login, email verification, password reset, and token-based authentication using JWT.

Movie Management
Create, update, delete, and fetch movies. Admin-level control is enforced.

Show Scheduling
Manage movie shows with timing, pricing, and hall allocation.

Seat Management
Retrieve all seats or only available seats for a given show.

Ticket Booking
Users can book multiple seats with proper validation and transactional safety.

Security
Includes password hashing, secure token handling, HTTP security headers, and rate limiting.

---

## Tech Stack

Backend
Node.js
Express.js

Database
PostgreSQL
Drizzle ORM

Authentication and Security
JWT (Access and Refresh Tokens)
bcrypt
Helmet
Express Rate Limit

Validation and Architecture
Joi (DTO-based validation)
Modular architecture (Controller → Service → DTO)

Development Tools
Docker
Postman
Nodemon

---

## Project Structure

```
src/
├── app.js
├── common/
│   ├── config/
│   ├── db/
│   ├── dto/
│   ├── middleware/
│   └── utils/
│
├── modules/
│   ├── auth/
│   ├── movie/
│   ├── booking/
│   ├── seat/
│   └── show/
│
├── test/
│   └── BookMyTicket_postman_collection.json
│
drizzle/
├── migrations/
├── seed.js
```

---

## Installation and Setup

Clone the repository:

```bash
git clone <your-repo-url>
cd book-my-ticket
npm install
```

---

Create a .env file:

```env
PORT=3000

DATABASE_URL=postgresql://user:password@localhost:5432/bookmyticket

JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

Run database using Docker:

```bash
docker-compose up -d
```

---

Run migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

Seed the database:

```bash
node drizzle/seed.js
```

---

Start the server:

```bash
npm run dev
```

Application runs at:

```
http://localhost:3000
```

---

## API Base URL

```
http://localhost:3000/api/v1
```

---

## Authentication Flow

1. User registers an account
2. Email verification is completed
3. User logs in and receives an access token
4. Token is used in Authorization header for protected routes

```
Authorization: Bearer <accessToken>
```

---

## Core API Endpoints

Authentication

POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/refresh-token
POST /auth/logout

Movies

GET /movies
GET /movies/:id
POST /movies (Admin only)
PUT /movies/:id (Admin only)
DELETE /movies/:id (Admin only)

Shows

GET /movies/:movieId/shows
POST /movies/:movieId/shows (Admin only)

Seats

GET /movies/shows/:showId/seats
GET /movies/shows/:showId/seats/available

Bookings

POST /bookings
GET /bookings/my
PATCH /bookings/:id/cancel

---

## Booking Flow

1. Fetch available movies
2. Select a movie
3. Fetch shows for the movie
4. Retrieve available seats
5. Book seats

Example request:

```json
{
  "showId": "uuid",
  "seatIds": ["uuid1", "uuid2"]
}
```

---

## Key Design Decisions

Concurrent Booking Handling
Database transactions ensure atomic operations during booking. If multiple users try to book the same seat, only one succeeds.

Duplicate Booking Prevention
A unique constraint on seat and show combination prevents duplicate seat allocation.

Price Storage
Prices are stored in paise to avoid floating-point precision issues.

---

## Security Considerations

Passwords are hashed using bcrypt
JWT tokens are used for authentication
Refresh tokens are stored securely
Rate limiting prevents abuse
Helmet secures HTTP headers
Input validation ensures clean and safe data

---

## Architecture

The project follows a layered structure:

```
Route → Controller → Service → Database
```

DTOs handle validation, services contain business logic, and controllers manage request-response cycles.

---

## Testing

Use the Postman collection located in:

```
src/test/BookMyTicket_postman_collection.json
```

---

## Health Check

```
GET /health
```

---

## Future Improvements

Payment gateway integration
Seat locking with timeout mechanism
Redis caching
Real-time updates using WebSockets
Admin dashboard

---

## Author

Shivam Yadav

---

If you want, I can next:

* convert this into **LinkedIn project description**
* or create a **short GitHub bio + pinned repo description**

Just tell me what you need.
