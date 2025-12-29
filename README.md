🌍 TripNest

TripNest is a full-stack web application that allows users to create, view, edit, and review travel listings such as hotels, resorts, and restaurants.
The project focuses on authentication, authorization, RESTful APIs, image handling, and secure data management, simulating the core backend logic of a real travel platform.

🔗 Live Demo: https://tripnest-q7vg.onrender.com/

🚀 Key Features
🔐 Authentication & Authorization

User authentication implemented using Passport.js

Passwords securely hashed before storage

Session-based authentication with cookies

Authorization rules enforced:

Only logged-in users can create listings

Users can edit/delete only their own listings

Users can delete only their own reviews

🏨 Listings Management

Create new listings with:

Title

Description

Location

Price

Images

Edit and delete listings (owner-only)

View detailed listing pages

📝 Reviews System

Users can add reviews to listings

Reviews are associated with:

User

Listing

Review deletion restricted to review owner only

☁️ Image Storage

Images uploaded and stored using Cloudinary

Image URLs saved in MongoDB

Optimized image handling instead of local storage

🧠 Middleware & Error Handling

Custom middleware for:

Authentication checks

Authorization checks

Debugging request flow

Centralized error handling using Express error middleware

User-friendly alerts and flash messages

🗄️ Database

MongoDB Atlas used as cloud database

Mongoose schemas for:

Users

Listings

Reviews

🧱 Tech Stack
Layer	Technology
Backend -	Node.js, Express.js
Database - MongoDB (MongoDB Atlas)
Authentication -	Passport.js
API Style -	REST API
Image Storage -	Cloudinary
Sessions & Cookies -	Express-session
Deployment - Render


❌ Features NOT Implemented (Intentionally)------

❌ No booking logic

❌ No availability management

❌ No payment gateway integration

The project currently focuses on listing and review management, not transaction processing.

🔮 Future Enhancements

Booking system with date-based availability

Payment integration using Stripe

Admin dashboard

Search and advanced filters

Role-based access control



Passport.js handles authentication

Middleware enforces security and error handling
