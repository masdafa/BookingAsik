# BookingAsik - Aplikasi Pemesanan Hotel & Travel Fullstack

**BookingAsik** adalah platform aplikasi pemesanan perjalanan komprehensif yang dibangun menggunakan **MERN Stack** (MySQL, Express, React, Node.js). Proyek ini dirancang untuk mensimulasikan sistem *Online Travel Agent* (OTA) skala besar dengan fitur lengkap mulai dari pencarian, pemesanan, hingga manajemen properti oleh mitra.

## 🌟 Fitur Unggulan

### 1. Sistem Multi-Role & Hak Akses
Aplikasi ini memiliki sistem otentikasi dan otorisasi yang kompleks dengan peran pengguna yang berbeda:
*   **User (Pelanggan)**: Dapat mencari dan memesan Hotel, Pesawat, Mobil, dan Tiket Wisata. Memiliki fitur manajemen profil, riwayat pesanan (bookings), dan *wishlist*.
*   **Partner (Mitra Bisnis)**: Memiliki hak akses khusus untuk mendaftarkan dan mengelola aset mereka sendiri (Hotel, Maskapai, Rental Mobil, atau Obyek Wisata). Dilengkapi dashboard analitik pendapatan.
*   **Admin (Super Admin)**: Memiliki kontrol penuh atas sistem, verifikasi mitra, moderasi konten, dan manajemen user.
*   **Receptionist (Resepsionis Hotel)**: Fitur khusus untuk *staff* hotel melakukan *check-in* dan *check-out* tamu secara real-time.

### 2. Ekosistem Pemesanan Lengkap
Tidak hanya hotel, aplikasi ini mengintegrasikan 4 layanan utama dalam satu platform:
*   🏨 **Hotel**: Pencarian berdasarkan lokasi, filter harga/bintang, detail kamar, dan ulasan tamu.
*   ✈️ **Pesawat**: Pencarian penerbangan, pemilihan kursi (*seat selection*), dan manajemen maskapai.
*   🚗 **Rental Mobil**: Penyewaan mobil dengan opsi lepas kunci atau dengan supir.
*   🎡 **Atraksi Wisata**: Pemesanan tiket masuk tempat wisata.

### 3. Fitur Canggih Lainnya
*   **Multi-Bahasa (i18n)**: Mendukung penuh Bahasa Indonesia (ID) dan Inggris (EN), serta simulasi untuk bahasa ES, FR, DE, JP.
*   **Simulasi Pembayaran**: Mendukung simulasi pembayaran via QRIS, Virtual Account, dan Kartu Kredit dengan status *real-time*.
*   **Sistem Review & Rating**: Pengguna dapat memberikan ulasan dan rating setelah menyelesaikan pesanan.
*   **Program Loyalitas (Loyalty)**: Sistem poin dan tingkatan member (Silver, Gold, Platinum) berdasarkan transaksi.
*   **E-Ticket Generate**: Tiket digital otomatis terbit setelah pembayaran sukses.

---

## 🛠️ Teknologi yang Digunakan

*   **Frontend**: React.js, Material UI (MUI), Redux Toolkit (State Management), React Router, Axios, i18next (Multi-bahasa).
*   **Backend**: Node.js, Express.js (REST API).
*   **Database**: MySQL (Relational Database) dengan struktur tabel kompleks untuk menangani relasi booking.
*   **Keamanan**: JWT (JSON Web Tokens) untuk otentikasi, Bcrypt untuk hashing password.

---

## ⚙️ Panduan Instalasi & Jalankan (Clone)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

### Prasyarat
Pastikan Anda sudah menginstal:
*   [Node.js](https://nodejs.org/) (v14 ke atas)
*   [MySQL Server](https://dev.mysql.com/downloads/installer/) (XAMPP/WAMP juga bisa)
*   [Git](https://git-scm.com/)

### 1. Clone Repository
Buka terminal/CMD dan jalankan perintah:
```bash
git clone https://github.com/masdafa/BookingAsik.git
cd BookingAsik
```

### 2. Setup Database
1.  Buka klien MySQL Anda (phpMyAdmin, MySQL Workbench, atau HeidiSQL).
2.  Buat database baru dengan nama `hotel_db`.
    *   *Catatan: Jika ingin menggunakan nama lain, sesuaikan nanti di file .env backend.*
3.  Import file SQL yang sudah disediakan:
    *   Lokasi file: `backend/backup_hotel_app.sql`
    *   Import file ini ke dalam database `hotel_db` yang baru dibuat.
    *   *File ini berisi struktur tabel lengkap dan data *dummy* untuk pengujian.*

### 3. Setup Backend (Server)
```bash
cd backend

# Install semua dependensi (library)
npm install

# Konfigurasi Database (PENTING!)
# Pastikan file .env atau config database sesuai dengan user/password MySQL lokal Anda.
# Default config biasanya: user='root', password='', host='localhost'.

# Jalankan Server
npm start
```
*Server backend akan berjalan di port 4000 atau 5000 (sesuai log).*

### 4. Setup Frontend (Aplikasi Web)
Buka terminal baru (jangan matikan terminal backend):
```bash
# Pastikan Anda berada di root folder 'BookingAsik'
cd frontend

# Install dependensi frontend
npm install

# Jalankan Aplikasi
npm run dev
```
*Aplikasi akan terbuka otomatis di browser (biasanya http://localhost:3000).*

---

## 🔑 Akun Demo (Untuk Pengujian)

Anda bisa menggunakan akun-akun berikut untuk mencoba berbagai fitur role:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Partner (Hotel)** | `admin.hotel@gmail.com` | `123456` |
| **User** | *(Silakan daftar akun baru)* | *Bebas* |

*Catatan: Data login di atas berdasarkan dummy data default. Jika tidak bisa, silakan cek tabel `users` atau `hotel_admins` di database.*

---

## 🤝 Kontribusi

Proyek ini bersifat *open-source*. Jika Anda ingin berkontribusi:
1.  Fork repository ini.
2.  Buat branch fitur baru (`git checkout -b fitur-keren`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4.  Push ke branch tersebut (`git push origin fitur-keren`).
5.  Buat Pull Request di GitHub.

---

**Dibuat oleh Tim BookingAsik** 🚀
Untuk pertanyaan atau masalah, silakan buat *Issue* di GitHub.