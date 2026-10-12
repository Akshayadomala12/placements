# 🎓 PlacementPro — Campus Job Placement Portal

A modern, enterprise-grade full-stack University Campus Placement and Recruitment Management System. Built with **Spring Boot 3**, **Spring Security + JWT**, **Spring Data JPA**, **H2 Database**, and a **React 18 (Vite)** frontend with dark/light themes and glassmorphic UI.

---

## 📁 Repository Structure

```
job-placement-portal/

frontend/
├── src/
│   ├── components/
│   │   ├── AnnouncementCard.jsx
│   │   ├── ApplicationTable.jsx
│   │   ├── JobCard.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── StatCard.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminUserManagement.jsx
│   │   ├── AnnouncementsPage.jsx
│   │   ├── Login.jsx
│   │   ├── RecruiterApplicants.jsx
│   │   ├── RecruiterCompanyProfile.jsx
│   │   ├── RecruiterDashboard.jsx
│   │   ├── RecruiterPostJob.jsx
│   │   ├── StudentApplications.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── StudentJobs.jsx
│   │   └── StudentProfile.jsx
│   ├── services/
│   │   ├── adminService.js
│   │   ├── api.js
│   │   ├── applicationService.js
│   │   ├── authService.js
│   │   └── jobService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── favicon.svg
├── package.json
├── vite.config.js
└── index.html

backend/
├── src/main/java/com/placement/
│   ├── controller/
│   │   ├── AdminController.java
│   │   ├── AnnouncementController.java
│   │   ├── AuthController.java
│   │   ├── JobController.java
│   │   ├── RecruiterController.java
│   │   └── StudentController.java
│   ├── service/
│   │   ├── AdminService.java
│   │   ├── ApplicationService.java
│   │   ├── AuthService.java
│   │   ├── JobService.java
│   │   ├── RecruiterService.java
│   │   └── StudentService.java
│   ├── repository/
│   │   ├── AnnouncementRepository.java
│   │   ├── ApplicationRepository.java
│   │   ├── CompanyProfileRepository.java
│   │   ├── JobRepository.java
│   │   ├── StudentProfileRepository.java
│   │   └── UserRepository.java
│   ├── entity/
│   │   ├── Announcement.java
│   │   ├── Application.java
│   │   ├── ApplicationStatus.java
│   │   ├── CompanyProfile.java
│   │   ├── Job.java
│   │   ├── JobType.java
│   │   ├── Role.java
│   │   ├── StudentProfile.java
│   │   └── User.java
│   ├── dto/
│   │   ├── ApplicationRequest.java
│   │   ├── ApplicationStatusUpdate.java
│   │   ├── AuthRequest.java
│   │   ├── AuthResponse.java
│   │   ├── CompanyProfileDto.java
│   │   ├── DashboardStatsDto.java
│   │   ├── JobRequest.java
│   │   ├── JobResponse.java
│   │   ├── RegisterRequest.java
│   │   └── StudentProfileDto.java
│   ├── security/
│   │   ├── CustomUserDetails.java
│   │   ├── CustomUserDetailsService.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtUtils.java
│   │   └── SecurityConfig.java
│   └── JobPlacementApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── data.sql
└── pom.xml

database/
└── schema.sql
```

---

## ⚡ Quick Start Guide

### 1. Start the Spring Boot Backend

Prerequisites: **Java 21** and **Maven**

```bash
cd backend
mvn spring-boot:run
```

- REST API starts at: `http://localhost:8080`
- In-memory H2 Database Console: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:mem:placementdb`
  - **Username**: `sa`
  - **Password**: *(leave blank)*

### 2. Start the React Frontend

Prerequisites: **Node.js 18+** and **npm**

```bash
cd frontend
npm install
npm run dev
```

- Application runs at: `http://localhost:5173`
- Seamlessly proxies `/api` and `/h2-console` calls to port `8080`.

---

## 🔑 Pre-Seeded Demo Accounts (One-Click or Manual)

All demo accounts use password: `Password@123`

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@placement.edu` | `Password@123` | Placement Dean (Full Platform Stats, User Governance, Notices) |
| **Recruiter** | `recruiter@google.com` | `Password@123` | Google India HR (Post Jobs, Manage Candidate Funnel) |
| **Recruiter** | `recruiter@microsoft.com` | `Password@123` | Microsoft IDC (Cloud Solutions Engineer drives) |
| **Student** | `aarav.sharma@college.edu` | `Password@123` | 21CS101, CSE, 9.25 CGPA, 0 Backlogs (Eligible for all roles) |
| **Student** | `priya.patel@college.edu` | `Password@123` | 21IT142, IT, 8.60 CGPA, 0 Backlogs |
| **Student** | `rohan.verma@college.edu` | `Password@123` | 21EC205, ECE, 7.40 CGPA, 1 Backlog |

> 💡 **Tip**: On the Login screen, click any of the **Quick Demo Sign In** buttons to log in with a single click!

---

## 🎯 Key Capabilities

### 👨‍🎓 Student Hub
- **Automated Eligibility Engine**: Every job opening is dynamically verified against the student's CGPA, active backlogs, graduation batch year, and eligible departments.
- **One-Click Application**: Instantly apply for eligible roles and prevent duplicate submissions.
- **Application Status Funnel**: Track stages in real time: `APPLIED` → `SHORTLISTED` → `TECHNICAL_ROUND` → `HR_ROUND` → `SELECTED` / `REJECTED`.
- **Review Interview Feedback**: Read notes, interview schedules, and evaluation remarks provided by recruiters.
- **Profile & Resume Manager**: Update technical skill tags, portfolio links (GitHub, LinkedIn), and academic info.

### 🏢 Corporate Recruiter Portal
- **Drive Publisher**: Define hiring criteria (min CGPA, max backlogs allowed, allowed branch list, package CTC, deadline).
- **Candidate Evaluation Funnel**: Filter candidates by job and stage, view academic scores, and advance candidates with feedback.
- **Corporate Branding**: Maintain company description, headquarters, and HR lead contact info.

### 🛡️ Placement Cell Administration
- **Analytics & Health KPIs**: Placement percentage, average package, highest package, total offers, and branch-wise placement tracking.
- **User Governance**: Audit all student and recruiter accounts with one-click access suspension / reactivation.
- **Campus Broadcasting**: Post categorized announcements (`DRIVE_ALERT`, `SCHEDULE`, `GENERAL`) visible to all students.
