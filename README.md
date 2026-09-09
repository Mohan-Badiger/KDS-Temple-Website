# 🛕 Temple Management & Pooja Booking System (BNT Temples)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4-black?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v6-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern full-stack Temple Management Web Application designed to handle online pooja bookings, donations, annaprasad contributions, and admin operations with an automated notification and approval workflow.

---

## 📑 Table of Contents

- [Features](#-features)
- [Project Architecture](#-project-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Local Setup Guide](#-step-by-step-local-setup-guide)
  - [1. Clone or Open the Repository](#1-clone-or-open-the-repository)
  - [2. Configure Environment Variables (.env)](#2-configure-environment-variables-env)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Start the Application Locally](#4-start-the-application-locally)
- [Local Access & Port Reference](#-local-access--port-reference)
- [Admin Portal Login Guide](#-admin-portal-login-guide)
- [Key Workflows](#-key-workflows)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)
- [Core Modules](#-core-modules)
- [Author & License](#-author--license)

---

## ✨ Features

### 👥 User Portal
- **Temple Selection**: Select from multiple managed temples.
- **Pooja Booking**: Browse poojas by temple, select multiple poojas in a single booking request.
- **Admin Approval Workflow**: Requests are reviewed and given specific available dates by temple administration.
- **Online Payment**: Integrated Razorpay checkout for poojas and sevas.
- **Virtual Pooja Tickets**: Download digital receipt and virtual ticket with QR verification after approval.
- **Donation & Annaprasad**: Dedicated portals for temple donations and community kitchen (Annaprasad) contributions.
- **Secure Authentication**: Email OTP verification during signup, token-based session management (JWT), and optional Google OAuth 2.0.

### 🛠 Admin Dashboard
- **Analytics Overview**: Real-time stats on total revenue, booking counts, user activity, and transactions.
- **Booking Management**: Approve or reject pooja requests and assign convenient pooja dates.
- **Temple & Pooja Management**: Add, update, and manage temples, pooja listings, descriptions, and pricing.
- **Donation & Annaprasad Tracking**: Track donor lists, payment statuses, and contribution reports.
- **User Management**: View registered users, manage permissions, and block/unblock accounts.
- **Report Exporting**: Export transaction and booking data directly to PDF or Excel (`.xlsx`).
- **OTP-Secured Admin Login**: Admin login protected by one-time password (OTP) sent directly to the registered admin email.

---

## ⚙️ Project Architecture

The repository is structured into three independent packages:

```
KDS-Temple-Website/
├── backend/                  # Express.js REST API & Database Models (Port 4000)
│   ├── config/               # Database (MongoDB) & Cloudinary configurations
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # JWT authentication & admin authorization
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express endpoint routes
│   ├── services/             # Nodemailer & Razorpay services
│   ├── utils/                # Verification and helper utilities
│   ├── .env.example          # Sample environment variables for backend
│   └── server.js             # API entry point
│
├── frontend/                 # Public-facing User Portal (Port 5173)
│   ├── src/
│   │   ├── components/       # UI components (Navbar, Footer, Loaders, etc.)
│   │   ├── context/          # React Context (TempleContext)
│   │   ├── pages/            # Views (Home, Poojas, Donations, MySeva, etc.)
│   │   └── utils/            # Axios API client instance
│   ├── .env.example          # Sample environment variables for frontend
│   └── vite.config.js        # Vite + Tailwind configuration
│
└── admin/                    # Administrative Dashboard (Port 5174)
    ├── src/
    │   ├── components/       # Admin UI components (Sidebar, Navbar, Login modal)
    │   ├── pages/            # Admin management views (Dashboard, Poojas, Sevas, etc.)
    │   └── assets/           # Icons and styling assets
    ├── .env.example          # Sample environment variables for admin
    └── vite.config.js        # Vite configuration (pinned to port 5174)
```

---

## 💻 Tech Stack

- **Backend**: Node.js, Express.js (ES Modules), MongoDB with Mongoose, JWT, Nodemailer, Helmet, Express Rate Limit.
- **Frontend & Admin**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion, Axios, React Toastify, jsPDF, Recharts, XLSX.
- **Third-Party Services**:
  - **MongoDB Atlas** or **Local MongoDB** (Database)
  - **Cloudinary** (Cloud image storage for poojas, temples, banners)
  - **Razorpay** (Payment gateway)
  - **Gmail SMTP** (Email dispatch for OTPs, tickets, and receipts)

---

## 📋 Prerequisites

Before running the application locally, make sure you have installed:

1. **Node.js**: `v18.x` or `v20.x` LTS recommended ([Download Node.js](https://nodejs.org/))
   ```bash
   node -v
   npm -v
   ```
2. **MongoDB**:
   - Either a local MongoDB instance running at `mongodb://127.0.0.1:27017` ([Download Community Server](https://www.mongodb.com/try/download/community))
   - Or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection URI.
3. **Cloudinary Account**: Free account on [Cloudinary](https://cloudinary.com/) for image uploads.
4. **Razorpay Test Account**: Free account on [Razorpay](https://razorpay.com/) to get Test API Keys.
5. **Gmail Account with App Password**:
   - Used for sending OTPs and confirmation emails via Nodemailer.
   - Go to **Google Account** → **Security** → **2-Step Verification** → **App passwords** → Generate a 16-character password for "Mail".

---

## 🚀 Step-by-Step Local Setup Guide

### 1. Clone or Open the Repository

Open your terminal or command prompt and clone the repository:

```bash
git clone https://github.com/Mohan-Badiger/KDS-Temple-Website.git
cd KDS-Temple-Website
```

---

### 2. Configure Environment Variables (.env)

The project requires environment variables in all three packages (`backend`, `frontend`, and `admin`). `.env.example` templates are provided in each directory.

#### A. Backend Environment Setup

Navigate to the `backend` folder and create a `.env` file:

```bash
cd backend
cp .env.example .env
```
*(On Windows Command Prompt use `copy .env.example .env`)*

Open `backend/.env` and update the values:

```env
# Server Port
PORT=4000
NODE_ENV=development

# MongoDB Connection String (backend automatically appends /temple)
# For local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (Used for image uploads)
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

# Razorpay (Test mode credentials)
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Admin Login Credentials (Used for Admin OTP verification)
ADMIN_EMAIL=your_admin_email@gmail.com
ADMIN_PASSWORD=your_admin_password_optional

# Nodemailer / Gmail SMTP Setup
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_gmail_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

# CORS Allowed Origins
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Google OAuth 2.0 (Optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

> [!IMPORTANT]
> The backend validates required environment variables (`JWT_SECRET`, `MONGODB_URI`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `ADMIN_EMAIL`) on boot and will exit if any are missing.

---

#### B. Frontend Environment Setup

Navigate to the `frontend` folder and create its `.env` file:

```bash
cd ../frontend
cp .env.example .env
```
*(On Windows Command Prompt use `copy .env.example .env`)*

Verify or edit `frontend/.env`:

```env
# Backend API base URL
VITE_BACKEND_URL=http://localhost:4000

# Razorpay Key ID for client checkout (Public Key)
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id

# Optional Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

#### C. Admin Environment Setup

Navigate to the `admin` folder and create its `.env` file:

```bash
cd ../admin
cp .env.example .env
```
*(On Windows Command Prompt use `copy .env.example .env`)*

Verify `admin/.env`:

```env
# Backend API base URL
VITE_BACKEND_URL=http://localhost:4000
```

---

### 3. Install Dependencies

You need to install dependencies for each package.

Open your terminal in the root directory and install dependencies for each folder:

#### Terminal (or sequentially):
```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install

# 3. Install Admin Dependencies
cd ../admin
npm install
```

---

### 4. Start the Application Locally

For full functionality, run **Backend**, **Frontend**, and **Admin** concurrently in three separate terminal windows.

#### 🟢 Terminal 1: Start Backend API
```bash
cd backend
npm run dev
```
- Starts on: **`http://localhost:4000`**
- You should see:
  ```
  Server started on PORT : 4000
  DB Connected successfully
  ```

#### 🔵 Terminal 2: Start Frontend (User Portal)
```bash
cd frontend
npm run dev
```
- Starts on: **`http://localhost:5173`**
- Accessible in browser at: [http://localhost:5173](http://localhost:5173)

#### 🟠 Terminal 3: Start Admin Panel
```bash
cd admin
npm run dev
```
- Starts on: **`http://localhost:5174`**
- Accessible in browser at: [http://localhost:5174](http://localhost:5174)

---

## 🌐 Local Access & Port Reference

| Service | Local URL | Description |
| :--- | :--- | :--- |
| **Backend API** | [http://localhost:4000](http://localhost:4000) | Express REST API server & database connection |
| **API Health Check** | [http://localhost:4000/](http://localhost:4000/) | Returns `"API Working"` |
| **Frontend Portal** | [http://localhost:5173](http://localhost:5173) | Main user-facing temple portal and booking interface |
| **Admin Dashboard** | [http://localhost:5174](http://localhost:5174) | Administrative management portal (requires OTP login) |

---

## 🔐 Admin Portal Login Guide

The admin portal uses a secure **Email OTP** verification mechanism:

1. Open **[http://localhost:5174](http://localhost:5174)** in your web browser.
2. In the Email field, enter the exact email you configured in `backend/.env` under **`ADMIN_EMAIL`**.
3. Click **Send OTP**.
4. Check your email inbox for a 6-digit OTP sent by the backend.
5. Enter the 6-digit OTP into the input fields and click **Verify & Login**.
6. Upon successful verification, you will be redirected to the Admin Dashboard.

> [!TIP]
> If you are testing locally and do not have an active Gmail SMTP password set up yet, check your backend server console logs or ensure Nodemailer credentials are correctly populated.

---

## 🔄 Key Workflows

### 1. User Registration & Login
1. User visits `http://localhost:5173` and clicks **Login / Sign Up**.
2. Enters Name, Email, and Password.
3. Receives a verification OTP via email.
4. Verifies the OTP to complete registration.
5. Logged-in session is maintained with JWT tokens.

### 2. Pooja Booking & Approval Workflow
1. User selects a temple and browses available poojas.
2. Adds desired pooja(s) and submits a booking request with devotee details (Gotra, Nakshatra, Rashi).
3. The booking status is marked as **Pending Approval**.
4. The Admin logs into `http://localhost:5174`, opens **Bookings**, selects an available date, and approves the request.
5. User completes the payment via Razorpay.
6. A virtual pooja ticket with booking details is generated for download.

### 3. Donations & Annaprasad Seva
1. User navigates to the **Donation** or **Annaprasad** page.
2. Selects an amount or seva category.
3. Completes payment through Razorpay.
4. An automated confirmation email and receipt are sent to the donor.

---

## 🛠 Troubleshooting & FAQs

### Q1: Backend crashes on startup with `Error: Missing required environment variable: ...`
- **Cause**: One or more mandatory environment variables are missing in `backend/.env`.
- **Fix**: Check `backend/server.js` line 21. Make sure `JWT_SECRET`, `MONGODB_URI`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, and `ADMIN_EMAIL` are all defined in `backend/.env`.

### Q2: MongoDB connection error or timeout
- **Cause**: The local MongoDB service is not running or the Atlas IP whitelist is blocking your IP address.
- **Fix**:
  - For local MongoDB: Start the MongoDB service (`net start MongoDB` on Windows, or `brew services start mongodb-community` on macOS).
  - For MongoDB Atlas: In Atlas Dashboard, go to **Network Access** and add your current IP address (or `0.0.0.0/0` for development).

### Q3: Nodemailer error `Invalid login: 535-5.7.8 Username and Password not accepted`
- **Cause**: Using your personal Gmail password instead of a dedicated Google App Password.
- **Fix**:
  1. Enable 2-Step Verification on your Google Account.
  2. Visit [Google App Passwords](https://myaccount.google.com/apppasswords).
  3. Generate a 16-character App Password for "Mail".
  4. Paste this 16-character code (without spaces) into `EMAIL_PASS` in `backend/.env`.

### Q4: CORS blocked request error in the browser console
- **Cause**: Origin not included in allowed CORS origins.
- **Fix**: Ensure your frontend and admin URLs are allowed in `backend/server.js` and set `FRONTEND_URL=http://localhost:5173` and `ADMIN_URL=http://localhost:5174` in `backend/.env`.

### Q5: Razorpay modal does not appear or says "Invalid Key"
- **Cause**: Razorpay key ID in `frontend/.env` (`VITE_RAZORPAY_KEY_ID`) does not match your active Razorpay Test Key.
- **Fix**: Generate test keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/#/app/keys) and paste the `rzp_test_...` key into both `backend/.env` (`RAZORPAY_KEY_ID`) and `frontend/.env` (`VITE_RAZORPAY_KEY_ID`).

---

## 📊 Core Modules

- **Authentication & Security**: `userController.js`, `adminController.js`, `authMiddleware.js`, `adminAuth.js`, `helmet` protection, rate limiting.
- **Booking Engine**: `bookingModel.js`, `bookingController.js`, `bookingRoute.js`.
- **Payment & Verification**: `paymentRoutes.js`, `razorpayService.js`, `verifyPayment.js`.
- **Temple & Pooja Management**: `templeModel.js`, `poojaModel.js`, `templeRoute.js`, `poojaRoute.js`.
- **Donation & Annaprasad**: `donationModel.js`, `donationRoute.js`, `annaprasadModel.js`, `annaprasadRoute.js`.
- **Email Notification Engine**: `sendOtpEmail.js`, `sendBookingEmail.js`, `sendDonationEmail.js`, `sendAnnaprasadEmail.js`, `sendContactEmail.js`, `sendWelcomeEmail.js`.

---

## 👨‍💻 Developed By

**Mohan Badiger**  
*Full Stack Developer*  
- 🌐 **Portfolio**: [mohanbadiger.site](https://mohanbadiger.site)  
- 📍 **Location**: Karnataka, India  
- 📧 **Email**: [mohanbadiger250@gmail.com](mailto:mohanbadiger250@gmail.com)  
- 🐙 **GitHub**: [@Mohan-Badiger](https://github.com/Mohan-Badiger)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, customize, and build upon this project.

---

⭐ If you found this project helpful, please consider giving it a star on [GitHub](https://github.com/Mohan-Badiger/KDS-Temple-Website)!
