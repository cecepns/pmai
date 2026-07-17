# Panduan Migrasi Database SQL - PMAI

Folder ini menyimpan berkas-berkas migrasi database untuk mencatat dan menerapkan perubahan skema tabel secara berkala tanpa merusak data yang sudah ada di production.

## Konvensi Naming
Nama file migrasi wajib menggunakan penomoran urut agar eksekusi perubahan skema teratur, dengan format:
`XXXX_nama_perubahan.sql`

Contoh:
- `0001_init.sql` (Inisiasi awal tabel)
- `0002_add_avatar_to_assessors.sql` (Menambah kolom avatar)

## Cara Menerapkan Migrasi
Apabila Anda menambahkan fitur baru yang membutuhkan perubahan tabel MySQL, buat berkas SQL baru di folder `sql/migrations/` ini, lalu jalankan di terminal MySQL Anda:
```bash
mysql -u [username] -p pmai_db < sql/migrations/XXXX_nama_perubahan.sql
```

Selalu gunakan query yang aman seperti `ADD COLUMN IF NOT EXISTS` (jika didukung) atau buat skrip alter yang aman agar tidak memicu kegagalan build.
