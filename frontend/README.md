# Smart City Service Management System ( Jonoshetu )

## Project Description

The Smart City Service Management System is a secure and AI-powered Digital Civic Governance Platform that enables verified citizens to participate in digital voting, submit complaints, track civic issues, and access government services transparently.

The system focuses on:
- Verified citizen authentication using National ID (NID)
- Secure and encrypted digital voting
- AI-based complaint classification and prioritization
- Role-based governance workflow
- Transparent reporting and analytics
- Legal awareness through an AI chatbot

---

## Core Features

### 1. NID-Based Authentication System
- Login and registration via National ID (NID)
- AI-based NID verification and identity validation
- Duplicate registration prevention
- Two-Factor OTP verification
- Multi-role access system (Citizen, Admin, Department Officer, Senior Authority)

### 2. Digital Voting (Referendum System)
- Admin creates public voting events
- Senior authority approval required before activation
- Time-based voting (automatic open and close)
- Encrypted vote submission to ensure privacy
- Aggregated results visible to Admin only
- District-based analytics and graphical insights

### 3. Complaint Management System
- Citizens submit complaints related to infrastructure, utilities, safety, or public services
- Map-based location selection for accurate issue reporting
- Automatic department assignment
- AI-based problem classification and priority detection
- Real-time status tracking
- Assigned officer resolution workflow
- Senior authority approval required before closing a complaint

### 4. Public Notice Board
- Government announcements and official updates
- Direct links to important government portals and services

### 5. Monthly Reporting and Analytics
- Area-wise complaint statistics
- Heatmap visualization of high-complaint zones
- Monthly comparison analysis
- Governance performance insights

### 6. Law Aware AI Chatbot
- Educates citizens about legal rights and policies
- Provides guidance based on user-described real-life problems
- Offers simple explanations of applicable laws
- Suggests possible actions citizens can take

---

## Software Requirement Specification (SRS)

SRS Document Link:  
https://docs.google.com/document/d/1riIwhdvCP0LnE8zrBjIZh9vVYULgZjSTW_l4ftaPJPU/edit?usp=sharing

---

## Team Members

| Name | Student ID |
|------|------------|
| Md. Abid Ali | 22299505 |
| Md. Sybeen Abrar Prohor | 22299090 |
| Samia Bhuiyan | 22201702 |
| Audrija Chowdhury  | 22299421 |

---

## Tech Stack

### Frontend
- React.js
- Bootstrap
- Chart.js or Recharts
- Google Maps API

### Backend
- Node.js
- Express.js
- RESTful API Architecture
- JWT Authentication
- Role-Based Access Control (RBAC)
- OTP Service Integration 

### Database
- MongoDB
- Mongoose ODM
- Encrypted data storage for vote privacy

### AI Components
- NID data validation logic
- Complaint classification
- Priority detection system
- Law Aware Chatbot using LLM/NLP models
  

## Security Features
- End-to-End vote encryption
- Role-based authorization
- Two-Factor authentication
- Duplicate NID prevention
- Secure API communication over HTTPS

---

