# 🔐 Secure User Authentication API  

A secure and extensible user authentication API built with **Spring Boot**, **MySQL**, **JWT**, and **REST APIs**.  
Supports user registration, login, password encryption, JWT-based authentication, profile handling, and OTP-driven email verification & password reset.  

---

## ⚡ Features
- ✅ User Registration & Login  
- 🔑 Password encryption (BCrypt)  
- 📧 OTP-based **email verification** for account activation  
- 🔄 OTP-driven **password reset** with expiration checks  
- 🍪 JWT authentication with **custom filter chain** (token auto-attached in cookies)  
- 🗄️ Relational database schema using **MySQL + JPA/Hibernate**  
- 🛡️ Stateless session handling with **SOLID layered architecture**  
- ✉️ Automated email notifications using **JavaMailSender**  
- 🧪 API testing with **Postman**  

---

## 🛠️ Tech Stack
- **Backend:** Spring Boot, Spring Security, Hibernate/JPA  
- **Database:** MySQL  
- **Auth:** JWT, OTP (email)  
- **Testing:** Postman  
- **Version Control:** Git  

---

## 📌 API Endpoints

### 🔹 Authentication & User Management
- `POST /api/register` → Register a new user  
- `POST /api/login` → Login & receive JWT token (attached in cookie)  
- `GET /api/profile` → Fetch user profile (JWT required)  
- `GET /api/is-authenticated` → Check if user session is valid  

### 🔹 OTP & Password Reset
- `POST /api/send-otp` → Send OTP for email verification  
- `POST /api/verify-otp` → Verify OTP for account activation  
- `POST /api/send-reset-otp?email={userEmail}` → Send OTP for password reset  
- `POST /api/reset-password` → Reset password using OTP  

---

## 🏗️ Database Schema (Simplified)

**users** table:  
- `id` (PK)  
- `userId` (Unique)  
- `name`  
- `email` (Unique)  
- `password` (encrypted)  
- `verifyOtp`, `verifyOtpExpireAt`  
- `resetOtp`, `resetOtpExpireAt`  
- `isAccountVerified`  
- `createdAt`, `updatedAt`  

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/secure-auth-api.git
cd secure-auth-api
```
### 2️⃣ Configure Database
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/auth_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```
### 3️⃣ Run the Application
```
mvn spring-boot:run
```
### 4️⃣ Test with Postman
Register → Verify Email → Login → Profile → Reset Password

---

## 📬 Future Improvements
- 🌐 Social login (Google/GitHub OAuth)
- 📱 Multi-factor authentication (MFA)
- 📊 Admin dashboard for user/session management
- 
---

## 🤝 Contributing
- Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
