# 🚀 Quick Start Deployment ke Vercel

## Prerequisites
- GitHub account (sudah ada)
- Vercel account (gratis) - https://vercel.com

## Step 1: Push ke GitHub

```bash
cd Ticketing
git add .
git commit -m "Fix PDF rendering dan setup Vercel deployment"
git push origin main
```

## Step 2: Deploy ke Vercel (Pilih salah satu)

### Option A: Via Dashboard Vercel (Paling mudah)
1. Buka https://vercel.com/dashboard
2. Klik **"Add New"** → **"Project"**
3. Pilih repository `Ticketing`
4. **Framework Preset**: Biarkan kosong (auto-detect)
5. **Root Directory**: `.` (or leave empty)
6. **Build Command**: `cd frontend && npm run build`
7. **Output Directory**: `frontend/dist`
8. **Install Command**: Leave default
9. **Environment Variables**: Skip untuk sekarang
10. Klik **"Deploy"** ✅

### Option B: Via Vercel CLI
```bash
# Install CLI jika belum
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Step 3: Test Live Deploy

- Vercel akan memberikan URL seperti: `https://ticketing-abc123.vercel.app`
- Buka dan test:
  - ✅ Landing page muncul
  - ✅ Bisa registrasi
  - ✅ Download PDF jalan
  - ✅ QR Code terlihat jelas

## Step 4: Custom Domain (Optional)

Jika punya domain sendiri:
1. Go to Project Settings → Domains
2. Add domain (e.g., `ticketing.denso.com`)
3. Update DNS di registrar (instruksi Vercel akan muncul)

---

## 🎯 Fitur yang sudah fixed:

✅ **Logo DENSO**: Sekarang menggunakan text rendering (tidak akan blur)
✅ **QR Code**: Diperbesar ke 120x120px dengan border merah terang
✅ **PDF Layout**: Rekap data di atas, QR di samping kanan
✅ **Rendering**: Fixed loading issue saat download PDF
✅ **Vercel Config**: Ready untuk deployment

---

## 📊 Monitoring & Analytics

Di Vercel Dashboard bisa lihat:
- Build logs
- Deployment history
- Performance metrics
- Analytics (jika enable)

---

## ⚠️ Troubleshooting

### Build Error?
```bash
# Clear dan rebuild
vercel --prod --force
```

### QR Code tidak muncul di PDF?
- Check internet connection (QR generate dari external API)
- Coba refresh browser
- Ensure CORS tidak diblok

### PDF terlalu besar?
- Vercel otomatis compress images
- File biasanya 1-2 MB

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Settings: https://github.com/settings
- Project Files: Automatically synced dari GitHub

---

**Status**: ✅ Ready untuk deploy!

Kapan mau deploy? Bisa langsung via dashboard atau CLI.
