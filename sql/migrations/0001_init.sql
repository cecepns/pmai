-- Migration: 0001_init
-- Created At: 2026-07-16
-- Description: Initialize core tables for PMAI (admins, landing_content, assessors, messages)

USE pmai_db;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin: username='admin', password='admin123'
INSERT INTO admins (username, password) 
VALUES ('admin', '$2a$10$7zB3H5HkK1l81Fp6P2G4O.vKz8nQz165C/9mX/iUoD7cW5q78v94q')
ON DUPLICATE KEY UPDATE username=username;

-- 2. Landing Content Table
CREATE TABLE IF NOT EXISTS landing_content (
  content_key VARCHAR(50) PRIMARY KEY,
  content_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prepopulate landing page content
INSERT INTO landing_content (content_key, content_value) VALUES
('hero_title', 'Menuju Indonesia Emas dengan Asesor Kompeten'),
('hero_subtitle', 'Perkumpulan Master Asesor Indonesia (PMAI) bersinergi secara profesional mengembangkan kemampuan asesor untuk mendukung percepatan program Sistem Sertifikasi Nasional.'),
('about_text', 'Perkumpulan Master Asesor Indonesia (PMAI) merupakan organisasi yang bertujuan untuk mengembangkan kemampuan anggotanya dalam memberikan pelayanan kepada masyarakat umum, serta menjadi wadah bagi para anggota untuk saling bertukar keahlian dan mengayomi sesama dengan semangat Asah, Asih, dan Asuh.'),
('visi_text', 'Menjadi wadah perkumpulan Master Asesor Indonesia yang kompeten untuk mendukung program Sistem Sertifikasi Nasional.'),
('misi_items', '["Membangun dan mengembangkan kemampuan Master Asesor di seluruh wilayah Indonesia.","Menumbuhkembangkan profesi dengan kejelasan kerangka kualifikasi.","Memberikan pelayanan konsultasi berbasis teknologi informasi demi tercapainya Sistem Sertifikasi Nasional."]'),
('peran_items', '["Membantu pemerintah, khususnya Badan Nasional Sertifikasi, dalam mengembangkan Sistem Sertifikasi Nasional.","Membantu lembaga penyelenggara pendidikan dan pelatihan keahlian agar lulusannya memiliki kompetensi yang dibutuhkan oleh pasar kerja.","Membantu pemerintah dalam perumusan Standar Kompetensi Kerja Nasional Indonesia (SKKNI).","Membantu Lembaga Sertifikasi Profesi (LSP) pada sektor terkait dalam pengawasan pelaksanaan uji kompetensi."]')
ON DUPLICATE KEY UPDATE content_key=content_key;

-- 3. Assessors Table
CREATE TABLE IF NOT EXISTS assessors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  bidang VARCHAR(100) NOT NULL,
  provinsi VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  reg_no VARCHAR(100) NOT NULL UNIQUE,
  cv_file VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
