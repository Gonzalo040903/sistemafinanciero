# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A micro-credit/loan management system for a small financial business in Argentina. The backend also integrates WhatsApp (via Baileys) to send weekly payment summaries to a group.

## Commands

### Backend (`back/`)
```bash
cd back
npm run dev      # development with nodemon (auto-reload)
npm start        # production
```

### Frontend (`front/`)
```bash
cd front
npm start        # dev server on port 3000
npm run build    # outputs to front/build/
```

No test suite is configured on either side.

### Environment variables required (back/.env)
- `MONGODB_URI` — MongoDB Atlas connection string
- `PORT` — defaults to 3001
- `WA_SESSION_JSON` — base64-encoded JSON blob of WhatsApp Baileys session files (see `back/helpers/sessionLoader.js` for the expected structure)

Frontend (`front/.env`):
- `REACT_APP_API_URL` — API base URL (e.g. `http://localhost:3001` for local dev)

## Architecture

### Backend (Node.js/Express, ESM)
`back/app.js` is the single entry point. It:
1. Connects to MongoDB Atlas
2. Mounts all API routes under `/api/*`
3. Serves `front/build` as static files and handles client-side routing with a catch-all `*` → `index.html`

The backend uses ES Modules (`"type": "module"` in package.json), so all imports must use `.js` extensions.

**Routes:**
| File | Prefix | Auth required |
|------|--------|---------------|
| `routes/routesC.js` | `/api/clientes` | No (publicly accessible) |
| `routes/routesP.js` | `/api/prestamos` | No |
| `routes/routesAuth.js` | `/api/login` | No |
| `routes/routesV.js` | `/api/vendedores` | JWT + admin role |
| `routes/reporte.js` | `/api/reporte` | No |

**Middlewares:**
- `autenticarUsuario` — verifies JWT from `Authorization: Bearer <token>` header; JWT secret is the hardcoded string `'2024'`
- `verificarAdmin` — checks `req.usuario.rol === 'admin'`

### Data models (MongoDB via Mongoose)

**Cliente** (`model/modelCliente.js`): stores client info + an embedded `prestamoActual` (current loan) and `historialPrestamos` array. Loans are embedded subdocuments, not separate ObjectId refs inside the Cliente model. Uses `timestamps: true`.

**Prestamo** (`model/modelPrestamo.js`): standalone `Prestamo` collection used by `routesP.js` — references `Cliente` by ObjectId. This is a separate model from the embedded loan schema inside Cliente.

> There are two loan schemas: an embedded one in `modelCliente.js` and a standalone collection in `modelPrestamo.js`. The main app logic (cuotas, pagos) operates on the embedded `cliente.prestamoActual`, not the standalone collection.

**Vendedor** (`model/modelVendedor.js`): users who log in. Role is either `'vendedor'` or `'admin'`. Admin passwords are bcrypt-hashed; vendedor passwords are stored in plain text.

**Loan calculation logic** (in `pre('save')` hooks):
- Normal mode: `montoFinal = monto + monto * (intereses / 100)`
- `soloInteres = true`: `montoFinal = monto * (intereses / 100)` (interest only, capital not included)
- `montoAdeudado` starts as full `montoFinal` on creation; decremented per cuota paid

All client lookups in the API use `dni` (Argentine national ID number) as the key, not MongoDB `_id`.

### WhatsApp integration

`services/whatsappService.js` creates a Baileys socket. In production, session credentials come exclusively from the `WA_SESSION_JSON` environment variable (not from disk). The `auth_info_baileys/` directory in the repo is used only for local development.

`cron/whatsappCron.js` schedules a weekly summary every Sunday at 21:00 (`0 21 * * 0`, Argentina time) and also sends it immediately on WhatsApp reconnect. The target group ID is hardcoded as `120363399349813689@g.us`.

### Frontend (React 18, Create React App)

Routing is in `App.js`. Most routes are wrapped in `<RutaPrivada>`, which redirects to `/` if `localStorage.token` is absent.

Structure:
- `src/paginas/` — one page component per route (thin wrappers)
- `src/componentes/` — feature components with co-located CSS files

### Deployment

**Primary: Railway** — runs `back/app.js` which serves both the API and the compiled React build. The `front/build` directory must exist at deploy time (either committed or built in CI). CORS is locked to `https://sistemafinanciero.up.railway.app`.

**Alternative: Netlify** — `netlify.toml` at the root proxies `/api/*` to `back/functions/app.js` (serverless). The `back/functions/` directory contains the Netlify function wrapper.

For Railway deploys, `front/build` must be rebuilt (`cd front && npm run build`) before pushing if frontend changes were made.
