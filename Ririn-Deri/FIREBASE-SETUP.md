# Firebase Realtime Database untuk Ucapan

Website ini memakai Firebase Realtime Database hanya untuk bagian **Ucapan**. Foto, CSS, JS, dan musik tetap dilayani GitHub Pages. Firebase Web config boleh berada di frontend; yang harus dijaga adalah Security Rules.

## 1. Buat project Firebase
1. Buka Firebase Console.
2. Buat project baru.
3. Tambahkan Web App (`</>`).
4. Salin `firebaseConfig`.

## 2. Aktifkan Realtime Database
Masuk ke **Build → Realtime Database → Create Database**. Pilih lokasi database.

## 3. Masukkan config
Buka `assets/js/firebase-config.js`, lalu ganti semua nilai `PASTE_...` dengan config dari Firebase.

## 4. Security Rules
Buka tab **Rules** di Realtime Database dan gunakan isi `firebase-rules.json` dari folder ini. Rules tersebut hanya membuka path `/wishes`, membatasi panjang nama/ucapan, dan mewajibkan timestamp.

## 5. Deploy
Upload `index.html`, `assets/js/app.js`, folder `foto/`, `music/`, dan file CSS ke GitHub seperti biasa.

### Catatan
Jangan memasukkan Service Account key ke website. Config web Firebase yang terlihat di browser bukan password. Jangan menambahkan Cloud Functions atau Billing hanya untuk fitur ucapan ini.


## 4.5 Aktifkan admin RSVP

Admin RSVP tersedia di `admin.html` dan menggunakan **Google Sign-In**. Tidak ada akun/password admin khusus yang perlu dibuat.

1. Di Firebase Console buka **Authentication → Sign-in method → Google** dan pastikan statusnya **Enabled**.
2. Pastikan domain tempat `admin.html` di-host sudah ada di **Authentication → Settings → Authorized domains**.
3. Buka `admin.html`, lalu klik **Masuk dengan Google** menggunakan akun Google yang ingin dipakai klien.
4. Data RSVP dari tamu akan masuk ke path `/rsvps`.
5. Rules pada `firebase-rules.json` membuat `/rsvps` tetap bisa ditulis oleh tamu, tetapi pembacaan dashboard hanya tersedia saat ada sesi Google yang terautentikasi dan sebelum batas waktu admin.
6. Akses dashboard ditutup otomatis **4 November 2026 pukul 14.00 WIB**, yaitu 10 hari setelah waktu selesai resepsi pada 25 Oktober 2026 pukul 14.00 WIB.

Admin bisa memfilter data, mengunduh CSV yang kompatibel dengan Excel, atau mencetak tabel.
