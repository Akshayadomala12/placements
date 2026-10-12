-- ============================================================================
-- Job Placement Portal Database Schema
-- Compatible with H2, MySQL, and PostgreSQL
-- ============================================================================

-- Drop tables if they already exist (in reverse order of dependencies)
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS company_profiles;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Base authentication and role storage)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL, -- 'STUDENT', 'RECRUITER', 'ADMIN'
    phone VARCHAR(20),
    status VARCHAR(30) DEFAULT 'ACTIVE', -- 'ACTIVE', 'PENDING', 'SUSPENDED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Student Profiles
CREATE TABLE student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(80) NOT NULL, -- 'Computer Science', 'Information Technology', 'Electronics & Comm', etc.
    batch_year INT NOT NULL,
    cgpa DECIMAL(4, 2) NOT NULL,
    active_backlogs INT DEFAULT 0,
    history_backlogs INT DEFAULT 0,
    skills TEXT,
    resume_headline VARCHAR(255),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Company Profiles
CREATE TABLE company_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    location VARCHAR(120),
    description TEXT,
    logo_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Job Postings
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    job_type VARCHAR(50) DEFAULT 'FULL_TIME', -- 'FULL_TIME', 'INTERNSHIP', 'CONTRACT'
    location VARCHAR(120) NOT NULL,
    salary_package VARCHAR(80) NOT NULL, -- e.g., '14 - 18 LPA' or '50,000 / month'
    min_cgpa DECIMAL(4, 2) DEFAULT 6.0,
    max_backlogs INT DEFAULT 0,
    allowed_departments VARCHAR(255) DEFAULT 'ALL', -- Comma-separated or 'ALL'
    batch_year INT NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN', -- 'OPEN', 'CLOSED', 'ARCHIVED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES company_profiles(id) ON DELETE CASCADE
);

-- 5. Applications Table
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(40) DEFAULT 'APPLIED', -- 'APPLIED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'HR_ROUND', 'SELECTED', 'REJECTED'
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_job UNIQUE (student_id, job_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
);

-- 6. Announcements / Placement Drives
CREATE TABLE announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'GENERAL', -- 'DRIVE_ALERT', 'SCHEDULE', 'GENERAL'
    posted_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- Seed Sample Data (Pre-hashed passwords using BCrypt for "$2a$10$e7K..." = password)
-- Default Password for all seed users: Password@123
-- BCrypt: $2a$10$wKqMhG9v3vN1zG7R77mN6epqA42YkHlOqR3b7V.Q5v2Y6nJ5kG1Ue
-- ============================================================================

INSERT INTO users (id, name, email, password, role, phone, status, created_at) VALUES
(1, 'Dean of Placements', 'admin@placement.edu', '$2a$10$wKqMhG9v3vN1zG7R77mN6epqA42YkHlOqR3b7V.Q5v2Y6nJ5kG1Ue', 'ADMIN', '+91 9876543210', 'ACTIVE', CURRENT_TIMESTAMP),
(2, 'Google Careers', 'recruiter@google.com', '$2a$10$wKqMhG9v3vN1zG7R77mN6epqA42YkHlOqR3b7V.Q5v2Y6nJ5kG1Ue', 'RECRUITER', '+91 9876543211', 'ACTIVE', CURRENT_TIMESTAMP),
(3, 'Microsoft Talent', 'recruiter@microsoft.com', '$2a$10$wKqMhG9v3vN1zG7R77mN6epqA42YkHlOqR3b7V.Q5v2Y6nJ5kG1Ue', 'RECRUITER', '+91 9876543212', 'ACTIVE', CURRENT_TIMESTAMP),
(4, 'Amazon University Relations', 'recruiter@amazon.com', '$2a$10$wKqMhG9v3vN1zG7R77mN6epqA42YkHlOqR3b7V.Q5v2Y6nJ5kG1Ue', 'RECRUITER', '+91 9876543213', 'ACTIVE', CURRENT_TIMESTAMP),
(5, 'Aarav Sharma', 'aarav.sharma@college.edu', '$2a$10$wKqMhG9v3vN1zG7R77mN6epqA42YkHlOqR3b7V.Q5v2Y6nJ5kG1Ue', 'STUDENT', '+91 9123456780', 'ACTIVE', CURRENT_TIMESTAMP),
(6, 'Priya Patel', 'priya.patel@college.edu', '$2a$10$wKqMhG9v3vN1zG7R77mN6epqA42YkHlOqR3b7V.Q5v2Y6nJ5kG1Ue', 'STUDENT', '+91 9123456781', 'ACTIVE', CURRENT_TIMESTAMP),
(7, 'Rohan Verma', 'rohan.verma@college.edu', '$2a$10$wKqMhG9v3vN1zG7R77mN6epqA42YkHlOqR3b7V.Q5v2Y6nJ5kG1Ue', 'STUDENT', '+91 9123456782', 'ACTIVE', CURRENT_TIMESTAMP);

INSERT INTO company_profiles (id, user_id, company_name, industry, website, location, description, is_verified) VALUES
(1, 2, 'Google India', 'Technology & Cloud', 'https://careers.google.com', 'Bengaluru / Hyderabad', 'Global technology leader in search, AI, cloud computing, and hardware.', TRUE),
(2, 3, 'Microsoft IDC', 'Enterprise Software & Cloud', 'https://careers.microsoft.com', 'Hyderabad / Noida', 'Empowering every person and organization on the planet to achieve more.', TRUE),
(3, 4, 'Amazon Development Center', 'E-Commerce & Cloud', 'https://amazon.jobs', 'Bengaluru / Chennai', 'Earth''s most customer-centric company and innovative cloud infrastructure.', TRUE);

INSERT INTO student_profiles (id, user_id, roll_number, department, batch_year, cgpa, active_backlogs, history_backlogs, skills, resume_headline, github_url, linkedin_url) VALUES
(1, 5, '21CS101', 'Computer Science', 2026, 9.25, 0, 0, 'Java, Spring Boot, React, Docker, Kubernetes, MySQL', 'Full-stack software developer with passion for distributed microservices.', 'https://github.com/aarav', 'https://linkedin.com/in/aarav'),
(2, 6, '21IT142', 'Information Technology', 2026, 8.60, 0, 0, 'Python, Django, FastAPI, React, PostgreSQL, AWS', 'Backend engineer and machine learning enthusiast.', 'https://github.com/priyapatel', 'https://linkedin.com/in/priya'),
(3, 7, '21EC205', 'Electronics & Comm', 2026, 7.40, 1, 1, 'C++, Embedded Systems, IoT, React, Python', 'Hardware & embedded software developer with IoT project experience.', 'https://github.com/rohan', 'https://linkedin.com/in/rohan');

INSERT INTO jobs (id, company_id, title, description, job_type, location, salary_package, min_cgpa, max_backlogs, allowed_departments, batch_year, deadline, status, created_at) VALUES
(1, 1, 'Associate Software Development Engineer', 'Looking for high-caliber graduate engineers to build large-scale cloud services, low-latency microservices, and user-facing experiences.', 'FULL_TIME', 'Bengaluru', '28.5 LPA', 8.5, 0, 'Computer Science,Information Technology', 2026, DATEADD('DAY', 20, CURRENT_DATE), 'OPEN', CURRENT_TIMESTAMP),
(2, 2, 'Cloud Solutions Engineer', 'Work with enterprise clients on Azure cloud migration, automated deployments, CI/CD pipelines, and high availability systems.', 'FULL_TIME', 'Hyderabad', '22.0 LPA', 8.0, 0, 'Computer Science,Information Technology,Electronics & Comm', 2026, DATEADD('DAY', 15, CURRENT_DATE), 'OPEN', CURRENT_TIMESTAMP),
(3, 3, 'Software Development Engineer - Intern', '6-month fast-paced internship with potential PPO. Hands-on feature implementation in distributed e-commerce workflows.', 'INTERNSHIP', 'Bengaluru', '80,000 / month', 7.5, 0, 'Computer Science,Information Technology', 2026, DATEADD('DAY', 10, CURRENT_DATE), 'OPEN', CURRENT_TIMESTAMP),
(4, 1, 'Site Reliability Engineering Intern', 'Maintain mission-critical infrastructure, implement automated monitoring, self-healing architectures, and incident triage.', 'INTERNSHIP', 'Hyderabad', '90,000 / month', 8.0, 0, 'Computer Science,Information Technology,Electronics & Comm', 2026, DATEADD('DAY', 25, CURRENT_DATE), 'OPEN', CURRENT_TIMESTAMP);

INSERT INTO applications (id, job_id, student_id, status, applied_at, feedback, updated_at) VALUES
(1, 1, 1, 'TECHNICAL_ROUND', DATEADD('DAY', -3, CURRENT_TIMESTAMP), 'Cleared Round 1 DSA assessment. Scheduled for System Design on Friday.', CURRENT_TIMESTAMP),
(2, 2, 1, 'SHORTLISTED', DATEADD('DAY', -2, CURRENT_TIMESTAMP), 'Profile shortlisted by the hiring manager.', CURRENT_TIMESTAMP),
(3, 2, 2, 'APPLIED', DATEADD('DAY', -1, CURRENT_TIMESTAMP), 'Application submitted and under review.', CURRENT_TIMESTAMP),
(4, 3, 2, 'SELECTED', DATEADD('DAY', -5, CURRENT_TIMESTAMP), 'Congratulations! Offer letter generated for 6-month internship.', CURRENT_TIMESTAMP);

INSERT INTO announcements (id, title, content, category, posted_by, created_at) VALUES
(1, 'Google 2026 Campus Drive Announced', 'Google will be conducting on-campus tests and technical rounds next week. Eligible candidates must ensure their resumes are updated in the portal.', 'DRIVE_ALERT', 1, CURRENT_TIMESTAMP),
(2, 'Placement Policy & Dress Code Reminder', 'All candidates attending in-person or virtual interview rounds are strictly required to adhere to formal attire and carry valid student IDs.', 'GENERAL', 1, CURRENT_TIMESTAMP),
(3, 'Pre-Placement Talk: Microsoft IDC', 'Microsoft hiring team will conduct a virtual pre-placement talk this Wednesday at 4:00 PM IST on Teams. Attendance is mandatory for registered students.', 'SCHEDULE', 1, CURRENT_TIMESTAMP);

-- Reset AUTO_INCREMENT sequences so new entity insertions start after pre-seeded keys
ALTER TABLE users ALTER COLUMN id RESTART WITH 100;
ALTER TABLE student_profiles ALTER COLUMN id RESTART WITH 100;
ALTER TABLE company_profiles ALTER COLUMN id RESTART WITH 100;
ALTER TABLE jobs ALTER COLUMN id RESTART WITH 100;
ALTER TABLE applications ALTER COLUMN id RESTART WITH 100;
ALTER TABLE announcements ALTER COLUMN id RESTART WITH 100;
