import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
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

// ── Generate QR as high-res PNG data URI (client-side, no CORS) ──
const generateQRDataURI = async (text: string): Promise<string> => {
  return QRCode.toDataURL(text, {
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#FFFFFF' },
  });
};

interface TicketInfo {
  title: string;
  id: string;
  color: string;
  icon: LucideIcon;
  ownerName?: string;
}

// ─── PDF HTML Builder ─────────────────────────────────────────────────────────
// Uses table-based layout: stable across all PDF renderers, no flexbox/grid issues.
// Each page is exactly 794px wide (A4 @ 96dpi). QR is pre-rendered data URI.
// No external image requests — zero CORS issues.

function buildPDFHtml(
  tickets: TicketInfo[],
  iceCreamTickets: TicketInfo[],
  personal: PersonalData,
  family: FamilyData,
  qrMap: Record<string, string>,  // ticketId → data URI
) {
  const allTickets = [...tickets, ...iceCreamTickets];
  const PW = 794; // A4 width px @ 96dpi
  const PAD = 36; // page padding

  const ticketLabel = (t: TicketInfo) => {
    if (t.icon === Ticket)          return 'Tiket Registrasi';
    if (t.icon === Coffee)          return 'Kupon Snack Pagi';
    if (t.icon === UtensilsCrossed) return 'Kupon Makan Siang';
    if (t.icon === IceCream2)       return 'Kupon Es Krim';
    return 'Tiket';
  };

  const ticketCat = (t: TicketInfo) => {
    if (t.icon === Ticket)          return 'TIKET REGISTRASI';
    if (t.icon === Coffee)          return 'FOOD & BEVERAGE';
    if (t.icon === UtensilsCrossed) return 'FOOD & BEVERAGE';
    if (t.icon === IceCream2)       return 'KIDS SPECIAL';
    return 'TIKET';
  };

  let totalPeople = 1;
  if (personal.maritalStatus === 'Family') {
    if (family.hasSpouse) totalPeople++;
    if (family.hasChildren) totalPeople += family.children.length;
  }
  const iceCreamCount = iceCreamTickets.length;
  const contentW = PW - PAD * 2;

  // ── helpers ──
  const row = (label: string, value: string, bg = '') =>
    `<tr${bg ? ` style="background:${bg};"` : ''}>
      <td style="padding:7px 0;font-size:10px;color:#6B7882;font-weight:600;width:76px;vertical-align:top;white-space:nowrap;">${label}</td>
      <td style="padding:7px 4px;font-size:10px;color:#9AAAB3;vertical-align:top;width:8px;">:</td>
      <td style="padding:7px 0;font-size:11px;color:#1A2233;font-weight:700;vertical-align:top;word-wrap:break-word;overflow-wrap:break-word;">${value}</td>
    </tr>`;

  // ── PAGE 1: Summary ──
  const familyColWidth = Math.floor((contentW - 16) / 2);
  const hasFamily = personal.maritalStatus === 'Family';

  const summaryPage = `
<div class="pdf-page">

  <!-- HEADER BAND -->
  <table width="${contentW}" cellpadding="0" cellspacing="0" style="background:#1A2233;border-radius:12px;margin-bottom:16px;">
    <tr>
      <td style="padding:24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="font-size:34px;font-weight:900;font-style:italic;color:#FFFFFF;letter-spacing:-2px;line-height:1;">DENSO</div>
              <div style="font-size:9px;color:rgba(255,255,255,0.65);font-weight:600;text-transform:uppercase;letter-spacing:3px;margin-top:3px;">Crafting the Core</div>
            </td>
            <td style="text-align:right;vertical-align:top;">
              <span style="display:inline-block;background:#DC0032;color:#FFF;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:2px;padding:5px 14px;border-radius:20px;">E-Ticket Resmi</span>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:14px;border-top:1px solid rgba(255,255,255,0.12);margin-top:14px;">
              <table cellpadding="0" cellspacing="0" width="100%"><tr><td style="padding-top:14px;">
                <div style="font-size:22px;font-weight:800;color:#FFFFFF;line-height:1.2;margin-bottom:8px;">Family Gathering 2026</div>
                <span style="font-size:12px;color:rgba(255,255,255,0.85);font-weight:600;">&#128197; Minggu, 13 September 2026</span>
                &nbsp;&nbsp;&nbsp;
                <span style="font-size:12px;color:rgba(255,255,255,0.85);font-weight:600;">&#127963; Lapangan DENSO Fajar Plant</span>
                &nbsp;&nbsp;&nbsp;
                <span style="font-size:12px;color:rgba(255,255,255,0.85);font-weight:600;">&#127915; ${allTickets.length} Tiket Diterbitkan</span>
              </td></tr></table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- DATA CARDS ROW -->
  <table width="${contentW}" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
    <tr valign="top">
      <!-- Karyawan Card -->
      <td width="${hasFamily ? familyColWidth : contentW}" style="background:#FFFFFF;border-radius:12px;border-left:4px solid #DC0032;padding:16px 18px;box-shadow:0 2px 10px rgba(0,0,0,0.07);">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;border-bottom:1px solid #F0F2F5;padding-bottom:12px;">
          <tr>
            <td style="font-size:9px;color:#8896A8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Data Karyawan</td>
          </tr>
          <tr>
            <td style="font-size:16px;font-weight:800;color:#1A2233;line-height:1.3;word-wrap:break-word;overflow-wrap:break-word;padding-top:2px;">${personal.fullName}</td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('NIK', personal.nik)}
          ${row('Divisi', personal.division, '#F8F9FB')}
          ${row('Email', `<span style="word-break:break-all;">${personal.email}</span>`)}
          ${row('No. HP', personal.phone, '#F8F9FB')}
          ${row('Kaos', personal.tshirtSize || '-')}
          ${row('Status', personal.maritalStatus === 'Family' ? 'Keluarga' : 'Sendiri', '#F8F9FB')}
        </table>
      </td>
      ${hasFamily ? `
      <td width="16"></td>
      <!-- Keluarga Card -->
      <td width="${familyColWidth}" style="background:#FFFFFF;border-radius:12px;border-left:4px solid #0077CC;padding:16px 18px;box-shadow:0 2px 10px rgba(0,0,0,0.07);">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;border-bottom:1px solid #F0F2F5;padding-bottom:12px;">
          <tr>
            <td style="font-size:9px;color:#8896A8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Data Keluarga</td>
          </tr>
          <tr>
            <td style="font-size:16px;font-weight:800;color:#1A2233;line-height:1.3;padding-top:2px;">${totalPeople} Anggota</td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${family.hasSpouse ? `${row('Pasangan', family.spouseName || '-')}${row('Kaos', family.spouseTshirtSize || '-', '#F8F9FB')}` : ''}
          ${family.hasChildren && family.children.length > 0 ? family.children.map((c, i) =>
            row(`Anak ${i + 1}`, `${c.name}, ${c.age} thn &nbsp;<span style="font-size:9px;color:#6B7882;">Kaos: ${c.tshirtSize || '-'}</span>`, i % 2 === 0 ? '' : '#F8F9FB')
          ).join('') : ''}
        </table>
      </td>` : ''}
    </tr>
  </table>

  <!-- FOOD ALLOCATION CARD -->
  <table width="${contentW}" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;border:2px solid #D1FAE5;padding:0;margin-bottom:14px;box-shadow:0 2px 10px rgba(0,0,0,0.07);">
    <tr>
      <td style="padding:16px 18px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
          <tr>
            <td>
              <div style="font-size:10px;color:#16A34A;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;">Alokasi Konsumsi</div>
              <div style="font-size:17px;font-weight:800;color:#1A2233;margin-top:2px;">${totalPeople} Orang Terdaftar</div>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="${iceCreamCount > 0 ? Math.floor((contentW - 72) / 3) : Math.floor((contentW - 52) / 2)}" style="background:#FFFBEB;border-radius:10px;border:1px solid #FDE68A;padding:12px 14px;">
              <div style="font-size:10px;color:#92400E;font-weight:700;text-transform:uppercase;margin-bottom:6px;">Snack Pagi</div>
              <div style="font-size:28px;font-weight:900;color:#B45309;line-height:1;">${totalPeople}</div>
              <div style="font-size:9px;color:#92400E;font-weight:600;margin-top:3px;">Porsi</div>
            </td>
            <td width="16"></td>
            <td width="${iceCreamCount > 0 ? Math.floor((contentW - 72) / 3) : Math.floor((contentW - 52) / 2)}" style="background:#FEF2F2;border-radius:10px;border:1px solid #FECACA;padding:12px 14px;">
              <div style="font-size:10px;color:#991B1B;font-weight:700;text-transform:uppercase;margin-bottom:6px;">Makan Siang</div>
              <div style="font-size:28px;font-weight:900;color:#DC2626;line-height:1;">${totalPeople}</div>
              <div style="font-size:9px;color:#991B1B;font-weight:600;margin-top:3px;">Porsi</div>
            </td>
            ${iceCreamCount > 0 ? `
            <td width="16"></td>
            <td width="${Math.floor((contentW - 72) / 3)}" style="background:#FDF4FF;border-radius:10px;border:1px solid #F0ABFC;padding:12px 14px;">
              <div style="font-size:10px;color:#86198F;font-weight:700;text-transform:uppercase;margin-bottom:6px;">Es Krim</div>
              <div style="font-size:28px;font-weight:900;color:#A21CAF;line-height:1;">${iceCreamCount}</div>
              <div style="font-size:9px;color:#86198F;font-weight:600;margin-top:3px;">Porsi (Anak &#8804;12 thn)</div>
            </td>` : ''}
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- TICKET COUNT BANNER -->
  <table width="${contentW}" cellpadding="0" cellspacing="0" style="background:#DC0032;border-radius:12px;margin-bottom:16px;">
    <tr>
      <td style="padding:16px 24px;text-align:center;">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.85);margin-bottom:6px;">Tiket Digital Anda</div>
        <div style="font-size:30px;font-weight:900;color:#FFFFFF;line-height:1;margin-bottom:6px;">${allTickets.length} Tiket</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.85);font-weight:500;line-height:1.6;">Setiap tiket memiliki QR code unik di halaman berikutnya &#183; Tunjukkan QR ke petugas saat check-in</div>
      </td>
    </tr>
  </table>

  <!-- PAGE FOOTER -->
  <table width="${contentW}" cellpadding="0" cellspacing="0" style="border-top:1px solid #E5E7EB;padding-top:10px;">
    <tr>
      <td style="font-size:9px;color:#6B7882;">Diterbitkan untuk <b style="color:#1A2233;">${personal.fullName}</b> &bull; NIK ${personal.nik}</td>
      <td style="text-align:right;font-size:9px;color:#6B7882;"><b style="color:#1A2233;">DENSO Indonesia</b> &bull; Dokumen resmi</td>
    </tr>
  </table>
</div>`;

  // ── Per-ticket QR pages ──
  const ticketPages = allTickets.map((t, idx) => {
    const qrDataURI = qrMap[t.id] ?? '';
    const label = ticketLabel(t);
    const cat = ticketCat(t);

    return `
<div class="pdf-page pdf-page-break">

  <!-- HEADER -->
  <table width="${contentW}" cellpadding="0" cellspacing="0" style="background:#1A2233;border-radius:12px;margin-bottom:20px;">
    <tr>
      <td style="padding:18px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <div style="font-size:26px;font-weight:900;font-style:italic;color:#FFFFFF;letter-spacing:-1.5px;line-height:1;">DENSO</div>
            <div style="font-size:8px;color:rgba(255,255,255,0.55);font-weight:600;text-transform:uppercase;letter-spacing:2.5px;margin-top:2px;">Family Gathering 2026</div>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <div style="font-size:13px;font-weight:700;color:#FFFFFF;line-height:1.3;">Tiket ${idx + 1} dari ${allTickets.length}</div>
            <span style="display:inline-block;background:${t.color};color:#FFF;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:4px 12px;border-radius:20px;margin-top:6px;">${label}</span>
          </td>
        </tr></table>
      </td>
    </tr>
  </table>

  <!-- MAIN CONTENT: info left, QR right -->
  <table width="${contentW}" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr valign="top">

      <!-- Info Card -->
      <td style="background:#FFFFFF;border-radius:12px;padding:20px 22px;box-shadow:0 2px 10px rgba(0,0,0,0.07);border-left:4px solid ${t.color};">
        <div style="font-size:8px;color:#8896A8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">${cat}</div>
        <div style="font-size:17px;font-weight:800;color:#1A2233;margin-bottom:4px;word-wrap:break-word;">${label}</div>
        <div style="font-size:9px;color:#6B7882;font-weight:600;margin-bottom:14px;font-family:monospace;letter-spacing:1px;">ID: <span style="color:${t.color};">${t.id}</span></div>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('Nama', t.ownerName ?? personal.fullName)}
          ${row('NIK', personal.nik, '#F8F9FB')}
          ${row('Divisi', personal.division)}
          ${row('Tanggal', '13 September 2026', '#F8F9FB')}
          ${row('Lokasi', 'Lapangan DENSO Fajar Plant')}
        </table>
      </td>

      <td width="20"></td>

      <!-- QR Card -->
      <td width="230" style="background:#F8F9FB;border-radius:12px;padding:20px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.07);border:2px solid #E5E7EB;">
        <div style="font-size:9px;font-weight:700;color:#8896A8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">Scan QR Code</div>
        <div style="display:inline-block;background:#FFFFFF;padding:8px;border-radius:10px;border:3px solid ${t.color};">
          <img src="${qrDataURI}" width="170" height="170" style="display:block;border-radius:4px;" alt="QR Code ${t.id}"/>
        </div>
        <div style="font-size:8px;color:#9AAAB3;font-weight:500;margin-top:12px;line-height:1.6;">Tunjukkan QR kepada petugas<br/>Berlaku sekali pakai</div>
        <div style="font-size:8px;font-family:monospace;color:${t.color};font-weight:700;margin-top:6px;letter-spacing:0.5px;">${t.id}</div>
      </td>

    </tr>
  </table>

  <!-- PAGE FOOTER -->
  <table width="${contentW}" cellpadding="0" cellspacing="0" style="border-top:1px solid #E5E7EB;padding-top:10px;">
    <tr>
      <td style="font-size:9px;color:#6B7882;">Tiket untuk <b style="color:#1A2233;">${t.ownerName ?? personal.fullName}</b></td>
      <td style="text-align:right;font-size:9px;color:#6B7882;"><b style="color:#1A2233;">DENSO</b> Family Gathering 2026</td>
    </tr>
  </table>
</div>`;
  }).join('');

  // ── CSS: table-based, no flexbox/grid, color-adjust forced ──
  const css = `
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html, body {
  width:${PW}px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: #1A2233;
  background: #F0F2F5;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
.pdf-page {
  width: ${PW}px;
  padding: ${PAD}px;
  background: #F0F2F5;
  page-break-after: always;
  break-after: page;
}
.pdf-page:last-child {
  page-break-after: avoid;
  break-after: avoid;
}
.pdf-page-break {
  page-break-before: always;
  break-before: page;
}
/* Ensure no element cuts mid-card */
table { border-collapse: collapse; }
td { word-wrap: break-word; overflow-wrap: break-word; }
img { display: block; max-width: 100%; }
/* Prevent any overflow hiding */
* { overflow: visible !important; }
b, strong { font-weight: 700; }
@media print {
  html, body { width: ${PW}px !important; }
  .pdf-page { padding: ${PAD}px !important; }
}`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>E-Ticket — ${personal.fullName}</title>
<style>${css}</style>
</head>
<body>
${summaryPage}
${ticketPages}
</body>
</html>`;
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
        { title: 'Tiket Registrasi',  id: generateMockTicketId('REG'), color: '#DC0032', icon: Ticket },
        { title: 'Kupon Snack Pagi',  id: generateMockTicketId('SNK'), color: '#B45309', icon: Coffee },
        { title: 'Kupon Makan Siang', id: generateMockTicketId('LNC'), color: '#C2410C', icon: UtensilsCrossed },
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
            type: (t.title.includes('Registrasi') ? 'entry' : t.title.includes('Snack') ? 'snack' : 'lunch') as 'entry' | 'snack' | 'lunch',
            label: t.title,
          })),
          ...iceTickets.map(t => ({ id: t.id, type: 'icecream' as const, label: t.title })),
        ],
      });
      setIsGenerating(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [personalData, familyData]);

  // ── Pre-generate all QR codes as data URIs ──
  const buildQRMap = async (): Promise<Record<string, string>> => {
    const allTickets = [...tickets, ...iceCreamTickets];
    const entries = await Promise.all(
      allTickets.map(async t => {
        const uri = await generateQRDataURI(t.id);
        return [t.id, uri] as [string, string];
      })
    );
    return Object.fromEntries(entries);
  };

  // ── Preview: open in new window, content centered ──
  const handlePreview = async () => {
    const qrMap = await buildQRMap();
    const html = buildPDFHtml(tickets, iceCreamTickets, personalData, familyData, qrMap);

    const pw = window.open('', '_blank');
    if (!pw) return;

    pw.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body {
    background: #6B7882;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0 40px;
  }
  .pdf-page {
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
    margin-bottom: 16px;
  }
  .print-btn {
    position: fixed; top: 16px; right: 16px;
    background: #DC0032; color: #FFF; border: none;
    padding: 10px 22px; border-radius: 8px;
    font-weight: 700; font-size: 14px; cursor: pointer;
    box-shadow: 0 4px 12px rgba(220,0,50,0.35);
    z-index: 9999;
  }
  @media print {
    html, body { background: white; padding: 0; display: block; }
    .print-btn { display: none; }
  }
</style>
</head><body>`);
    pw.document.write(`<button class="print-btn" onclick="window.print()">&#128438; Print / Save PDF</button>`);

    // Write only the inner body content from the built HTML
    const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/);
    if (bodyMatch) pw.document.write(bodyMatch[1]);

    // Inject the PDF CSS into the preview window
    const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (cssMatch) {
      const s = pw.document.createElement('style');
      s.textContent = cssMatch[1];
      pw.document.head.appendChild(s);
    }

    pw.document.write('</body></html>');
    pw.document.close();
  };

  // ── Download PDF ──
  // Pipeline: generate QR (client-side data URI) → build HTML →
  //           render in hidden iframe → wait fonts+images → html2canvas per page → jsPDF
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // 1. Generate all QR codes as PNG data URIs (client-side, zero CORS)
      const qrMap = await buildQRMap();

      // 2. Build HTML
      const html = buildPDFHtml(tickets, iceCreamTickets, personalData, familyData, qrMap);

      // 3. Load libraries
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'), import('html2canvas'),
      ]);

      // 4. Render into hidden iframe (isolated from app CSS)
      const PW = 794;
      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.cssText = `
        position:fixed;top:-99999px;left:-99999px;
        width:${PW}px;height:1200px;
        border:none;visibility:hidden;pointer-events:none;
      `;
      document.body.appendChild(iframe);

      const iDoc = iframe.contentDocument!;
      iDoc.open();
      iDoc.write(html);
      iDoc.close();

      // 5. Wait for fonts to be ready
      await iDoc.fonts.ready;

      // 6. Wait for all images — since all src are data URIs, this is nearly instant
      await new Promise<void>(resolve => {
        const imgs = Array.from(iDoc.querySelectorAll('img')) as HTMLImageElement[];
        if (imgs.length === 0) { resolve(); return; }
        let done = 0;
        const check = () => { if (++done >= imgs.length) resolve(); };
        imgs.forEach(img => {
          if (img.complete && img.naturalWidth > 0) { check(); }
          else {
            img.onload = check;
            img.onerror = check; // still proceed even if one fails
          }
        });
      });

      // 7. Small settle time for layout stabilisation
      await new Promise(r => setTimeout(r, 300));

      // 8. Render each .pdf-page into its own PDF page
      const pages = Array.from(iDoc.querySelectorAll('.pdf-page')) as HTMLElement[];
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const pdfW = pdf.internal.pageSize.getWidth();   // 210mm
      const pdfH = pdf.internal.pageSize.getHeight();  // 297mm

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];
        // Resize iframe height to match this page content exactly
        const pageH = pageEl.scrollHeight;
        iframe.style.height = `${pageH + 10}px`;
        await new Promise(r => setTimeout(r, 80)); // allow reflow

        const canvas = await html2canvas(pageEl, {
          scale: 3,            // 3× for crisp text & QR
          useCORS: false,      // all images are data URIs — no CORS needed
          allowTaint: false,
          backgroundColor: '#F0F2F5',
          width: PW,
          windowWidth: PW,
          scrollX: 0,
          scrollY: 0,
          logging: false,
          imageTimeout: 0,     // disable timeout — data URIs always instant
          removeContainer: true,
        });

        if (i > 0) pdf.addPage();

        const imgW = pdfW;
        const imgH = (canvas.height / canvas.width) * pdfW;
        // If content shorter than page, center vertically
        const yOff = imgH < pdfH ? (pdfH - imgH) / 2 : 0;
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, yOff, imgW, imgH);
      }

      document.body.removeChild(iframe);
      pdf.save(`E-Ticket_${personalData.fullName.replace(/\s+/g, '_')}.pdf`);

    } catch (err) {
      console.error('PDF error:', err);
      alert('Gagal membuat PDF. Silakan coba tombol Preview dan gunakan Print > Save as PDF.');
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
      <div className="p-6 sm:p-8 space-y-5">

        {/* Success header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#DC003212' }}>
            <CheckCircle2 className="w-7 h-7" style={{ color: '#DC0032' }} />
          </div>
          <h2 className="font-display font-extrabold text-xl" style={{ color: '#4A565E' }}>Registrasi Berhasil!</h2>
          <p className="font-sans text-sm mt-1.5 max-w-xs mx-auto" style={{ color: '#6B7882' }}>
            Tiket Anda telah diterbitkan,{' '}
            <span className="font-semibold" style={{ color: '#4A565E' }}>{personalData.fullName}</span>.
          </p>
        </div>

        {/* Ticket list */}
        <div className="space-y-3">
          {allTickets.map((ticket, i) => {
            const Icon = ticket.icon;
            return (
              <div key={i} className="rounded-2xl overflow-hidden flex"
                style={{ boxShadow: '0 2px 16px rgba(44,53,59,.10)', border: '1px solid #EEF1F3' }}>
                <div className="w-2 flex-shrink-0" style={{ background: ticket.color }} />
                <div className="flex-1 bg-white flex items-center gap-4 px-4 py-3.5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: ticket.color + '12' }}>
                    <Icon className="w-5 h-5" style={{ color: ticket.color }} strokeWidth={1.5} />
                  </div>
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
                  {/* Live QR preview using data URI */}
                  <QrCode className="w-10 h-10 flex-shrink-0" style={{ color: ticket.color }} strokeWidth={1} />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center font-sans text-xs" style={{ color: '#CDD4D8' }}>
          {allTickets.length} tiket diterbitkan · Preview atau unduh untuk menyimpan
        </p>
      </div>

      {/* Footer actions */}
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
