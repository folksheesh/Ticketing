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
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=DC0032&bgcolor=ffffff&qzone=1&format=svg`;

interface TicketInfo {
  title: string;
  id: string;
  color: string;
  icon: LucideIcon;
  ownerName?: string;
}

// ─── PDF Template ─────────────────────────────────────────────────────────────
function buildPDFHtml(
  tickets: TicketInfo[],
  iceCreamTickets: TicketInfo[],
  personal: PersonalData,
  family: FamilyData
) {
  const allTickets = [...tickets, ...iceCreamTickets];

  const ticketLabel = (t: TicketInfo) => {
    if (t.icon === Ticket)          return 'TIKET MASUK';
    if (t.icon === Coffee)          return 'SNACK PAGI';
    if (t.icon === UtensilsCrossed) return 'MAKAN SIANG';
    if (t.icon === IceCream2)       return 'ES KRIM';
    return 'TIKET';
  };

  const childRows = (family.hasChildren && family.children.length > 0)
    ? family.children.map(c => `<tr><td>${c.name}</td><td>${c.age} thn</td><td>${c.tshirtSize || '-'}</td></tr>`).join('')
    : '';

  // Summary card HTML
  const summaryHtml = `
<div class="summary">
  <div class="summary-head">
    <div class="summary-head-title">📋 Rekap Data Registrasi</div>
  </div>
  <div class="summary-body">
    <div class="summary-section">
      <div class="summary-section-title">Data Karyawan</div>
      <div class="summary-row"><span class="summary-key">Nama Lengkap</span><span class="summary-val">${personal.fullName}</span></div>
      <div class="summary-row"><span class="summary-key">NIK</span><span class="summary-val">${personal.nik}</span></div>
      <div class="summary-row"><span class="summary-key">Divisi</span><span class="summary-val">${personal.division}</span></div>
      <div class="summary-row"><span class="summary-key">Email</span><span class="summary-val">${personal.email}</span></div>
      <div class="summary-row"><span class="summary-key">No. HP</span><span class="summary-val">${personal.phone}</span></div>
      <div class="summary-row"><span class="summary-key">Ukuran Kaos</span><span class="summary-val">${personal.tshirtSize || '-'}</span></div>
      <div class="summary-row"><span class="summary-key">Status</span><span class="summary-val">${personal.maritalStatus === 'Family' ? 'Membawa Keluarga' : 'Sendiri'}</span></div>
    </div>
    ${personal.maritalStatus === 'Family' ? `
    <div class="summary-section">
      <div class="summary-section-title">Data Keluarga</div>
      ${family.hasSpouse ? `
        <div class="summary-row"><span class="summary-key">Nama Pasangan</span><span class="summary-val">${family.spouseName}</span></div>
        <div class="summary-row"><span class="summary-key">Ukuran Kaos Pasangan</span><span class="summary-val">${family.spouseTshirtSize || '-'}</span></div>
      ` : ''}
      ${childRows ? `
        <div style="margin-top:12px;">
          <div style="font-size:10px;font-weight:600;color:#6B7882;margin-bottom:8px;">Daftar Anak:</div>
          <table class="child-table">
            <tr><th>Nama Anak</th><th>Usia</th><th>Ukuran Kaos</th></tr>
            ${childRows}
          </table>
        </div>` : ''}
    </div>` : ''}
  </div>
</div>`;

  // Ticket cards HTML
  const ticketCards = allTickets.map(t => `
    <div class="ticket">
      <div class="ticket-head" style="background:${t.color};">
        <div class="ticket-head-left">
          <div class="event-label">DENSO Family Gathering 2026</div>
          <div class="ticket-type">${ticketLabel(t)}</div>
          <div class="ticket-title">${t.title}</div>
        </div>
        <div class="ticket-head-right">
          <div class="denso-mark">D</div>
        </div>
      </div>
      <div class="ticket-body">
        <div class="ticket-body-left">
          <div class="info-row">
            <span class="info-label">Nama</span>
            <span class="info-val">${t.ownerName ?? personal.fullName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">NIK</span>
            <span class="info-val">${personal.nik}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Divisi</span>
            <span class="info-val">${personal.division}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tanggal</span>
            <span class="info-val">15 September 2026</span>
          </div>
          <div class="ticket-id-block">
            <div class="ticket-id-label">ID TIKET</div>
            <div class="ticket-id-val" style="color:${t.color}">${t.id}</div>
          </div>
        </div>
        <div class="ticket-divider">
          <div class="notch top"></div>
          <div class="dashed-line"></div>
          <div class="notch bot"></div>
        </div>
        <div class="ticket-body-right">
          <img src="${getQRUrl(t.id, 400)}" class="qr-img" alt="QR Code" />
          <div class="qr-hint">Scan untuk verifikasi</div>
        </div>
      </div>
    </div>`).join('');

  return `<!DOCTYPE html><html lang="id"><head>
<meta charset="UTF-8"/>
<title>E-Ticket – ${personal.fullName} · DENSO Family Gathering 2026</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#FFFFFF;padding:0;margin:0;color:#2C353B;}
html{background:#FFFFFF;}

.page-header{max-width:540px;margin:16px auto 16px;text-align:center;padding:12px 16px;}
.page-header-logo{font-size:42px;font-weight:900;font-style:italic;color:#DC0032;letter-spacing:-2px;margin-bottom:4px;line-height:1;}
.page-header-sub{font-size:11px;color:#6B7882;font-weight:500;text-transform:uppercase;letter-spacing:1.5px;}
.page-header-instruction{margin-top:12px;font-size:11px;color:#4A565E;background:#FFFAF9;border-radius:8px;padding:10px 14px;border:1px solid #DC003220;line-height:1.5;}

/* ── Summary card (REKAP) ── */
.summary{max-width:540px;margin:12px auto;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);border:1px solid #EEEFF3;page-break-inside:avoid;}
.summary-head{background:linear-gradient(135deg,#DC0032 0%,#B8001A 100%);padding:12px 16px;color:white;display:flex;align-items:center;gap:10px;}
.summary-head-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;}
.summary-body{padding:14px 16px;}
.summary-section{margin-bottom:16px;}
.summary-section:last-child{margin-bottom:0;}
.summary-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#DC0032;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #DC003215;}
.summary-row{display:flex;margin-bottom:5px;font-size:11px;line-height:1.4;}
.summary-key{width:130px;flex-shrink:0;color:#6B7882;font-weight:600;}
.summary-val{flex:1;color:#1F2937;font-weight:500;word-wrap:break-word;}
table.child-table{width:100%;border-collapse:collapse;font-size:10px;margin-top:6px;border:1px solid #EEEFF3;}
table.child-table th{background:#DC0032;color:white;padding:7px 10px;text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
table.child-table td{padding:7px 10px;border-bottom:1px solid #EEEFF3;color:#1F2937;font-weight:500;background:white;}
table.child-table tr:last-child td{border-bottom:none;}
table.child-table tr:nth-child(even) td{background:#FAFBFC;}

/* ── Ticket card ── */
.ticket{max-width:540px;margin:12px auto;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);border:1px solid #EEEFF3;page-break-inside:avoid;background:#FFFFFF;}

.ticket-head{padding:14px 16px;display:flex;justify-content:space-between;align-items:flex-start;color:white;}
.ticket-head-left{}
.event-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;opacity:.8;margin-bottom:2px;}
.ticket-type{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;opacity:.9;margin-bottom:2px;}
.ticket-title{font-size:16px;font-weight:800;letter-spacing:-.3px;line-height:1.1;}
.denso-mark{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;font-style:italic;color:white;border:2px solid rgba(255,255,255,.25);}

.ticket-body{background:#fff;display:flex;align-items:stretch;}
.ticket-body-left{flex:1;padding:12px 12px 12px 16px;display:flex;flex-direction:column;gap:6px;}
.info-row{display:flex;flex-direction:column;gap:1.5px;}
.info-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:#6B7882;}
.info-val{font-size:12px;font-weight:600;color:#1F2937;line-height:1.2;word-wrap:break-word;}
.ticket-id-block{margin-top:auto;padding-top:8px;border-top:1px solid #EEEFF3;}
.ticket-id-label{font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6B7882;margin-bottom:2px;}
.ticket-id-val{font-family:monospace;font-size:11px;font-weight:800;letter-spacing:1.5px;}

.ticket-divider{width:1px;background:#EEEFF3;position:relative;flex-shrink:0;margin:10px 0;}
.notch{width:14px;height:14px;border-radius:50%;background:#FFFFFF;position:absolute;left:50%;transform:translateX(-50%);border:1px solid #EEEFF3;}
.notch.top{top:-7px;}.notch.bot{bottom:-7px;}
.dashed-line{position:absolute;top:14px;bottom:14px;left:50%;border-left:1.5px dashed #CDD4D8;}

.ticket-body-right{width:130px;flex-shrink:0;padding:12px 12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;}
.qr-img{width:110px;height:110px;display:block;border-radius:8px;border:2.5px solid #DC0032;padding:2px;background:white;image-rendering:pixelated;}
.qr-hint{font-size:8px;color:#6B7882;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:.8px;line-height:1.2;}

@media print{
  body{background:#FFFFFF;padding:0;margin:0;}
  html{background:#FFFFFF;}
  .ticket,.summary{box-shadow:none;border:1px solid #DDD;max-width:100%;margin:8px 0;}
  .page-header-instruction{page-break-after:avoid;}
  .summary{page-break-after:avoid;}
}
</style>
</head><body>

<div class="page-header">
  <div class="page-header-logo">DENSO</div>
  <div class="page-header-sub">Crafting the Core</div>
  <div class="page-header-instruction">
    📋 Tunjukkan QR Code kepada petugas di setiap pos. Setiap tiket hanya berlaku sekali scan.
  </div>
</div>

${summaryHtml}

${ticketCards}

<script>
  window.onload=function(){
    var imgs=document.querySelectorAll('img');
    var n=0;
    if(!imgs.length){window.print();return;}
    imgs.forEach(function(img){
      var done=function(){if(++n===imgs.length)window.print();};
      if(img.complete)done();else{img.onload=done;img.onerror=done;}
    });
  };
<\/script>
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

      const html = buildPDFHtml(tickets, iceCreamTickets, personalData, familyData);

      // Use an isolated iframe to avoid global CSS interference
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:620px;height:1px;border:none;visibility:hidden;';
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

      // Wait for all QR images to load
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
            const t = setTimeout(finish, 6000);
            el.onload = () => { clearTimeout(t); finish(); };
            el.onerror = () => { clearTimeout(t); finish(); };
          }
        });
      });

      // Extra settle time
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        width: 600,
        windowWidth: 620,
        logging: false,
        imageTimeout: 10000,
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
