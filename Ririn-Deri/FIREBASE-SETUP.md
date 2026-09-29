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
