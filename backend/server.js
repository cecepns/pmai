const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "PMAI_SECRET_JWT_KEY_2026";

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists: 'uploads-pmai'
const uploadDirName = "uploads-pmai";
const uploadPath = path.join(__dirname, uploadDirName);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
app.use("/uploads", express.static(uploadPath));

// MySQL Connection Pool Setup with dynamic fallbacks
let pool;
let useLocalMock = false;

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pmai_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function initDB() {
  try {
    pool = mysql.createPool(dbConfig);
    // Test connection
    const conn = await pool.getConnection();
    console.log("MySQL Database Connected successfully to:", dbConfig.database);
    conn.release();
  } catch (err) {
    console.error("MySQL connection failed. Running server in local-mock database mode. Details:", err.message);
    useLocalMock = true;
  }
}
initDB();

// =========================================================================
// MOCK FALLBACK IN-MEMORY DB (For presentation if MySQL server is not active)
// =========================================================================
let mockContent = {
  hero_title: "Menuju Indonesia Emas dengan Asesor Kompeten",
  hero_subtitle: "Perkumpulan Master Asesor Indonesia (PMAI) bersinergi secara profesional mengembangkan kemampuan asesor untuk mendukung percepatan program Sistem Sertifikasi Nasional.",
  about_text: "Perkumpulan Master Asesor Indonesia (PMAI) merupakan organisasi yang bertujuan untuk mengembangkan kemampuan anggotanya dalam memberikan pelayanan kepada masyarakat umum, serta menjadi wadah bagi para anggota untuk saling bertukar keahlian dan mengayomi sesama dengan semangat Asah, Asih, dan Asuh.",
  visi_text: "Menjadi wadah perkumpulan Master Asesor Indonesia yang kompeten untuk mendukung program Sistem Sertifikasi Nasional.",
  misi_items: JSON.stringify([
    "Membangun dan mengembangkan kemampuan Master Asesor di seluruh wilayah Indonesia.",
    "Menumbuhkembangkan profesi dengan kejelasan kerangka kualifikasi.",
    "Memberikan pelayanan konsultasi berbasis teknologi informasi demi tercapainya Sistem Sertifikasi Nasional."
  ]),
  peran_items: JSON.stringify([
    "Membantu pemerintah, khususnya Badan Nasional Sertifikasi, dalam mengembangkan Sistem Sertifikasi Nasional.",
    "Membantu lembaga penyelenggara pendidikan dan pelatihan keahlian agar lulusannya memiliki kompetensi yang dibutuhkan oleh pasar kerja.",
    "Membantu pemerintah dalam perumusan Standar Kompetensi Kerja Nasional Indonesia (SKKNI).",
    "Membantu Lembaga Sertifikasi Profesi (LSP) pada sektor terkait dalam pengawasan pelaksanaan uji kompetensi."
  ]),
  tujuan_items: JSON.stringify([
    "Menjadi mitra pemerintah, khususnya Badan Nasional Sertifikasi, dalam mengembangkan Sistem Sertifikasi Nasional.",
    "Mewujudkan profesionalisme anggota yang memiliki disiplin, dedikasi, loyalitas, serta kompetensi di bidangnya sehingga mampu menghadapi persaingan dan memanfaatkan peluang di era globalisasi.",
    "Menjadi wadah komunikasi dan konsultasi antaranggota maupun antara anggota dengan masyarakat.",
    "Menjadi wadah bagi para Master Asesor untuk meningkatkan kemampuan dalam memberikan pelayanan kepada masyarakat.",
    "Menerapkan semangat Asah, Asih, dan Asuh di antara seluruh anggota perkumpulan."
  ])
};

let mockAssessors = [
  { id: "MA-001", name: "Dr. H. Anang Kosasih, M.T.", bidang: "Sertifikasi & Lisensi", provinsi: "Jawa Barat", status: "Aktif", phone: "08123456789", email: "anang@pmai.or.id", reg_no: "REG.MET.2021.00192", cv_file: null },
  { id: "MA-002", name: "Prof. Dr. Rini Setyowati, M.Si.", bidang: "Pendidikan & Pelatihan", provinsi: "DKI Jakarta", status: "Aktif", phone: "08123456790", email: "rini@pmai.or.id", reg_no: "REG.MET.2020.00281", cv_file: null },
  { id: "MA-003", name: "Ir. Bambang Pamungkas, M.M.", bidang: "Teknik & Rekayasa", provinsi: "Banten", status: "Aktif", phone: "08123456791", email: "bambang@pmai.or.id", reg_no: "REG.MET.2019.00482", cv_file: null },
  { id: "MA-004", name: "Dr. Eko Prasetyo, M.Kom.", bidang: "Teknologi Informasi", provinsi: "Jawa Timur", status: "Aktif", phone: "08123456792", email: "eko@pmai.or.id", reg_no: "REG.MET.2022.00391", cv_file: null },
  { id: "MA-005", name: "Dian Lestari, S.E., M.B.A.", bidang: "Bisnis & Manajemen", provinsi: "Jawa Tengah", status: "Aktif", phone: "08123456793", email: "dian@pmai.or.id", reg_no: "REG.MET.2021.00981", cv_file: null }
];

let mockMessages = [
  { id: 1, name: "Rizky Pratama", email: "rizky.p@gmail.com", subject: "Tanya Keanggotaan", message: "Bagaimana alur pendaftaran untuk menjadi Master Asesor jika sertifikat dikeluarkan oleh Kemenaker?", is_read: false, created_at: new Date() },
  { id: 2, name: "Dewi Lestari", email: "dewi.lestari@yahoo.com", subject: "Permohonan Kemitraan", message: "Kami dari LSP Informatika ingin mengajukan kemitraan peminjaman asesor bidang Artificial Intelligence.", is_read: true, created_at: new Date() }
];

let mockActivities = [
  { id: 1, title: "Rapat Kerja Nasional 2025", description: "Diskusi strategis mengenai pengembangan kompetensi asesor di tingkat nasional.", image: null, created_at: new Date() },
  { id: 2, title: "Pelatihan Sertifikasi Asesor", description: "Pelatihan intensif untuk calon asesor baru di Jakarta.", image: null, created_at: new Date() }
];

// =========================================================================
// AUTHENTICATION INTERCEPTOR MIDDLEWARE
// =========================================================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) return res.status(401).json({ success: false, message: "Token otorisasi diperlukan." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Sesi kedaluwarsa atau token tidak valid." });
    req.user = user;
    next();
  });
}

// =========================================================================
// FILE UPLOAD SETUP (Multer Configuration)
// =========================================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "cv-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Hanya berkas format PDF yang diperbolehkan!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "activity-" + uniqueSuffix + ext);
  }
});

const uploadImage = multer({
  storage: storageImage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya berkas gambar (JPG, PNG, dll) yang diperbolehkan!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// =========================================================================
// REST API ENDPOINTS
// =========================================================================

// --- 1. Content Endpoints ---
app.get("/api/content", async (req, res) => {
  if (useLocalMock) {
    return res.json({ success: true, data: mockContent });
  }
  try {
    const [rows] = await pool.query("SELECT * FROM landing_content");
    const content = {};
    rows.forEach(row => {
      content[row.content_key] = row.content_value;
    });
    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/content", authenticateToken, async (req, res) => {
  const contents = req.body;
  if (useLocalMock) {
    Object.keys(contents).forEach(key => {
      mockContent[key] = typeof contents[key] === "string" ? contents[key] : JSON.stringify(contents[key]);
    });
    return res.json({ success: true, message: "Konten berhasil diperbarui (Simulasi)." });
  }
  try {
    for (const key in contents) {
      let value = contents[key];
      if (typeof value !== "string") {
        value = JSON.stringify(value);
      }
      await pool.query(
        "INSERT INTO landing_content (content_key, content_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_value = ?",
        [key, value, value]
      );
    }
    res.json({ success: true, message: "Konten landing page berhasil diperbarui." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 2. Admin Auth Endpoints ---
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Harap isi username dan password." });
  }

  if (useLocalMock) {
    // Fallback login
    if (username === "admin" && password === "admin123") {
      const token = jwt.sign({ id: 1, username: "admin" }, JWT_SECRET, { expiresIn: "2h" });
      return res.json({ success: true, token, username: "admin" });
    }
    return res.status(400).json({ success: false, message: "Kredensial login admin tidak sesuai." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM admins WHERE username = ?", [username]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Kredensial login admin tidak sesuai." });
    }
    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Kredensial login admin tidak sesuai." });
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ success: true, token, username: admin.username });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/auth/profile", authenticateToken, (req, res) => {
  res.json({ success: true, admin: req.user });
});

// --- 3. Assessors Endpoints (Fully supporting GET Pagination, Search, Limits, Sorting, and Filters) ---
app.get("/api/assessors", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const bidang = req.query.bidang || "Semua";
  const sortBy = req.query.sortBy || "name";
  const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";
  const offset = (page - 1) * limit;

  // Sanitize sort parameters to prevent SQL injection
  const allowedSortFields = ["id", "name", "bidang", "provinsi", "status", "created_at"];
  const finalSortField = allowedSortFields.includes(sortBy) ? sortBy : "name";

  if (useLocalMock) {
    let list = [...mockAssessors];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.id.toLowerCase().includes(q) || 
        item.provinsi.toLowerCase().includes(q)
      );
    }
    if (bidang !== "Semua") {
      list = list.filter(item => item.bidang === bidang);
    }
    list.sort((a, b) => {
      let valA = (a[finalSortField] || "").toString().toLowerCase();
      let valB = (b[finalSortField] || "").toString().toLowerCase();
      if (valA < valB) return sortOrder === "ASC" ? -1 : 1;
      if (valA > valB) return sortOrder === "ASC" ? 1 : -1;
      return 0;
    });

    const paginatedData = list.slice(offset, offset + limit);
    return res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: list.length,
        totalPages: Math.ceil(list.length / limit)
      }
    });
  }

  try {
    let queryParams = [];
    let whereClauses = [];

    if (search) {
      whereClauses.push("(name LIKE ? OR id LIKE ? OR provinsi LIKE ?)");
      const term = `%${search}%`;
      queryParams.push(term, term, term);
    }

    if (bidang && bidang !== "Semua") {
      whereClauses.push("bidang = ?");
      queryParams.push(bidang);
    }

    const whereSql = whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

    // Count query
    const [totalRows] = await pool.query(
      `SELECT COUNT(*) as count FROM assessors ${whereSql}`,
      queryParams
    );
    const total = totalRows[0].count;

    // Data query (secure parameters used)
    const sql = `SELECT * FROM assessors ${whereSql} ORDER BY ${finalSortField} ${sortOrder} LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(sql, [...queryParams, limit, offset]);

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Membership Register endpoint supporting PDF upload
app.post("/api/membership/register", (req, res) => {
  upload.single("cvFile")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { name, email, phone, regNo, bidang, provinsi } = req.body;
    
    // Server-side validation
    if (!name || !email || !phone || !regNo) {
      return res.status(400).json({ success: false, message: "Harap isi semua kolom wajib." });
    }

    const cvFilename = req.file ? req.file.filename : null;

    if (useLocalMock) {
      const generatedId = "MA-" + String(mockAssessors.length + 1).padStart(3, "0");
      const newAssessor = {
        id: generatedId,
        name,
        email,
        phone,
        reg_no: regNo,
        bidang,
        provinsi,
        status: "Pending",
        cv_file: cvFilename,
        created_at: new Date()
      };
      mockAssessors.push(newAssessor);
      return res.json({
        success: true,
        message: "Pendaftaran sebagai Master Asesor berhasil dikirim dan berstatus Pending.",
        data: newAssessor
      });
    }

    try {
      // Check if registration number already registered
      const [exists] = await pool.query("SELECT id FROM assessors WHERE reg_no = ?", [regNo]);
      if (exists.length > 0) {
        return res.status(400).json({ success: false, message: "Nomor Registrasi MET sudah terdaftar." });
      }

      // Generate a new ID based on current total count
      const [countResult] = await pool.query("SELECT COUNT(*) as count FROM assessors");
      const generatedId = "MA-" + String(countResult[0].count + 1).padStart(3, "0");

      await pool.query(
        "INSERT INTO assessors (id, name, bidang, provinsi, status, phone, email, reg_no, cv_file) VALUES (?, ?, ?, ?, 'Pending', ?, ?, ?, ?)",
        [generatedId, name, bidang, provinsi, phone, email, regNo, cvFilename]
      );

      res.json({
        success: true,
        message: "Pendaftaran sebagai Master Asesor berhasil diajukan dan berstatus Pending.",
        data: { id: generatedId, name, regNo }
      });
    } catch (dbErr) {
      res.status(500).json({ success: false, error: dbErr.message });
    }
  });
});

app.put("/api/assessors/:id/verify", authenticateToken, async (req, res) => {
  const { status } = req.body;
  const assessorId = req.params.id;

  if (!["Pending", "Aktif", "Nonaktif"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status tidak valid." });
  }

  if (useLocalMock) {
    const idx = mockAssessors.findIndex(item => item.id === assessorId);
    if (idx === -1) return res.status(404).json({ success: false, message: "Asesor tidak ditemukan." });
    mockAssessors[idx].status = status;
    return res.json({ success: true, message: `Status Asesor berhasil diubah menjadi ${status}.` });
  }

  try {
    const [result] = await pool.query("UPDATE assessors SET status = ? WHERE id = ?", [status, assessorId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Asesor tidak ditemukan." });
    }
    res.json({ success: true, message: `Status Asesor berhasil diubah menjadi ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/assessors/:id", authenticateToken, async (req, res) => {
  const assessorId = req.params.id;

  if (useLocalMock) {
    const idx = mockAssessors.findIndex(item => item.id === assessorId);
    if (idx === -1) return res.status(404).json({ success: false, message: "Asesor tidak ditemukan." });
    mockAssessors.splice(idx, 1);
    return res.json({ success: true, message: "Asesor berhasil dihapus." });
  }

  try {
    const [result] = await pool.query("DELETE FROM assessors WHERE id = ?", [assessorId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Asesor tidak ditemukan." });
    }
    res.json({ success: true, message: "Asesor berhasil dihapus." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 4. Contact / Message Endpoints ---
app.post("/api/contact/submit", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Semua kolom form wajib diisi." });
  }

  if (useLocalMock) {
    const newMessage = { id: mockMessages.length + 1, name, email, subject, message, is_read: false, created_at: new Date() };
    mockMessages.push(newMessage);
    return res.json({ success: true, message: "Pesan Anda berhasil dikirim!" });
  }

  try {
    await pool.query(
      "INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );
    res.json({ success: true, message: "Pesan Anda berhasil dikirim!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/messages", authenticateToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  if (useLocalMock) {
    const paginatedData = mockMessages.slice(offset, offset + limit);
    return res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockMessages.length,
        totalPages: Math.ceil(mockMessages.length / limit)
      }
    });
  }

  try {
    const [totalRows] = await pool.query("SELECT COUNT(*) as count FROM messages");
    const total = totalRows[0].count;

    const [rows] = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/messages/:id/read", authenticateToken, async (req, res) => {
  const msgId = req.params.id;

  if (useLocalMock) {
    const idx = mockMessages.findIndex(item => item.id == msgId);
    if (idx === -1) return res.status(404).json({ success: false, message: "Pesan tidak ditemukan." });
    mockMessages[idx].is_read = true;
    return res.json({ success: true, message: "Pesan ditandai telah dibaca." });
  }

  try {
    const [result] = await pool.query("UPDATE messages SET is_read = TRUE WHERE id = ?", [msgId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pesan tidak ditemukan." });
    }
    res.json({ success: true, message: "Pesan ditandai telah dibaca." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/messages/:id", authenticateToken, async (req, res) => {
  const msgId = req.params.id;

  if (useLocalMock) {
    const idx = mockMessages.findIndex(item => item.id == msgId);
    if (idx === -1) return res.status(404).json({ success: false, message: "Pesan tidak ditemukan." });
    mockMessages.splice(idx, 1);
    return res.json({ success: true, message: "Pesan berhasil dihapus." });
  }

  try {
    const [result] = await pool.query("DELETE FROM messages WHERE id = ?", [msgId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pesan tidak ditemukan." });
    }
    res.json({ success: true, message: "Pesan berhasil dihapus." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 5. Activities Endpoints ---
app.get("/api/activities", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  if (useLocalMock) {
    let list = [...mockActivities];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) || 
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => b.created_at - a.created_at);
    const paginatedData = list.slice(offset, offset + limit);
    return res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: list.length,
        totalPages: Math.ceil(list.length / limit)
      }
    });
  }

  try {
    let queryParams = [];
    let whereClause = "";

    if (search) {
      whereClause = "WHERE title LIKE ? OR description LIKE ?";
      const term = `%${search}%`;
      queryParams.push(term, term);
    }

    const [totalRows] = await pool.query(`SELECT COUNT(*) as count FROM activities ${whereClause}`, queryParams);
    const total = totalRows[0].count;

    const [rows] = await pool.query(
      `SELECT * FROM activities ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/activities", authenticateToken, (req, res) => {
  uploadImage.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    const { title, description } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Judul kegiatan wajib diisi." });

    const imageName = req.file ? req.file.filename : null;

    if (useLocalMock) {
      const newActivity = {
        id: mockActivities.length > 0 ? Math.max(...mockActivities.map(a => a.id)) + 1 : 1,
        title,
        description,
        image: imageName,
        created_at: new Date()
      };
      mockActivities.push(newActivity);
      return res.json({ success: true, message: "Kegiatan berhasil ditambahkan.", data: newActivity });
    }

    try {
      const [result] = await pool.query(
        "INSERT INTO activities (title, description, image) VALUES (?, ?, ?)",
        [title, description, imageName]
      );
      res.json({ success: true, message: "Kegiatan berhasil ditambahkan.", data: { id: result.insertId, title, image: imageName } });
    } catch (dbErr) {
      res.status(500).json({ success: false, error: dbErr.message });
    }
  });
});

app.put("/api/activities/:id", authenticateToken, (req, res) => {
  uploadImage.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    const { title, description } = req.body;
    const actId = req.params.id;
    const imageName = req.file ? req.file.filename : undefined;

    if (!title) return res.status(400).json({ success: false, message: "Judul kegiatan wajib diisi." });

    if (useLocalMock) {
      const idx = mockActivities.findIndex(a => a.id == actId);
      if (idx === -1) return res.status(404).json({ success: false, message: "Kegiatan tidak ditemukan." });
      
      mockActivities[idx].title = title;
      mockActivities[idx].description = description;
      if (imageName !== undefined) {
        mockActivities[idx].image = imageName;
      }
      return res.json({ success: true, message: "Kegiatan berhasil diperbarui." });
    }

    try {
      if (imageName !== undefined) {
        await pool.query(
          "UPDATE activities SET title = ?, description = ?, image = ? WHERE id = ?",
          [title, description, imageName, actId]
        );
      } else {
        await pool.query(
          "UPDATE activities SET title = ?, description = ? WHERE id = ?",
          [title, description, actId]
        );
      }
      res.json({ success: true, message: "Kegiatan berhasil diperbarui." });
    } catch (dbErr) {
      res.status(500).json({ success: false, error: dbErr.message });
    }
  });
});

app.delete("/api/activities/:id", authenticateToken, async (req, res) => {
  const actId = req.params.id;

  if (useLocalMock) {
    const idx = mockActivities.findIndex(a => a.id == actId);
    if (idx === -1) return res.status(404).json({ success: false, message: "Kegiatan tidak ditemukan." });
    mockActivities.splice(idx, 1);
    return res.json({ success: true, message: "Kegiatan berhasil dihapus." });
  }

  try {
    const [result] = await pool.query("DELETE FROM activities WHERE id = ?", [actId]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Kegiatan tidak ditemukan." });
    res.json({ success: true, message: "Kegiatan berhasil dihapus." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend build static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`PMAI REST API Server running on port ${PORT}`);
});
