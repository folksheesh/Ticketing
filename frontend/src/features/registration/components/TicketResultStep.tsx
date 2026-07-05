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
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
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

function buildPDFHtml(
  tickets: TicketInfo[],
  iceCreamTickets: TicketInfo[],
  personal: PersonalData,
  family: FamilyData,
  qrDataMap?: Map<string, string> // Optional map of ticket.id -> data URI
) {
  const allTickets = [...tickets, ...iceCreamTickets];

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

  // ── ticket stripe HTML ──
  const ticketStripes = allTickets.map((t, idx) => {
    // Use data URI if available, otherwise use regular URL
    const qrSrc = qrDataMap?.get(t.id) || getQRUrl(t.id, 500);
    
    return `
  <div class="ticket-wrap">
    <div class="ticket-left" style="background:${t.color};">
      <div>
        <div class="tl-cat">${ticketCatLabel(t)}</div>
        <div class="tl-title">${ticketLabel(t)}</div>
        <div class="tl-event">DENSO Family Gathering 2026</div>
        <div class="tl-date">&#128197; 15 September 2026</div>
      </div>
      <div class="tl-num">${String(idx + 1).padStart(2, '0')}</div>
    </div>
    <div class="ticket-mid">
      <div class="tm-row">
        <div class="tm-cell">
          <div class="tm-label">NAMA</div>
          <div class="tm-val">${t.ownerName ?? personal.fullName}</div>
        </div>
        <div class="tm-cell">
          <div class="tm-label">NIK</div>
          <div class="tm-val">${personal.nik}</div>
        </div>
      </div>
      <div class="tm-row" style="margin-top:10px;">
        <div class="tm-cell">
          <div class="tm-label">DIVISI</div>
          <div class="tm-val">${personal.division}</div>
        </div>
        <div class="tm-cell">
          <div class="tm-label">ID TIKET</div>
          <div class="tm-val tm-id" style="color:${t.color};">${t.id}</div>
        </div>
      </div>
      <div class="tm-barline" style="background:${t.color}25;"></div>
      <div class="tm-note">Tunjukkan QR kepada petugas &#183; Berlaku sekali pakai</div>
    </div>
    <div class="ticket-tear" style="border-color:${t.color}40;"></div>
    <div class="ticket-right">
      <img src="${qrSrc}" class="tr-qr" alt="QR" crossorigin="anonymous"/>
      <div class="tr-scan">SCAN QR</div>
    </div>
  </div>`;
  }).join('');

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

  return `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"/>
<title>E-Ticket — ${personal.fullName}</title>
<style>
@media screen {
  /* Mobile responsive adjustments for preview */
  @media (max-width: 768px) {
    html, body { width: 100% !important; }
    .page { 
      width: 100% !important; 
      padding: 16px !important;
      max-width: 100vw;
      overflow-x: hidden;
    }
    .hdr { 
      flex-direction: column; 
      gap: 12px; 
      text-align: center;
      padding: 14px 16px !important;
    }
    .hdr-event, .hdr-date, .hdr-badge { text-align: center; }
    .icard-body { 
      flex-direction: column !important; 
      gap: 16px !important;
    }
    .section + .section { 
      border-left: none !important; 
      border-top: 1px solid #EBEDF0;
      padding-left: 0 !important;
      padding-top: 16px;
    }
    .ticket-wrap {
      flex-direction: column !important;
      height: auto !important;
    }
    .ticket-left {
      width: 100% !important;
      padding: 16px !important;
    }
    .tl-num { 
      position: static !important;
      text-align: right;
      margin-top: 8px;
    }
    .ticket-mid {
      width: 100% !important;
      padding: 16px !important;
    }
    .ticket-tear {
      width: 100% !important;
      height: 0 !important;
      border-left: none !important;
      border-top: 2px dashed !important;
      margin: 0 !important;
    }
    .ticket-right {
      width: 100% !important;
      padding: 20px !important;
    }
    .tr-qr {
      width: 120px !important;
      height: 120px !important;
    }
    .footer {
      flex-direction: column !important;
      gap: 8px;
      text-align: center !important;
    }
    .ft { text-align: center !important; }
  }
}

/* Print styles - maintain original A4 layout */
@media print {
  html, body { width: ${A4_W}px !important; }
  .page { width: ${A4_W}px !important; padding: 28px 36px 32px !important; }
  .ticket-wrap { 
    flex-direction: row !important; 
    height: 112px !important;
  }
  .ticket-left { width: 196px !important; }
  .ticket-mid { flex: 1 !important; }
  .ticket-right { width: 122px !important; }
  .icard-body { 
    flex-direction: row !important; 
    gap: 24px !important;
  }
  .section + .section { 
    border-left: 1px solid #EBEDF0 !important;
    border-top: none !important;
    padding-left: 24px !important;
    padding-top: 0 !important;
  }
}
</style>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${A4_W}px;background:#F0F2F5;font-family:'Segoe UI',Arial,sans-serif;color:#1A2233;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.page{width:${A4_W}px;background:#F0F2F5;padding:28px 36px 32px;}
/* HEADER */
.hdr{display:flex;align-items:center;justify-content:space-between;background:#1A2233;border-radius:14px;padding:18px 28px;margin-bottom:16px;}
.hdr-logo{font-size:30px;font-weight:900;font-style:italic;color:#FFFFFF;letter-spacing:-1.5px;line-height:1;}
.hdr-tag{font-size:8.5px;color:#8896A8;font-weight:500;text-transform:uppercase;letter-spacing:2px;margin-top:3px;}
.hdr-event{font-size:14px;font-weight:700;color:#FFF;line-height:1.2;text-align:right;}
.hdr-date{font-size:10px;color:#8896A8;margin-top:3px;text-align:right;}
.hdr-badge{display:inline-block;background:#DC0032;color:#FFF;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:3px 10px;border-radius:20px;margin-top:6px;}
/* INFO CARD */
.icard{background:#FFF;border-radius:12px;overflow:hidden;margin-bottom:14px;box-shadow:0 2px 8px rgba(0,0,0,.07);}
.icard-hdr{background:linear-gradient(90deg,#DC0032 0%,#A8001E 100%);padding:9px 20px;display:flex;align-items:center;gap:8px;}
.icard-icon{font-size:13px;}
.icard-title{font-size:10px;font-weight:800;color:#FFF;text-transform:uppercase;letter-spacing:1.5px;}
.icard-body{padding:14px 20px;display:flex;gap:24px;}
.section{flex:1;}
.section+.section{border-left:1px solid #EBEDF0;padding-left:24px;}
.section-title{font-size:8.5px;font-weight:700;color:#8896A8;text-transform:uppercase;letter-spacing:1.2px;display:flex;align-items:center;gap:5px;margin-bottom:8px;}
.sdot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.info-table{width:100%;border-collapse:collapse;}
.si-key{font-size:10.5px;color:#8896A8;font-weight:600;padding:2.5px 0;width:100px;vertical-align:top;}
.si-sep{color:#CDD4D8;padding:2.5px 6px;vertical-align:top;}
.si-val{font-size:11px;color:#1A2233;font-weight:600;padding:2.5px 0;vertical-align:top;}
/* DIVIDER */
.div-row{display:flex;align-items:center;gap:10px;margin:14px 0 10px;}
.div-line{flex:1;height:1px;background:#D0D5DD;}
.div-txt{font-size:8.5px;font-weight:700;color:#8896A8;text-transform:uppercase;letter-spacing:1.5px;white-space:nowrap;}
/* TICKET */
.ticket-wrap{display:flex;background:#FFF;border-radius:12px;overflow:hidden;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,.07);height:112px;}
.ticket-left{width:196px;flex-shrink:0;padding:14px 16px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;}
.ticket-left::after{content:'';position:absolute;right:-20px;top:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.08);}
.tl-cat{font-size:7px;font-weight:700;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:1.8px;margin-bottom:3px;}
.tl-title{font-size:13.5px;font-weight:800;color:#FFF;line-height:1.15;letter-spacing:-.3px;}
.tl-event{font-size:8px;color:rgba(255,255,255,.6);margin-top:4px;}
.tl-date{font-size:8px;color:rgba(255,255,255,.75);margin-top:2px;font-weight:600;}
.tl-num{font-size:32px;font-weight:900;color:rgba(255,255,255,.1);line-height:1;font-style:italic;position:absolute;bottom:7px;right:11px;}
.ticket-mid{flex:1;padding:12px 16px;display:flex;flex-direction:column;justify-content:center;}
.tm-row{display:flex;gap:16px;}
.tm-cell{flex:1;}
.tm-label{font-size:7px;font-weight:700;color:#9AAAB3;text-transform:uppercase;letter-spacing:.8px;margin-bottom:2px;}
.tm-val{font-size:12px;font-weight:700;color:#1A2233;line-height:1.2;}
.tm-id{font-family:monospace;font-size:10.5px;letter-spacing:1.5px;font-weight:800;}
.tm-barline{height:2.5px;border-radius:2px;margin:9px 0 6px;}
.tm-note{font-size:8px;color:#B0BAC7;font-weight:500;}
.ticket-tear{width:0;border-left:2px dashed;margin:12px 0;flex-shrink:0;}
.ticket-right{width:122px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#F8F9FB;padding:10px 12px;}
.tr-qr{width:88px;height:88px;display:block;border-radius:7px;border:2.5px solid #DC0032;padding:2px;background:white;}
.tr-scan{font-size:7px;font-weight:800;color:#8896A8;text-transform:uppercase;letter-spacing:1.5px;}
/* FOOTER */
.footer{margin-top:16px;border-top:1px solid #D0D5DD;padding-top:10px;display:flex;justify-content:space-between;align-items:center;}
.ft{font-size:9px;color:#8896A8;font-weight:500;}
.ft b{color:#1A2233;font-weight:700;}
</style>
</head>
<body><div class="page">

<div class="hdr">
  <div><div class="hdr-logo">DENSO</div><div class="hdr-tag">Crafting the Core</div></div>
  <div><div class="hdr-event">Family Gathering 2026</div><div class="hdr-date">Minggu, 15 September 2026</div><div style="text-align:right;"><div class="hdr-badge">E-Ticket Resmi</div></div></div>
</div>

<div class="icard">
  <div class="icard-hdr"><span class="icard-icon">&#128203;</span><span class="icard-title">Rekap Data Registrasi</span></div>
  <div class="icard-body">
    <div class="section">
      <div class="section-title"><span class="sdot" style="background:#DC0032;"></span>Data Karyawan</div>
      <table class="info-table">${infoRows}</table>
    </div>
    ${familySectionHtml}
  </div>
</div>

<div class="div-row"><div class="div-line"></div><div class="div-txt">&#127903; Tiket Anda (${allTickets.length} tiket)</div><div class="div-line"></div></div>

${ticketStripes}

<div class="footer">
  <div class="ft">Diterbitkan untuk <b>${personal.fullName}</b> &nbsp;&#183;&nbsp; NIK ${personal.nik}</div>
  <div class="ft" style="text-align:right;"><b>DENSO Indonesia</b> &nbsp;&#183;&nbsp; Dokumen resmi, harap simpan dengan baik</div>
</div>

</div></body></html>`;
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
    const html = buildPDFHtml(tickets, iceCreamTickets, personalData, familyData);
    const pw = window.open('', '_blank', 'width=600,height=900');
    if (pw) { pw.document.write(html); pw.document.close(); }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'), import('html2canvas'),
      ]);

      const allTickets = [...tickets, ...iceCreamTickets];

      // Pre-load all QR codes as data URIs to avoid CORS issues on mobile
      const qrDataMap = new Map<string, string>();
      await Promise.all(
        allTickets.map(async (ticket) => {
          const dataURI = await loadImageAsDataURI(getQRUrl(ticket.id, 500));
          qrDataMap.set(ticket.id, dataURI);
        })
      );

      const html = buildPDFHtml(tickets, iceCreamTickets, personalData, familyData, qrDataMap);

      // Use an isolated iframe to avoid global CSS interference
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${A4_W}px;height:1px;border:none;visibility:hidden;`;
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Cannot access iframe document');

      iframeDoc.open();
      iframeDoc.write(html.replace(/<script[\s\S]*?<\/script>/gi, ''));
      iframeDoc.close();

      // Resize iframe to full content height
      await new Promise(resolve => setTimeout(resolve, 300));
      const scrollH = iframeDoc.body.scrollHeight || 1200;
      iframe.style.height = scrollH + 'px';

      // Wait for all images to load (data URIs should load instantly, but wait to be safe)
      await new Promise<void>(resolve => {
        const imgs = iframeDoc.querySelectorAll('img');
        if (!imgs.length) { setTimeout(resolve, 200); return; }
        let done = 0;
        const total = imgs.length;
        imgs.forEach(img => {
          const el = img as HTMLImageElement;
          const finish = () => { if (++done >= total) resolve(); };
          if (el.complete && el.naturalHeight > 0) {
            finish();
          } else {
            const t = setTimeout(finish, 3000);
            el.onload = () => { clearTimeout(t); finish(); };
            el.onerror = () => { clearTimeout(t); finish(); };
          }
        });
      });

      // Extra settle time
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: false, // Not needed since we're using data URIs
        allowTaint: true,
        backgroundColor: '#F0F2F5',
        width: A4_W,
        windowWidth: A4_W,
        logging: false,
      });

      document.body.removeChild(iframe);

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * pageW) / canvas.width;

      let yOffset = 0;
      let page = 0;
      let remaining = imgH;

      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, -yOffset, imgW, imgH);
        remaining -= pageH;
        yOffset += pageH;
        page++;
      }

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
