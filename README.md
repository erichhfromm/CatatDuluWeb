# CataDuluWeb

Aplikasi web manajemen keuangan dengan frontend React dan backend Laravel.

## Struktur Project

```
CataDuluWeb/
├── backend/                ← Laravel (PHP) — REST API
│   ├── app/
│   │   ├── Http/Controllers/   ← Controller API & Web
│   │   └── Models/             ← Model Eloquent
│   ├── database/migrations/    ← Migrasi database
│   ├── routes/api.php          ← Semua API routes
│   └── .env                    ← Konfigurasi backend (DB, Mail, dll)
│
└── frontend/               ← React + Vite (TypeScript)
    ├── src_react_backup/   ← Source code React utama
    │   ├── app/
    │   │   ├── components/     ← Komponen UI
    │   │   └── routes.tsx      ← Routing frontend
    │   ├── styles/             ← CSS global & Tailwind
    │   └── main.tsx            ← Entry point React
    ├── supabase/               ← Konfigurasi Supabase Edge Functions
    ├── index.html              ← HTML entry point Vite
    ├── vite.config.ts          ← Konfigurasi Vite
    └── package.json            ← Dependensi frontend
```

## Cara Menjalankan

### Backend (Laravel)
```bash
cd backend
php artisan serve
# Berjalan di http://localhost:8000
```

### Frontend (React/Vite)
```bash
cd frontend
npm run dev
# Berjalan di http://localhost:5173
```

## Catatan

- Source code React utama ada di `frontend/src_react_backup/`
- File original ada di `D:\src_react_backup\` (backup luar project)
- API backend berjalan di port **8000**, frontend di port **5173**
