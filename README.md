🏠 NIET Hostel Management Dashboard
📌 Overview

The NIET Hostel Management Dashboard is a web-based system designed to manage hostel operations efficiently, including student records, room allocation, rent payments, electricity tracking, and notices — all from a single dashboard.

This project focuses on frontend-based management with modular JavaScript architecture.

🚀 Features
📊 Dashboard Overview
View occupancy, payments, and system stats
👨‍🎓 Student Management
Add, update, and track student details
View student history
🏠 Room Management
Allocate and manage room availability
💳 Payment System
Track rent payments
Maintain payment history
⚡ Electricity Tracking
Record and manage electricity usage
🔔 Notices / Communication
Broadcast updates to students
⚙️ Settings Panel
Manage system configurations
🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript
Icons: Font Awesome
Architecture: Modular JS (separate feature-based files)
📂 Project Structure
WT PROJECT/
│
├── api/                     # (Optional backend/API integration)
├── assets/
│   ├── css/
│   ├── images/
│   └── js/
│       ├── app.js
│       ├── auth.js
│       ├── dashboard.js
│       ├── data.js
│       ├── electricity.js
│       ├── payments.js
│       ├── rooms.js
│       ├── settings.js
│       ├── student-history.js
│       └── students.js
│
├── headers/
│
├── index.html              # Main dashboard
├── login.html
├── register.html
├── students.html
├── rooms.html
├── payments.html
├── electricity.html
├── student-history.html
├── settings.html
├── contact.html
├── about.html
├── blog.html
├── features.html
├── testimonials.html
├── privacy.html
├── sitemap.xml
└── README.md
⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/hostel-management-dashboard.git
cd hostel-management-dashboard
2️⃣ Run Project

No backend required 👇
Just open in browser:

index.html

Or use Live Server in VS Code.

▶️ Usage
Open the dashboard (index.html)
Navigate through modules:
Students
Rooms
Payments
Electricity
Manage hostel data easily from UI
🧠 How It Works
Each feature is handled by separate JavaScript modules
Data is managed using local storage / JS state (via data.js)
Pages are connected through modular navigation system
Clean separation of:
UI (HTML/CSS)
Logic (JS modules)
📊 Advantages
📌 Simple and user-friendly UI
⚡ Fast (no heavy backend)
🧩 Modular and scalable code
🎯 Easy to extend with backend later
🧩 Future Improvements
🔗 Add backend (Node.js / Firebase / Supabase)
💳 Integrate online payments (Razorpay / UPI)
📱 Make it fully responsive/mobile-friendly
🔐 Add authentication system with database
📊 Add analytics dashboard
