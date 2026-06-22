# ParkirIn — Smart Mini-Parking Slot

Aplikasi mobile (React Native + Expo) untuk memantau status slot parkir mini secara real-time. Setiap slot dipantau oleh dua sensor — **Ultrasonik (VL53L0X)** yang dipasang di langit-langit untuk mendeteksi kendaraan masuk, dan **Proximity Induktif** yang dipasang di lantai pembatas untuk memverifikasi posisi plat/besi kendaraan. Status akhir tiap slot (kosong/terisi) ditampilkan dalam denah berwarna yang berubah otomatis saat data sensor masuk.

🔗 **Source code:** https://github.com/fmelvia23-creator/parkirln

---

## Anggota Tim & Pembagian Tugas

| Nama | Peran | Tugas |
|---|---|---|
| _Elang Aliyyu Hikma (0923040043) _ | UI/UX & State | Membangun denah slot parkir (warna Hijau = Kosong, Merah = Terisi), state filter pencarian per area (A/B), dan seluruh tampilan screen (Dashboard, History, Profile, Login). |
| _Farla Melvia Ramadhani (0923040042)_ | Integrasi Axios | Mengambil data tarif parkir & kuota harian dari MockAPI menggunakan Axios, lengkap dengan fallback agar UI tetap berjalan jika API belum tersedia. |
| _Muhammad falihuddin al farisi (0923040029)_ | Integrasi Firebase | Menghubungkan autentikasi pengguna (Firebase Authentication) dan menyiapkan struktur data sensor ke Firebase Realtime Database agar status slot dapat diperbarui secara real-time. |

> Catatan: ganti placeholder nama di atas sebelum dikumpulkan.

---

## Tentang Aplikasi

ParkirIn menyimulasikan sistem parkir mini berbasis sensor untuk dua area (A dan B). Setelah pengguna login, mereka dapat melihat denah parkir yang menunjukkan slot mana yang kosong/terisi, menyaring tampilan per area, melihat info tarif dan kuota harian, serta meninjau riwayat keluar-masuk kendaraan.

### API & Layanan yang Digunakan
- **Firebase Authentication** — autentikasi login pengguna dengan email & password.
- **Firebase Realtime Database** *(disiapkan, menyusul aktivasi penuh)* — sumber data status sensor (ultrasonik & proximity) secara real-time.
- **Axios + MockAPI** — pengambilan data tarif parkir per jam dan kuota harian.
- **React Navigation** (`native-stack` + `bottom-tabs`) — navigasi antar halaman Login, Dashboard, History, dan Profile.

---

## 3 Fitur Utama yang Didemokan

1. **Login dengan Firebase Authentication**
   Pengguna masuk menggunakan email & password yang terdaftar di Firebase. Terdapat validasi input dan pesan error yang jelas (email tidak valid, akun tidak ditemukan, kata sandi salah, dll).

2. **Denah Parkir Real-Time dengan Filter Area**
   Slot parkir ditampilkan dalam grid berwarna (hijau = kosong, merah = terisi) yang ter-update otomatis setiap ada perubahan status sensor. Pengguna dapat menyaring tampilan berdasarkan Area A, Area B, atau semua area sekaligus, lengkap dengan ringkasan statistik (jumlah kosong/terisi/total).

3. **Info Tarif & Kuota Harian via Axios**
   Kartu informasi menampilkan tarif parkir per jam dan kuota harian yang sudah terpakai, diambil dari MockAPI menggunakan Axios — termasuk mekanisme pull-to-refresh untuk memperbarui data secara manual.

---

## Cara Menjalankan

```bash
npm install
npx expo start -c
```

Scan QR code yang muncul menggunakan aplikasi **Expo Go** di HP (Android/iOS), pastikan versi Expo Go sesuai dengan SDK yang digunakan project ini (Expo SDK 54).

### Konfigurasi Firebase
Sebelum login dapat berfungsi, isi kredensial Firebase asli di `services/firebaseConfig.js`, lalu daftarkan minimal satu user di **Firebase Console → Authentication → Users**.
