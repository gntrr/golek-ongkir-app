# Golek Ongkir – Panduan Proyek (Mobile)

Dokumen ini melengkapi README bawaan tanpa mengubahnya. Gunakan panduan ini untuk setup, env, cara jalanin, dan integrasi backend Laravel.

## Ringkas
- Stack: React Native 0.80 + TypeScript, React Navigation, NativeWind (Tailwind v3), Axios.
- Integrasi: Aplikasi hanya memanggil backend (Laravel) via `API_BASE_URL`.
- Kunci RajaOngkir disimpan di backend, bukan di aplikasi.

## Prasyarat
- Node.js 18+ (direkomendasikan 18/20) dan Yarn 1.x
- Android Studio + emulator / Perangkat fisik Android
- (Opsional iOS) Xcode + CocoaPods pada macOS

## Setup & Menjalankan
1) Instal dependensi (sudah ada `node_modules` jika dari Codespaces, jalankan jika perlu):
```sh
# dari root repo
yarn
```

2) Konfigurasi environment:
- Salin `.env.example` menjadi `.env` lalu isi `API_BASE_URL`:
```env
API_BASE_URL=http://localhost:8000/api/v1
```
- Setelah mengubah `.env`, restart Metro bundler.

3) Menjalankan Metro:
```sh
yarn start
```

4) Menjalankan aplikasi:
- Android:
```sh
yarn android
```
- iOS (macOS):
```sh
bundle install
cd ios && bundle exec pod install && cd ..
yarn ios
```

## Variabel Lingkungan (App)
- `API_BASE_URL` (wajib): base URL backend, contoh `https://api.golekongkir.id/api/v1`.

Catatan: Aplikasi tidak lagi memanggil RajaOngkir langsung. Semua request dilakukan ke backend.

## Struktur DirektorI (Ringkas)
```
src/
  constants/        -> API_BASE_URL, konstanta lain
  services/
    backend.ts     -> client ke backend Laravel
  screens/
    Home.tsx       -> UI utama (origin, destination, weight, courier, results)
```

## Endpoint yang Digunakan (dari App ke Backend)
- `GET {API_BASE_URL}/provinces`
- `GET {API_BASE_URL}/cities?province=&q=`
- `POST {API_BASE_URL}/cost` body: `{ origin, destination, weight, courier }`

Spesifikasi lengkap backend ada di `BACKEND.md`.

## Styling (NativeWind / Tailwind)
- Tailwind v3 dengan NativeWind.
- `tailwind.config.js` sudah include `presets: [require('nativewind/preset')]`.
- `metro.config.js` memakai `withNativeWind` dan memuat `global.css`.
- Gunakan `className` pada komponen RN.

## Skrip Penting
```json
"start": "react-native start",
"android": "react-native run-android",
"ios": "react-native run-ios",
"lint": "eslint .",
"test": "jest"
```

## Troubleshooting
- Error: "Tailwind CSS has not been configured with the NativeWind preset"
  - Pastikan `tailwind.config.js` ada `presets: [require('nativewind/preset')]`.
  - Restart Metro: stop proses lalu jalankan `yarn start` lagi.
- Perubahan `.env` tidak terdeteksi
  - Stop Metro dan jalankan lagi. (Babel inline dotenv memerlukan restart bundler).
- Android gagal build
  - Pastikan emulator aktif atau perangkat terhubung; jalankan `adb devices` untuk cek.

## Catatan Keamanan
- Jangan menaruh kunci API (RajaOngkir) di aplikasi. Simpan di backend dan panggil via endpoint backend.

## Roadmap (Opsional)
- Tambah caching lokal pada app (mis. province/cities) jika diperlukan.
- Tambah validasi input UI (courier, berat minimal).
- Tambah test/mocks RN untuk Jest.
