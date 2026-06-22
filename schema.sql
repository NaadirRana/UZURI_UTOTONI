-- ==========================================
-- 1. INDEPENDENT TABLES (No Foreign Keys)
-- ==========================================

CREATE TABLE IF NOT EXISTS parent (
    parent_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hospital_ward (
    ward_id INT AUTO_INCREMENT PRIMARY KEY,
    ward_name VARCHAR(100) NOT NULL,
    ward_type VARCHAR(50),
    capacity INTEGER,
    location VARCHAR(100)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS nurse (
    nurse_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS administrator (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- ==========================================
-- 2. CORE DEPENDENT TABLES (Infant Core)
-- ==========================================

CREATE TABLE IF NOT EXISTS infant (
    infant_id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    birth_weight DECIMAL(5,2) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parent(parent_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- 3. MEDICAL & LOGISTICAL RELATIONSHIP TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS admission (
    admission_id INT AUTO_INCREMENT PRIMARY KEY,
    infant_id INT NOT NULL,
    parent_id INT NOT NULL,
    ward_id INT NOT NULL,
    admission_date DATE NOT NULL,
    discharge_date DATE,
    admission_status VARCHAR(30),
    FOREIGN KEY (infant_id) REFERENCES infant(infant_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parent(parent_id) ON DELETE CASCADE,
    FOREIGN KEY (ward_id) REFERENCES hospital_ward(ward_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    infant_id INT NOT NULL,
    doctor_id INT NOT NULL,
    requested_by_parent INT NOT NULL, -- Boolean/Integer indicator in ERD
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(30),
    FOREIGN KEY (infant_id) REFERENCES infant(infant_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS diagnosis (
    diagnosis_id INT AUTO_INCREMENT PRIMARY KEY,
    infant_id INT NOT NULL,
    doctor_id INT NOT NULL,
    diagnosis_details TEXT NOT NULL,
    diagnosis_date DATE NOT NULL,
    FOREIGN KEY (infant_id) REFERENCES infant(infant_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS treatment (
    treatment_id INT AUTO_INCREMENT PRIMARY KEY,
    diagnosis_id INT NOT NULL,
    prescription TEXT NOT NULL,
    treatment_date DATE NOT NULL,
    FOREIGN KEY (diagnosis_id) REFERENCES diagnosis(diagnosis_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- 4. CLINICAL CLINIC LOGS (Nurses & Tracking)
-- ==========================================

CREATE TABLE IF NOT EXISTS vaccination_record (
    vaccination_id INT AUTO_INCREMENT PRIMARY KEY,
    infant_id INT NOT NULL,
    nurse_id INT NOT NULL,
    vaccine_name VARCHAR(100) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    remarks TEXT,
    FOREIGN KEY (infant_id) REFERENCES infant(infant_id) ON DELETE CASCADE,
    FOREIGN KEY (nurse_id) REFERENCES nurse(nurse_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS feeding_record (
    feeding_id INT AUTO_INCREMENT PRIMARY KEY,
    infant_id INT NOT NULL,
    nurse_id INT NOT NULL,
    feeding_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feeding_notes TEXT,
    FOREIGN KEY (infant_id) REFERENCES infant(infant_id) ON DELETE CASCADE,
    FOREIGN KEY (nurse_id) REFERENCES nurse(nurse_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS growth_record (
    growth_id INT AUTO_INCREMENT PRIMARY KEY,
    infant_id INT NOT NULL,
    nurse_id INT NOT NULL,
    height_cm DECIMAL(5,2) NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    record_date DATE NOT NULL,
    FOREIGN KEY (infant_id) REFERENCES infant(infant_id) ON DELETE CASCADE,
    FOREIGN KEY (nurse_id) REFERENCES nurse(nurse_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- 5. ADMINISTRATIVE & ENGAGEMENT TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    feedback_details TEXT NOT NULL,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parent(parent_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    activity TEXT NOT NULL,
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    FOREIGN KEY (admin_id) REFERENCES administrator(admin_id) ON DELETE CASCADE
) ENGINE=InnoDB;