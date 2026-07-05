import { useEffect, useRef, useState } from 'react';
import {
  QrCode, Download, Mail, MessageCircle, CheckCircle2, Eye,
  Ticket, Coffee, UtensilsCrossed, IceCream2, type LucideIcon,
} from 'lucide-react';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { useAdminStore } from '../../admin/store/useAdminStore';
import { RippleButton } from '../../../components/atoms/RippleButton';
import type { PersonalData, FamilyData } from '../types';

const generateMockTicketId = (prefix: string) =>
  `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

const getQRUrl = (data: string, size = 400) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=DC0032&bgcolor=ffffff&qzone=1&format=png`;

// Helper to convert image URL to data URI
const loadImageAsDataURI = async (url: string): Promise<string> => {
  try {
    // Create image element and load it
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          // Create canvas and draw image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Cannot get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          // Convert to data URI
          const dataURI = canvas.toDataURL('image/png');
          resolve(dataURI);
        } catch (err) {
          console.error('Canvas conversion error:', err);
          reject(err);
        }
      };
      
      img.onerror = (err) => {
        console.error('Image load error:', err);
        reject(err);
      };
      
      // Set a timeout
      setTimeout(() => reject(new Error('Image load timeout')), 10000);
      
      img.src = url;
    });
  } catch (err) {
    console.error('Failed to load image:', url, err);
    return url; // Fallback to original URL
  }
};

interface TicketInfo {
  title: string;
  id: string;
  color: string;
  icon: LucideIcon;
  ownerName?: string;
}

// ─── PDF Template ─────────────────────────────────────────────────────────────
// A4 = 794px wide at 96dpi — render at exact width so jsPDF fills perfectly
const A4_W = 794;
const A4_MOBILE_W = 600; // Slimmer width for mobile portrait

// Detect if mobile device
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
};

function buildPDFHtml(
  tickets: TicketInfo[],
  iceCreamTickets: TicketInfo[],
  personal: PersonalData,
  family: FamilyData,
  qrDataMap?: Map<string, string>, // Optional map of ticket.id -> data URI
  isMobile = false // Flag to use mobile layout
) {
  const allTickets = [...tickets, ...iceCreamTickets];
  const pageWidth = isMobile ? A4_MOBILE_W : A4_W;

  const ticketLabel = (t: TicketInfo) => {
    if (t.icon === Ticket)          return 'Tiket Masuk & Souvenir';
    if (t.icon === Coffee)          return 'Kupon Snack Pagi';
    if (t.icon === UtensilsCrossed) return 'Kupon Makan Siang';
    if (t.icon === IceCream2)       return 'Kupon Es Krim';
    return 'Tiket';
  };

  const ticketCatLabel = (t: TicketInfo) => {
    if (t.icon === Ticket)          return 'TIKET MASUK';
    if (t.icon === Coffee)          return 'FOOD &amp; BEVERAGE';
    if (t.icon === UtensilsCrossed) return 'FOOD &amp; BEVERAGE';
    if (t.icon === IceCream2)       return 'KIDS SPECIAL';
    return 'TIKET';
  };

  // ── summary data rows ──
  const infoRows = [
    ['Nama Lengkap', personal.fullName],
    ['NIK',          personal.nik],
    ['Divisi',       personal.division],
    ['Email',        personal.email],
    ['No. HP',       personal.phone],
    ['Ukuran Kaos',  personal.tshirtSize || '-'],
    ['Kehadiran',    personal.maritalStatus === 'Family' ? 'Membawa Keluarga' : 'Sendiri'],
  ].map(([k, v]) => `<tr>
    <td class="si-key">${k}</td><td class="si-sep">:</td><td class="si-val">${v}</td>
  </tr>`).join('');

  // Calculate food allocation
  let totalPeople = 1; // Diri sendiri
  if (personal.maritalStatus === 'Family') {
    if (family.hasSpouse) totalPeople++; // Pasangan
    if (family.hasChildren) totalPeople += family.children.length; // Anak-anak
  }

  let familySectionHtml = '';
  if (personal.maritalStatus === 'Family') {
    const spR = family.hasSpouse ? `
      <tr><td class="si-key">Nama Pasangan</td><td class="si-sep">:</td><td class="si-val">${family.spouseName||'-'}</td></tr>
      <tr><td class="si-key">Kaos Pasangan</td><td class="si-sep">:</td><td class="si-val">${family.spouseTshirtSize||'-'}</td></tr>` : '';

    // Children as plain text rows, no table
    const kidRows = (family.hasChildren && family.children.length > 0)
      ? family.children.map((c, i) => `
      <tr>
        <td class="si-key">Anak ${i + 1}</td>
        <td class="si-sep">:</td>
        <td class="si-val">${c.name}, ${c.age} thn, Kaos ${c.tshirtSize||'-'}</td>
      </tr>`).join('') : '';

    familySectionHtml = `
    <div class="section">
      <div class="section-title"><span class="sdot" style="background:#0077CC;"></span>Data Keluarga</div>
      <table class="info-table">${spR}${kidRows}</table>
    </div>`;
  }

  // Food allocation summary
  const foodAllocationHtml = `
    <div class="section">
      <div class="section-title"><span class="sdot" style="background:#16A34A;"></span>Alokasi Konsumsi</div>
      <table class="info-table">
        <tr>
          <td class="si-key">Total Peserta</td>
          <td class="si-sep">:</td>
          <td class="si-val"><b>${totalPeople} orang</b></td>
        </tr>
        <tr>
          <td class="si-key">Snack Pagi</td>
          <td class="si-sep">:</td>
          <td class="si-val">${totalPeople} porsi</td>
        </tr>
        <tr>
          <td class="si-key">Makan Siang</td>
          <td class="si-sep">:</td>
          <td class="si-val">${totalPeople} porsi</td>
        </tr>
      </table>
    </div>`;

  // ── Build pages: First page = beautiful data summary, then 1 QR per page ──
  const firstPageHtml = `
<div class="page">
  <!-- Hero Header with Gradient -->
  <div style="background:linear-gradient(135deg, #1A2233 0%, #2C3E50 100%);border-radius:16px;padding:32px 28px;margin-bottom:20px;position:relative;overflow:hidden;">
    <div style="position:absolute;top:-50px;right:-50px;width:200px;height:200px;background:rgba(220,0,50,0.1);border-radius:50%;"></div>
    <div style="position:absolute;bottom:-30px;left:-30px;width:150px;height:150px;background:rgba(255,255,255,0.05);border-radius:50%;"></div>
    <div style="position:relative;z-index:1;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div>
          <div style="font-size:36px;font-weight:900;font-style:italic;color:#FFFFFF;letter-spacing:-2px;line-height:1;margin-bottom:4px;">DENSO</div>
          <div style="font-size:10px;color:rgba(255,255,255,0.7);font-weight:600;text-transform:uppercase;letter-spacing:3px;">Crafting the Core</div>
        </div>
        <div style="text-align:right;">
          <div style="display:inline-block;background:#DC0032;color:#FFF;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;padding:6px 16px;border-radius:20px;box-shadow:0 4px 12px rgba(220,0,50,0.4);">E-Ticket Resmi</div>
        </div>
      </div>
      <div style="border-top:2px solid rgba(255,255,255,0.1);padding-top:16px;margin-top:16px;">
        <div style="font-size:24px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">Family Gathering 2026</div>
        <div style="display:flex;gap:24px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:16px;">📅</span>
            <span style="font-size:13px;color:rgba(255,255,255,0.9);font-weight:600;">Minggu, 15 September 2026</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:16px;">🎫</span>
            <span style="font-size:13px;color:rgba(255,255,255,0.9);font-weight:600;">${allTickets.length} Tiket Diterbitkan</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div style="display:grid;grid-template-columns:${personal.maritalStatus === 'Family' ? '1fr 1fr' : '1fr'};gap:16px;margin-bottom:16px;">
    
    <!-- Data Karyawan Card -->
    <div style="background:#FFF;border-radius:14px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.08);border-left:4px solid #DC0032;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #F0F2F5;">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,#DC0032,#A8001E);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;">👤</div>
        <div>
          <div style="font-size:11px;color:#8896A8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Data Karyawan</div>
          <div style="font-size:18px;font-weight:800;color:#1A2233;line-height:1.2;">${personal.fullName}</div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;font-size:10px;color:#8896A8;font-weight:600;width:90px;vertical-align:top;">NIK</td>
          <td style="padding:10px 0;color:#CDD4D8;vertical-align:top;">:</td>
          <td style="padding:10px 0;font-size:12px;color:#1A2233;font-weight:700;vertical-align:top;">${personal.nik}</td>
        </tr>
        <tr style="background:#F8F9FB;">
          <td style="padding:10px 8px;font-size:10px;color:#8896A8;font-weight:600;">Divisi</td>
          <td style="padding:10px 4px;color:#CDD4D8;">:</td>
          <td style="padding:10px 8px;font-size:12px;color:#1A2233;font-weight:700;">${personal.division}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:10px;color:#8896A8;font-weight:600;">Email</td>
          <td style="padding:10px 0;color:#CDD4D8;">:</td>
          <td style="padding:10px 0;font-size:11px;color:#1A2233;font-weight:600;">${personal.email}</td>
        </tr>
        <tr style="background:#F8F9FB;">
          <td style="padding:10px 8px;font-size:10px;color:#8896A8;font-weight:600;">No. HP</td>
          <td style="padding:10px 4px;color:#CDD4D8;">:</td>
          <td style="padding:10px 8px;font-size:12px;color:#1A2233;font-weight:700;">${personal.phone}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:10px;color:#8896A8;font-weight:600;">Kaos</td>
          <td style="padding:10px 0;color:#CDD4D8;">:</td>
          <td style="padding:10px 0;font-size:12px;color:#1A2233;font-weight:700;">${personal.tshirtSize || '-'}</td>
        </tr>
        <tr style="background:#F8F9FB;">
          <td style="padding:10px 8px;font-size:10px;color:#8896A8;font-weight:600;">Status</td>
          <td style="padding:10px 4px;color:#CDD4D8;">:</td>
          <td style="padding:10px 8px;">
            <span style="display:inline-block;background:${personal.maritalStatus === 'Family' ? '#DBEAFE' : '#F3F4F6'};color:${personal.maritalStatus === 'Family' ? '#1E40AF' : '#4B5563'};font-size:10px;font-weight:700;padding:4px 12px;border-radius:12px;">${personal.maritalStatus === 'Family' ? '👨‍👩‍👧 Keluarga' : '👤 Sendiri'}</span>
          </td>
        </tr>
      </table>
    </div>

    ${personal.maritalStatus === 'Family' ? `
    <!-- Data Keluarga Card -->
    <div style="background:#FFF;border-radius:14px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.08);border-left:4px solid #0077CC;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #F0F2F5;">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,#0077CC,#005A9C);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;">👨‍👩‍👧</div>
        <div>
          <div style="font-size:11px;color:#8896A8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Data Keluarga</div>
          <div style="font-size:18px;font-weight:800;color:#1A2233;line-height:1.2;">${totalPeople} Anggota</div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${family.hasSpouse ? `
        <tr>
          <td style="padding:10px 0;font-size:10px;color:#8896A8;font-weight:600;width:90px;vertical-align:top;">Pasangan</td>
          <td style="padding:10px 0;color:#CDD4D8;vertical-align:top;">:</td>
          <td style="padding:10px 0;font-size:12px;color:#1A2233;font-weight:700;vertical-align:top;">${family.spouseName || '-'}</td>
        </tr>
        <tr style="background:#F8F9FB;">
          <td style="padding:10px 8px;font-size:10px;color:#8896A8;font-weight:600;">Kaos</td>
          <td style="padding:10px 4px;color:#CDD4D8;">:</td>
          <td style="padding:10px 8px;font-size:12px;color:#1A2233;font-weight:700;">${family.spouseTshirtSize || '-'}</td>
        </tr>
        ` : ''}
        ${family.hasChildren && family.children.length > 0 ? family.children.map((c, i) => `
        <tr${i % 2 === 0 ? '' : ' style="background:#F8F9FB;"'}>
          <td style="padding:10px ${i % 2 === 0 ? '0' : '8px'};font-size:10px;color:#8896A8;font-weight:600;vertical-align:top;">Anak ${i + 1}</td>
          <td style="padding:10px ${i % 2 === 0 ? '0' : '4px'};color:#CDD4D8;vertical-align:top;">:</td>
          <td style="padding:10px ${i % 2 === 0 ? '0' : '8px'};font-size:11px;color:#1A2233;font-weight:600;vertical-align:top;">${c.name}, ${c.age} thn<br/><span style="font-size:10px;color:#6B7882;">Kaos: ${c.tshirtSize || '-'}</span></td>
        </tr>
        `).join('') : ''}
      </table>
    </div>
    ` : ''}

  </div>

  <!-- Food Allocation Card -->
  <div style="background:linear-gradient(135deg,#FFF 0%,#F8FAF9 100%);border-radius:14px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.08);border:2px solid #E8F5E9;margin-bottom:16px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,#16A34A,#15803D);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;">🍽️</div>
        <div>
          <div style="font-size:11px;color:#15803D;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Alokasi Konsumsi</div>
          <div style="font-size:18px;font-weight:800;color:#1A2233;line-height:1.2;">${totalPeople} Orang Terdaftar</div>
        </div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div style="background:#FFF;border-radius:12px;padding:16px;border:2px solid #FEF3C7;">
        <div style="font-size:11px;color:#92400E;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">☕ Snack Pagi</div>
        <div style="font-size:28px;font-weight:900;color:#B45309;line-height:1;">${totalPeople}</div>
        <div style="font-size:10px;color:#92400E;font-weight:600;margin-top:4px;">Porsi</div>
      </div>
      <div style="background:#FFF;border-radius:12px;padding:16px;border:2px solid #FEE2E2;">
        <div style="font-size:11px;color:#991B1B;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">🍛 Makan Siang</div>
        <div style="font-size:28px;font-weight:900;color:#DC2626;line-height:1;">${totalPeople}</div>
        <div style="font-size:10px;color:#991B1B;font-weight:600;margin-top:4px;">Porsi</div>
      </div>
    </div>
  </div>

  <!-- Ticket Info Banner -->
  <div style="background:linear-gradient(135deg,#DC0032 0%,#A8001E 100%);border-radius:14px;padding:20px 24px;text-align:center;color:#FFF;margin-bottom:16px;box-shadow:0 4px 16px rgba(220,0,50,0.3);">
    <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;opacity:0.9;">📱 Tiket Digital Anda</div>
    <div style="font-size:32px;font-weight:900;margin-bottom:8px;line-height:1;">${allTickets.length} Tiket</div>
    <div style="font-size:11px;opacity:0.85;font-weight:500;line-height:1.5;">Setiap tiket memiliki QR code unik di halaman berikutnya<br/>Tunjukkan QR ke petugas saat check-in</div>
  </div>

  <!-- Footer -->
  <div style="border-top:2px solid #E5E7EB;padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:10px;color:#6B7882;font-weight:500;">
      Diterbitkan untuk <span style="color:#1A2233;font-weight:800;">${personal.fullName}</span> • NIK ${personal.nik}
    </div>
    <div style="font-size:10px;color:#6B7882;font-weight:500;text-align:right;">
      <span style="color:#1A2233;font-weight:800;">DENSO Indonesia</span><br/>
      Dokumen resmi • Harap disimpan
    </div>
  </div>
</div>`;

  // ── Each ticket gets its own page with centered layout ──
  const ticketPages = allTickets.map((t, idx) => {
    const qrSrc = qrDataMap?.get(t.id) || getQRUrl(t.id, 500);
    
    return `
<div class="page page-break">
  <div class="hdr" style="margin-bottom:24px;">
    <div><div class="hdr-logo">DENSO</div><div class="hdr-tag">Family Gathering 2026</div></div>
    <div style="text-align:${isMobile ? 'center' : 'right'};">
      <div class="hdr-event">Tiket ${idx + 1} dari ${allTickets.length}</div>
      <div style="display:inline-block;background:${t.color};color:#FFF;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:4px 12px;border-radius:20px;margin-top:8px;">${ticketLabel(t)}</div>
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:20px;margin-top:20px;">
    
    <!-- Ticket Info Card -->
    <div style="background:#FFF;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.07);">
      <div style="border-left:4px solid ${t.color};padding-left:16px;margin-bottom:16px;">
        <div style="font-size:8px;color:#8896A8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">${ticketCatLabel(t)}</div>
        <div style="font-size:16px;font-weight:800;color:#1A2233;margin-bottom:6px;">${ticketLabel(t)}</div>
        <div style="font-size:10px;color:#6B7882;font-weight:600;">ID: <span style="font-family:monospace;color:${t.color};font-weight:800;">${t.id}</span></div>
      </div>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;font-size:10px;color:#8896A8;font-weight:600;width:80px;">Nama</td>
          <td style="padding:8px 0;color:#CDD4D8;">:</td>
          <td style="padding:8px 0;font-size:12px;color:#1A2233;font-weight:700;">${t.ownerName ?? personal.fullName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:10px;color:#8896A8;font-weight:600;">NIK</td>
          <td style="padding:8px 0;color:#CDD4D8;">:</td>
          <td style="padding:8px 0;font-size:12px;color:#1A2233;font-weight:700;">${personal.nik}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:10px;color:#8896A8;font-weight:600;">Divisi</td>
          <td style="padding:8px 0;color:#CDD4D8;">:</td>
          <td style="padding:8px 0;font-size:12px;color:#1A2233;font-weight:700;">${personal.division}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:10px;color:#8896A8;font-weight:600;">Tanggal</td>
          <td style="padding:8px 0;color:#CDD4D8;">:</td>
          <td style="padding:8px 0;font-size:12px;color:#1A2233;font-weight:700;">15 September 2026</td>
        </tr>
      </table>
    </div>

    <!-- QR Code Card -->
    <div style="background:linear-gradient(135deg, #FFF 0%, #F8F9FB 100%);border-radius:12px;padding:32px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.07);border:2px solid ${t.color}20;">
      <div style="font-size:11px;font-weight:700;color:#8896A8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px;">&#128242; Scan QR Code</div>
      <div style="display:inline-block;padding:12px;background:#FFF;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.1);">
        <img src="${qrSrc}" style="width:${isMobile ? '140px' : '120px'};height:${isMobile ? '140px' : '120px'};display:block;border-radius:8px;border:3px solid ${t.color};" alt="QR"/>
      </div>
      <div style="font-size:9px;color:#B0BAC7;font-weight:500;margin-top:16px;line-height:1.5;">Tunjukkan QR kepada petugas<br/>Berlaku sekali pakai</div>
    </div>

  </div>

  <div class="footer" style="margin-top:24px;">
    <div class="ft">Tiket untuk <b>${t.ownerName ?? personal.fullName}</b></div>
    <div class="ft" style="text-align:${isMobile ? 'center' : 'right'};">DENSO Family Gathering 2026</div>
  </div>
</div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"/>
<title>E-Ticket — ${personal.fullName}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${pageWidth}px;background:#F0F2F5;font-family:'Segoe UI',Arial,sans-serif;color:#1A2233;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.page{width:${pageWidth}px;background:#F0F2F5;padding:${isMobile ? '20px 16px' : '28px 36px 32px'};}

/* HEADER */
.hdr{display:flex;align-items:center;justify-content:space-between;background:#1A2233;border-radius:14px;padding:${isMobile ? '16px 20px' : '18px 28px'};margin-bottom:16px;${isMobile ? 'flex-direction:column;gap:12px;text-align:center;' : ''}}
.hdr-logo{font-size:${isMobile ? '26px' : '30px'};font-weight:900;font-style:italic;color:#FFFFFF;letter-spacing:-1.5px;line-height:1;}
.hdr-tag{font-size:8.5px;color:#8896A8;font-weight:500;text-transform:uppercase;letter-spacing:2px;margin-top:3px;}
.hdr-event{font-size:${isMobile ? '13px' : '14px'};font-weight:700;color:#FFF;line-height:1.2;text-align:${isMobile ? 'center' : 'right'};}
.hdr-date{font-size:10px;color:#8896A8;margin-top:3px;text-align:${isMobile ? 'center' : 'right'};}
.hdr-badge{display:inline-block;background:#DC0032;color:#FFF;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:3px 10px;border-radius:20px;margin-top:6px;}

/* INFO CARD */
.icard{background:#FFF;border-radius:12px;overflow:hidden;margin-bottom:14px;box-shadow:0 2px 8px rgba(0,0,0,.07);}
.icard-hdr{background:linear-gradient(90deg,#DC0032 0%,#A8001E 100%);padding:9px 20px;display:flex;align-items:center;gap:8px;}
.icard-icon{font-size:13px;}
.icard-title{font-size:10px;font-weight:800;color:#FFF;text-transform:uppercase;letter-spacing:1.5px;}
.icard-body{padding:14px 20px;display:flex;gap:24px;${isMobile ? 'flex-direction:column;gap:16px;' : ''}}
.section{flex:1;}
.section+.section{${isMobile ? 'border-top:1px solid #EBEDF0;padding-top:16px;' : 'border-left:1px solid #EBEDF0;padding-left:24px;'}}
.section-title{font-size:8.5px;font-weight:700;color:#8896A8;text-transform:uppercase;letter-spacing:1.2px;display:flex;align-items:center;gap:5px;margin-bottom:8px;}
.sdot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.info-table{width:100%;border-collapse:collapse;}
.si-key{font-size:10.5px;color:#8896A8;font-weight:600;padding:2.5px 0;width:${isMobile ? '90px' : '100px'};vertical-align:top;}
.si-sep{color:#CDD4D8;padding:2.5px 6px;vertical-align:top;}
.si-val{font-size:11px;color:#1A2233;font-weight:600;padding:2.5px 0;vertical-align:top;}

/* DIVIDER */
.div-row{display:flex;align-items:center;gap:10px;margin:14px 0 10px;}
.div-line{flex:1;height:1px;background:#D0D5DD;}
.div-txt{font-size:8.5px;font-weight:700;color:#8896A8;text-transform:uppercase;letter-spacing:1.5px;white-space:nowrap;}

/* TICKET - Mobile: Vertical Stack, Desktop: Horizontal */
.ticket-wrap{display:flex;${isMobile ? 'flex-direction:column;' : ''}background:#FFF;border-radius:12px;overflow:hidden;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,.07);${isMobile ? 'height:auto;' : 'height:112px;'}}
.ticket-left{width:${isMobile ? '100%' : '196px'};flex-shrink:0;padding:${isMobile ? '18px 20px' : '14px 16px'};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;}
.ticket-left::after{content:'';position:absolute;right:-20px;top:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.08);}
.tl-cat{font-size:7px;font-weight:700;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:1.8px;margin-bottom:3px;}
.tl-title{font-size:${isMobile ? '14.5px' : '13.5px'};font-weight:800;color:#FFF;line-height:1.15;letter-spacing:-.3px;}
.tl-event{font-size:8px;color:rgba(255,255,255,.6);margin-top:4px;}
.tl-date{font-size:8px;color:rgba(255,255,255,.75);margin-top:2px;font-weight:600;}
.tl-num{font-size:32px;font-weight:900;color:rgba(255,255,255,.1);line-height:1;font-style:italic;${isMobile ? 'position:static;text-align:right;margin-top:8px;' : 'position:absolute;bottom:7px;right:11px;'}}
.ticket-mid{${isMobile ? 'width:100%;' : 'flex:1;'}padding:${isMobile ? '16px 20px' : '12px 16px'};display:flex;flex-direction:column;justify-content:center;}
.tm-row{display:flex;gap:16px;}
.tm-cell{flex:1;}
.tm-label{font-size:7px;font-weight:700;color:#9AAAB3;text-transform:uppercase;letter-spacing:.8px;margin-bottom:2px;}
.tm-val{font-size:${isMobile ? '11.5px' : '12px'};font-weight:700;color:#1A2233;line-height:1.2;}
.tm-id{font-family:monospace;font-size:${isMobile ? '10px' : '10.5px'};letter-spacing:1.5px;font-weight:800;}
.tm-barline{height:2.5px;border-radius:2px;margin:9px 0 6px;}
.tm-note{font-size:${isMobile ? '7.5px' : '8px'};color:#B0BAC7;font-weight:500;}
.ticket-tear{${isMobile ? 'width:100%;height:0;border-left:none;border-top:2px dashed;margin:0;' : 'width:0;border-left:2px dashed;margin:12px 0;'}flex-shrink:0;}
.ticket-right{width:${isMobile ? '100%' : '122px'};flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#F8F9FB;padding:${isMobile ? '20px' : '10px 12px'};}
.tr-qr{width:${isMobile ? '110px' : '88px'};height:${isMobile ? '110px' : '88px'};display:block;border-radius:7px;border:2.5px solid #DC0032;padding:2px;background:white;}
.tr-scan{font-size:7px;font-weight:800;color:#8896A8;text-transform:uppercase;letter-spacing:1.5px;}

/* PAGE BREAK for PDF */
.page-break{page-break-before:always;}

/* FOOTER */
.footer{margin-top:16px;border-top:1px solid #D0D5DD;padding-top:10px;display:flex;${isMobile ? 'flex-direction:column;gap:8px;' : 'justify-content:space-between;'}align-items:center;}
.ft{font-size:9px;color:#8896A8;font-weight:500;${isMobile ? 'text-align:center;' : ''}}
.ft b{color:#1A2233;font-weight:700;}
</style>
</head>
<body>

${firstPageHtml}
${ticketPages}

</body></html>`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function TicketResultStep() {
  const { personalData, familyData } = useRegistrationStore();
  const [isGenerating, setIsGenerating] = useState(true);
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [iceCreamTickets, setIceCreamTickets] = useState<TicketInfo[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const registerEmployee = useAdminStore(s => s.registerEmployee);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mainTickets: TicketInfo[] = [
        { title: 'Tiket Masuk & Souvenir', id: generateMockTicketId('REG'), color: '#DC0032', icon: Ticket },
        { title: 'Kupon Snack Pagi',        id: generateMockTicketId('SNK'), color: '#B45309', icon: Coffee },
        { title: 'Kupon Makan Siang',        id: generateMockTicketId('LNC'), color: '#C2410C', icon: UtensilsCrossed },
      ];
      let iceTickets: TicketInfo[] = [];
      if (personalData.maritalStatus === 'Family' && familyData.hasChildren) {
        const kids = familyData.children.filter(c => c.age <= 12);
        iceTickets = kids.map(kid => ({
          title: 'Kupon Es Krim', id: generateMockTicketId('ICE'),
          color: '#9D174D', icon: IceCream2, ownerName: kid.name,
        }));
      }
      setTickets(mainTickets);
      setIceCreamTickets(iceTickets);
      registerEmployee({
        fullName: personalData.fullName, nik: personalData.nik,
        division: personalData.division, email: personalData.email,
        phone: personalData.phone, tshirtSize: personalData.tshirtSize as string,
        maritalStatus: personalData.maritalStatus as 'Single' | 'Family',
        spouseName: familyData.spouseName,
        spouseTshirtSize: familyData.spouseTshirtSize as string | undefined,
        children: familyData.children.map(c => ({ name: c.name, age: c.age, tshirtSize: c.tshirtSize as string })),
        tickets: [
          ...mainTickets.map(t => ({
            id: t.id,
            type: (t.title.includes('Masuk') ? 'entry' : t.title.includes('Snack') ? 'snack' : 'lunch') as 'entry' | 'snack' | 'lunch',
            label: t.title,
          })),
          ...iceTickets.map(t => ({ id: t.id, type: 'icecream' as const, label: t.title })),
        ],
      });
      setIsGenerating(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [personalData, familyData]);

  const handlePreview = () => {
    const isMobile = isMobileDevice();
    const html = buildPDFHtml(tickets, iceCreamTickets, personalData, familyData, undefined, isMobile);
    const pageWidth = isMobile ? A4_MOBILE_W : A4_W;
    
    // Open in new window with exact PDF dimensions
    const pw = window.open('', '_blank', `width=${pageWidth + 50},height=900`);
    if (pw) { 
      pw.document.write(html); 
      pw.document.close();
      
      // Add print button to preview window
      const style = pw.document.createElement('style');
      style.textContent = `
        @media screen {
          body { overflow-y: scroll; }
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #DC0032;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(220, 0, 50, 0.3);
            z-index: 9999;
          }
          .print-btn:hover { background: #B8002A; }
        }
        @media print {
          .print-btn { display: none; }
        }
      `;
      pw.document.head.appendChild(style);
      
      const btn = pw.document.createElement('button');
      btn.className = 'print-btn';
      btn.textContent = '🖨️ Print PDF';
      btn.onclick = () => pw.print();
      pw.document.body.insertBefore(btn, pw.document.body.firstChild);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'), import('html2canvas'),
      ]);

      const allTickets = [...tickets, ...iceCreamTickets];
      const isMobile = isMobileDevice();
      const pageWidth = isMobile ? A4_MOBILE_W : A4_W;

      // Pre-load all QR codes as data URIs to avoid CORS issues on mobile
      const qrDataMap = new Map<string, string>();
      await Promise.all(
        allTickets.map(async (ticket) => {
          const dataURI = await loadImageAsDataURI(getQRUrl(ticket.id, 500));
          qrDataMap.set(ticket.id, dataURI);
        })
      );

      const html = buildPDFHtml(tickets, iceCreamTickets, personalData, familyData, qrDataMap, isMobile);

      // Use an isolated iframe to avoid global CSS interference
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${pageWidth}px;height:1px;border:none;visibility:hidden;`;
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Cannot access iframe document');

      iframeDoc.open();
      iframeDoc.write(html.replace(/<script[\s\S]*?<\/script>/gi, ''));
      iframeDoc.close();

      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Wait for all images to load (data URIs should load instantly)
      await new Promise<void>(resolve => {
        const imgs = iframeDoc.querySelectorAll('img');
        console.log('Total images found:', imgs.length);
        
        if (!imgs.length) { 
          console.log('No images found, continuing...');
          setTimeout(resolve, 200); 
          return; 
        }
        
        let done = 0;
        const total = imgs.length;
        
        imgs.forEach((img, idx) => {
          const el = img as HTMLImageElement;
          console.log(`Image ${idx}: src=${el.src.substring(0, 50)}... complete=${el.complete} naturalHeight=${el.naturalHeight}`);
          
          const finish = () => { 
            done++;
            console.log(`Image ${idx} loaded (${done}/${total})`);
            if (done >= total) resolve(); 
          };
          
          if (el.complete && el.naturalHeight > 0) {
            finish();
          } else {
            const t = setTimeout(() => {
              console.log(`Image ${idx} timeout`);
              finish();
            }, 5000);
            el.onload = () => { 
              console.log(`Image ${idx} onload success`);
              clearTimeout(t); 
              finish(); 
            };
            el.onerror = () => { 
              console.log(`Image ${idx} onerror`);
              clearTimeout(t); 
              finish(); 
            };
          }
        });
      });

      console.log('All images loaded, waiting additional 800ms...');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Process each .page div separately to create proper page breaks
      const pages = iframeDoc.querySelectorAll('.page');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      
      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;
        
        // Temporarily adjust iframe size to fit this page
        iframe.style.height = (pageEl.scrollHeight + 50) + 'px';
        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: false,
          allowTaint: true,
          backgroundColor: '#F0F2F5',
          width: pageWidth,
          windowWidth: pageWidth,
          logging: false,
        });

        if (i > 0) pdf.addPage();
        
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const imgW = pageW;
        const imgH = (canvas.height * pageW) / canvas.width;

        // Center vertically if content is smaller than page
        const yPos = imgH < pageH ? (pageH - imgH) / 2 : 0;
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, yPos, imgW, imgH);
      }

      document.body.removeChild(iframe);

      pdf.save(`E-Ticket_${personalData.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF Error:', err);
      alert('Gagal membuat PDF. Coba gunakan tombol Preview lalu simpan manual.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-5 p-12 min-h-[360px]">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: '#EEF1F3' }} />
          <div className="absolute inset-0 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: '#DC0032' }} />
          <QrCode className="w-8 h-8 animate-pulse" style={{ color: '#DC0032' }} />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl mb-1" style={{ color: '#4A565E' }}>Menerbitkan Tiket…</h3>
          <p className="text-sm" style={{ color: '#6B7882' }}>Sedang membuat QR Code unik untuk Anda.</p>
        </div>
      </div>
    );
  }

  const allTickets = [...tickets, ...iceCreamTickets];

  return (
    <div className="flex flex-col" ref={ticketRef}>
      {/* ── Content ── */}
      <div className="p-6 sm:p-8 space-y-5">

        {/* Success header */}
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: '#DC003212' }}
          >
            <CheckCircle2 className="w-7 h-7" style={{ color: '#DC0032' }} />
          </div>
          <h2 className="font-display font-extrabold text-xl" style={{ color: '#4A565E' }}>Registrasi Berhasil!</h2>
          <p className="font-sans text-sm mt-1.5 max-w-xs mx-auto" style={{ color: '#6B7882' }}>
            Tiket Anda telah diterbitkan,{' '}
            <span className="font-semibold" style={{ color: '#4A565E' }}>{personalData.fullName}</span>.
          </p>
        </div>

        {/* Ticket cards — redesigned */}
        <div className="space-y-3">
          {allTickets.map((ticket, i) => {
            const Icon = ticket.icon;
            return (
              <div key={i} className="rounded-2xl overflow-hidden flex"
                style={{ boxShadow: '0 2px 16px rgba(44,53,59,.10)', border: '1px solid #EEF1F3' }}>
                {/* Colored left band */}
                <div className="w-2 flex-shrink-0" style={{ background: ticket.color }} />
                {/* Main body */}
                <div className="flex-1 bg-white flex items-center gap-4 px-4 py-3.5">
                  {/* Icon badge */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: ticket.color + '12' }}>
                    <Icon className="w-5 h-5" style={{ color: ticket.color }} strokeWidth={1.5} />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {ticket.ownerName && (
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: '#9AAAB3' }}>{ticket.ownerName}</p>
                    )}
                    <p className="font-display font-bold text-sm" style={{ color: '#2C353B' }}>{ticket.title}</p>
                    <p className="font-mono text-[10px] font-medium tracking-widest mt-0.5" style={{ color: '#CDD4D8' }}>
                      {ticket.id}
                    </p>
                  </div>
                  {/* QR */}
                  <div className="flex-shrink-0 p-1.5 rounded-xl" style={{ background: '#F5F7F8' }}>
                    <img src={getQRUrl(ticket.id, 100)} alt={`QR ${ticket.title}`}
                      className="w-12 h-12 rounded-lg block" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center font-sans text-xs" style={{ color: '#CDD4D8' }}>
          {allTickets.length} tiket diterbitkan · Preview atau unduh untuk menyimpan
        </p>
      </div>

      {/* ── Footer — naturally at bottom ── */}
      <div className="px-6 sm:px-8 py-4" style={{ borderTop: '1px solid #EEF1F3', background: '#FFFFFF' }}>
        <div className="grid grid-cols-2 gap-2.5">
          <RippleButton variant="outline" size="sm" icon={<Eye className="w-4 h-4" />} onClick={handlePreview} fullWidth>
            Preview PDF
          </RippleButton>
          <RippleButton variant="outline" size="sm"
            icon={isDownloading
              ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <Download className="w-4 h-4" />}
            onClick={handleDownloadPDF} disabled={isDownloading} fullWidth>
            {isDownloading ? 'Membuat…' : 'Unduh PDF'}
          </RippleButton>
          <RippleButton variant="outline" size="sm" icon={<Mail className="w-4 h-4" />} fullWidth>
            Kirim ke Email
          </RippleButton>
          <RippleButton variant="primary" size="sm" icon={<MessageCircle className="w-4 h-4" />} fullWidth>
            Kirim via WhatsApp
          </RippleButton>
        </div>
      </div>
    </div>
  );
}
