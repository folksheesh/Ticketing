# Deployment Guide - DENSO Family Gathering Ticketing System

## Deployment ke Vercel

### Prasyarat:
- Git repository sudah di-push ke GitHub
- Akun Vercel (https://vercel.com)
- GitHub connected dengan Vercel

### Langkah-langkah Deployment:

#### 1. **Persiapan Repository**

Pastikan semua file sudah di-push ke GitHub:

```bash
git add .
git commit -m "Setup Vercel deployment configuration"
git push origin main
```

#### 2. **Deployment ke Vercel - Method 1: Dashboard Vercel**

1. Buka https://vercel.com/dashboard
2. Klik tombol **"Add New..."** → **"Project"**
3. Pilih repository GitHub Anda (`Ticketing`)
4. Vercel akan auto-detect Vite config
5. **Root Directory**: Biarkan kosong (atau isi `./`)
6. **Build Command**: `cd frontend && npm run build`
7. **Output Directory**: `frontend/dist`
8. **Install Command**: `npm install`
9. Klik **"Deploy"**

#### 3. **Deployment ke Vercel - Method 2: CLI**

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy project
vercel

# Untuk production
vercel --prod
```

#### 4. **Konfigurasi Environment Variables (jika ada)**

Jika ada API endpoints atau secrets:
1. Go to Project Settings → Environment Variables
2. Tambahkan variable yang diperlukan:
   ```
   VITE_API_URL=https://your-api.com
   ```

#### 5. **Verifikasi Deployment**

- Vercel akan memberikan URL deployment (e.g., `https://ticketing.vercel.app`)
- Buka URL tersebut dan test fungsionalitas
- Check halaman landing, registration, dan PDF download

### Troubleshooting:

#### Build Error:
```bash
# Clear cache dan rebuild
vercel --prod --force
```

#### Preview Environment:
Setiap push ke branch akan auto-generate preview URL:
- Main branch → Production
- Pull Requests → Preview URL

#### Analytics & Monitoring:
- Dashboard Vercel menyediakan build logs
- Function calls analytics
- Performance metrics

### Domain Custom:
1. Go to Project Settings → Domains
2. Tambahkan custom domain (e.g., `ticketing.denso.com`)
3. Update DNS records sesuai instruksi Vercel

### Rollback:
Jika ada issue, bisa rollback di Vercel Dashboard:
1. Go to Deployments
2. Klik deployment sebelumnya
3. Klik "Promote to Production"

---

## File Struktur untuk Vercel:

```
Ticketing/
├── vercel.json              ← Konfigurasi Vercel
├── .vercelignore            ← Files to ignore
├── package.json             ← Root package.json (optional)
├── frontend/
│   ├── package.json         ← Main project config
│   ├── vite.config.ts       ← Vite build config
│   ├── .env.production      ← Production env
│   ├── dist/                ← Build output
│   └── src/
└── README_DEPLOYMENT.md     ← This file
```

---

## Catatan Penting:

✅ **SPA Routing**: `vercel.json` sudah dikonfigurasi untuk handle SPA routing (redirect semua ke `/index.html`)

✅ **Build Output**: Vite akan generate ke `frontend/dist/`

✅ **Performance**: Vercel akan auto-optimize dan cache assets

⚠️ **Bandwidth**: QR Code generate dari external API (`api.qrserver.com`) - pastikan reliable atau self-host

---

## Tips Optimization:

### Build Size:
```bash
cd frontend
npm run build
# Check dist folder size
```

### Performance:
- Gunakan Vercel Analytics untuk monitoring
- Enable caching untuk API calls
- Consider menggunakan CDN untuk images

### Monitoring:
- Setup error tracking (Sentry, Rollbar)
- Monitor PDF generation performance
- Track user registration funnel
