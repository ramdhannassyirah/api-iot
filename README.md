# Monitoring API

API untuk data realtime alat **AWLR** (Automatic Water Level Recorder), **AWS** (Automatic Weather Station), dan **ARR** (Automatic Rainfall Recorder), dibangun dengan Express.js.

## Teknologi

Node.js 20+, Express 5, PostgreSQL, JWT, bcryptjs, Zod, google-auth-library.

## Instalasi

```bash
npm install
cp .env.example .env     # lalu isi nilainya
npm run migrate          # membuat tabel database
npm run dev              # mode development (auto-reload)
```

Untuk production: `npm start`.

Cek server berjalan di `http://localhost:3000/health`.

## Konfigurasi (.env)

| Variabel | Keterangan | Default |
|---|---|---|
| `NODE_ENV` | `development` atau `production` | `development` |
| `PORT` | Port server | `3000` |
| `CORS_ORIGIN` | Origin yang diizinkan | `*` |
| `DATABASE_URL` | Koneksi PostgreSQL | (wajib) |
| `JWT_ACCESS_SECRET` | Secret untuk access token | (wajib) |
| `JWT_ACCESS_EXPIRES_IN` | Umur access token | `15m` |
| `REFRESH_TOKEN_TTL_DAYS` | Umur refresh token (hari) | `7` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID dari Google Cloud Console | (kosong) |

Membuat secret acak:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Endpoint

Base URL: `/api`

### Auth

| Method | Path | Body | Keterangan |
|---|---|---|---|
| POST | `/auth/register` | `name`, `email`, `password` | Daftar akun |
| POST | `/auth/login` | `email`, `password` | Login |
| POST | `/auth/google` | `idToken` | Login dengan Google |
| POST | `/auth/refresh` | `refreshToken` | Tukar refresh token dengan token baru |
| POST | `/auth/logout` | `refreshToken` | Cabut refresh token |
| GET | `/auth/me` | - | Profil user (header `Authorization: Bearer <accessToken>`) |

Response login/register:

```json
{
  "user": { "id": "...", "name": "...", "email": "...", "role": "user" },
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer"
}
```

### Data alat (belum diimplementasikan)

`/awlr`, `/aws`, `/arr`

## Login Google

Backend menerima `idToken` yang didapat klien dari Google Sign-In, lalu memverifikasinya ke Google. Untuk mengetes tanpa frontend, ambil `id_token` lewat [OAuth Playground](https://developers.google.com/oauthplayground) (gunakan Client ID dan Secret milik sendiri, scope `openid email profile`), lalu kirim ke `POST /auth/google`.

Catatan: pada OAuth client bertipe **Web application**, tambahkan `https://developers.google.com/oauthplayground` ke Authorized redirect URIs.

## Struktur Proyek

```
src/
├── server.js              # entry point
├── app.js                 # konfigurasi Express
├── config/                # membaca .env
├── database/              # koneksi pool, migrasi SQL
├── middlewares/           # validate, notFound, errorHandler
├── modules/
│   ├── auth/              # routes, controller, service, token, google
│   └── users/             # repository user
├── routes/                # gabungan route /api/v1
└── utils/                 # AppError
```

Modul baru ditambahkan di `src/modules/` dengan pola yang sama (routes, controller, service, repository), lalu didaftarkan di `src/routes/index.js`.

## Role

`admin`, `operator`, `user` (default). Pembatasan akses di route:

```js
import { authenticate, authorize } from '../modules/auth/auth.middleware.js';

router.post('/', authenticate, authorize('admin', 'operator'), handler);
```

## Keamanan

- Password di-hash dengan bcrypt.
- Refresh token disimpan sebagai hash dan dirotasi setiap dipakai. Pemakaian ulang token lama mencabut semua sesi user.
- Endpoint login, register, dan Google dibatasi rate limit per IP.
- Jangan commit file `.env`.
