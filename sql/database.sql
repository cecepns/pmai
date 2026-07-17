-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS pmai_db;
USE pmai_db;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- bcrypt hashed password
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin: username='admin', password='admin123' (hashed)
-- Bcrypt hash of 'admin123' is $2a$10$7zB3H5HkK1l81Fp6P2G4O.vKz8nQz165C/9mX/iUoD7cW5q78v94q
INSERT INTO admins (username, password) 
VALUES ('admin', '$2a$10$7zB3H5HkK1l81Fp6P2G4O.vKz8nQz165C/9mX/iUoD7cW5q78v94q')
ON DUPLICATE KEY UPDATE username=username;

-- 2. Landing Content Table (for managing dynamic sections)
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
  id VARCHAR(50) PRIMARY KEY, -- e.g. MA-001
  name VARCHAR(150) NOT NULL,
  bidang VARCHAR(100) NOT NULL,
  provinsi VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending', -- Pending / Aktif / Nonaktif
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  reg_no VARCHAR(100) NOT NULL UNIQUE,
  cv_file VARCHAR(255), -- file name/path
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Mock Assessors
INSERT INTO assessors (id, name, bidang, provinsi, status, phone, email, reg_no, cv_file) VALUES
('MA-001', 'Dr. H. Anang Kosasih, M.T.', 'Sertifikasi & Lisensi', 'Jawa Barat', 'Aktif', '08123456789', 'anang@pmai.or.id', 'REG.MET.2021.00192', NULL),
('MA-002', 'Prof. Dr. Rini Setyowati, M.Si.', 'Pendidikan & Pelatihan', 'DKI Jakarta', 'Aktif', '08123456790', 'rini@pmai.or.id', 'REG.MET.2020.00281', NULL),
('MA-003', 'Ir. Bambang Pamungkas, M.M.', 'Teknik & Rekayasa', 'Banten', 'Aktif', '08123456791', 'bambang@pmai.or.id', 'REG.MET.2019.00482', NULL),
('MA-004', 'Dr. Eko Prasetyo, M.Kom.', 'Teknologi Informasi', 'Jawa Timur', 'Aktif', '08123456792', 'eko@pmai.or.id', 'REG.MET.2022.00391', NULL),
('MA-005', 'Dian Lestari, S.E., M.B.A.', 'Bisnis & Manajemen', 'Jawa Tengah', 'Aktif', '08123456793', 'dian@pmai.or.id', 'REG.MET.2021.00981', NULL),
('MA-006', 'Dr. Hendra Wijaya, M.Si.', 'Sosial & Kemasyarakatan', 'Bali', 'Aktif', '08123456794', 'hendra@pmai.or.id', 'REG.MET.2020.00512', NULL),
('MA-007', 'Dr. Maria Ulfa, M.Hum.', 'Pendidikan & Pelatihan', 'Sumatera Utara', 'Aktif', '08123456795', 'maria@pmai.or.id', 'REG.MET.2018.00782', NULL),
('MA-008', 'Rahmat Hidayat, S.T., M.T.', 'Manufaktur & Industri', 'Jawa Barat', 'Aktif', '08123456796', 'rahmat@pmai.or.id', 'REG.MET.2021.00651', NULL),
('MA-009', 'H. Achmad Yani, S.E.', 'Keuangan & Akuntansi', 'DKI Jakarta', 'Aktif', '08123456797', 'achmad@pmai.or.id', 'REG.MET.2020.00311', NULL),
('MA-010', 'Dr. Siti Aminah, M.Pd.', 'Pendidikan & Pelatihan', 'DI Yogyakarta', 'Aktif', '08123456798', 'siti@pmai.or.id', 'REG.MET.2019.00913', NULL),
('MA-011', 'Taufik Hidayat, S.Kom., M.T.', 'Teknologi Informasi', 'Jawa Barat', 'Aktif', '08123456799', 'taufik@pmai.or.id', 'REG.MET.2022.00181', NULL),
('MA-012', 'Dr. Ir. Gunawan, M.Si.', 'Bisnis & Manajemen', 'Sulawesi Selatan', 'Aktif', '08123456800', 'gunawan@pmai.or.id', 'REG.MET.2021.00742', NULL)
ON DUPLICATE KEY UPDATE id=id;

-- 4. Messages Table (Inbox)
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mock Inbox Messages
INSERT INTO messages (name, email, subject, message) VALUES
('Rizky Pratama', 'rizky.p@gmail.com', 'Tanya Keanggotaan', 'Bagaimana alur pendaftaran untuk menjadi Master Asesor jika sertifikat dikeluarkan oleh Kemenaker?'),
('Dewi Lestari', 'dewi.lestari@yahoo.com', 'Permohonan Kemitraan', 'Kami dari LSP Informatika ingin mengajukan kemitraan peminjaman asesor bidang Artificial Intelligence.'),
('Ahmad Fauzan', 'ahmad.f@outlook.com', 'Undangan Rapat Pleno', 'Mengundang jajaran pengurus PMAI dalam rapat penyusunan draf SKKNI sektor konstruksi.')
ON DUPLICATE KEY UPDATE id=id;
