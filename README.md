# Temple Management & Pooja Booking System (BNT Temples)

A full-stack Temple Management Web Application designed to handle online pooja bookings, donations, annaprasad contributions, and admin operations with a secure approval workflow.

Built with modern technologies to ensure scalability, security, and smooth user experience.
---

### Live Features

### 👥 User Features
- Select temple
- Browse poojas based on selected temple
- Select multiple poojas in one booking
- Submit booking request (Admin approval required)
- Single combined payment for selected poojas
- View assigned pooja date (selected by admin)
- Download virtual pooja ticket after approval
- Donation system
- Email OTP verification during signup
- Secure login & authentication (Token-based)

---

### 🛠 Admin Features
- Dashboard overview (Revenue, bookings, transactions)
- Approve / Reject pooja requests
- Assign available pooja dates
- Manage temples (Multiple temple support)
- Add / Edit / Delete poojas
- Manage donation options
- Manage annaprasad contributions
- View payment & transaction reports
- User management (View / Block users)
- Generate tickets & receipts

---

## Tech Stack

### Frontend
- React.js
- Context API
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Email OTP Verification

### Cloud & Deployment
- Cloudinary (Image Storage)
- Vercel (Frontend)
- Node Server (Backend – Port 5174)

---

## ⚙️ Project Structure

```
/client
  ├── components
  ├── pages
  ├── context (TempleContext)
  └── services

/server
  ├── models
  ├── routes
  ├── controllers
  ├── middleware
  └── server.js
```

---

## Authentication Flow

1. User enters Name + Email + Password
2. Email OTP is sent (valid for 10 minutes)
3. User verifies OTP
4. Account is created
5. Login using JWT token authentication

---

## Booking Flow

1. User selects temple
2. Selects one or multiple poojas
3. Submits booking request
4. Admin reviews request
5. Admin assigns available pooja date
6. User completes payment
7. Booking status updated
8. Ticket generated

---

## 🌍 Environment Variables

Create `.env` file in backend:

```env
PORT=5174
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/temple-booking-system.git
```

### Install Frontend

```bash
cd client
npm install
npm run dev
```

### Install Backend

```bash
cd server
npm install
node server.js
```

---

## 📊 Core Modules

- bookingModel.js
- bookingController.js
- bookingRoute.js
- userModel.js
- poojaModel.js
- templeModel.js

---

## 📈 Future Enhancements

- Razorpay / Payment Gateway Integration
- SMS Notifications
- Admin Analytics Charts
- Role-Based Admin Access
- Multi-language Support

---

## 👨‍💻 Developed By

Mohan Badiger  
Full Stack Developer
portfolio: mohanbadiger.site
📍 Karnataka, India  
📧 mohanbadiger250@gmail.com  

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, please consider giving it a star on GitHub.
