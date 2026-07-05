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
body{font-family:'Plus Jakarta Sans',sans-serif;background:#F5F7F8;padding:24px 16px 48px;color:#2C353B;}

.page-header{max-width:540px;margin:0 auto 20px;text-align:center;}
.page-header-logo{font-size:42px;font-weight:900;font-style:italic;color:#DC0032;letter-spacing:-2px;margin-bottom:4px;line-height:1;}
.page-header-sub{font-size:11px;color:#9AAAB3;font-weight:500;text-transform:uppercase;letter-spacing:1.5px;}
.page-header-instruction{margin-top:12px;font-size:11.5px;color:#6B7882;background:#fff;border-radius:12px;padding:10px 16px;border:1px solid #EEF1F3;line-height:1.5;}

/* ── Summary card (REKAP) ── */
.summary{max-width:540px;margin:0 auto 20px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(44,53,59,.12);border:1px solid #EEF1F3;page-break-inside:avoid;}
.summary-head{background:linear-gradient(135deg,#DC0032 0%,#B8002A 100%);padding:14px 20px;color:white;}
.summary-head-title{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;}
.summary-body{padding:18px 20px;}
.summary-section{margin-bottom:16px;}
.summary-section:last-child{margin-bottom:0;}
.summary-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#DC0032;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #DC003220;}
.summary-row{display:flex;margin-bottom:6px;font-size:12px;line-height:1.5;}
.summary-key{width:140px;flex-shrink:0;color:#6B7882;font-weight:600;}
.summary-val{flex:1;color:#2C353B;font-weight:500;word-wrap:break-word;}
table.child-table{width:100%;border-collapse:collapse;font-size:11px;margin-top:4px;}
table.child-table th{background:#F5F7F8;padding:8px 12px;text-align:left;font-size:10px;color:#6B7882;font-weight:700;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid #EEF1F3;}
table.child-table td{padding:8px 12px;border-bottom:1px solid #EEF1F3;color:#2C353B;font-weight:500;}
table.child-table tr:last-child td{border-bottom:none;}

/* ── Ticket card ── */
.ticket{max-width:540px;margin:0 auto 18px;border-radius:16px;overflow:hidden;box-shadow:0 6px 28px rgba(44,53,59,.14);border:1px solid #EEF1F3;page-break-inside:avoid;}

.ticket-head{padding:16px 20px;display:flex;justify-content:space-between;align-items:flex-start;color:white;}
.ticket-head-left{}
.event-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;opacity:.75;margin-bottom:3px;}
.ticket-type{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2.5px;opacity:.9;margin-bottom:3px;}
.ticket-title{font-size:18px;font-weight:800;letter-spacing:-.4px;line-height:1.15;}
.denso-mark{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;font-style:italic;color:white;border:2px solid rgba(255,255,255,.25);}

.ticket-body{background:#fff;display:flex;align-items:stretch;}
.ticket-body-left{flex:1;padding:16px 16px 16px 20px;display:flex;flex-direction:column;gap:8px;}
.info-row{display:flex;flex-direction:column;gap:2px;}
.info-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9AAAB3;}
.info-val{font-size:13px;font-weight:600;color:#2C353B;line-height:1.3;word-wrap:break-word;}
.ticket-id-block{margin-top:auto;padding-top:10px;border-top:1px solid #EEF1F3;}
.ticket-id-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#9AAAB3;margin-bottom:3px;}
.ticket-id-val{font-family:monospace;font-size:12px;font-weight:800;letter-spacing:1.8px;}

.ticket-divider{width:1px;background:#EEF1F3;position:relative;flex-shrink:0;margin:12px 0;}
.notch{width:16px;height:16px;border-radius:50%;background:#F5F7F8;position:absolute;left:50%;transform:translateX(-50%);border:1px solid #EEF1F3;}
.notch.top{top:-8px;}.notch.bot{bottom:-8px;}
.dashed-line{position:absolute;top:16px;bottom:16px;left:50%;border-left:1.5px dashed #CDD4D8;}

.ticket-body-right{width:150px;flex-shrink:0;padding:14px 16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}
.qr-img{width:120px;height:120px;display:block;border-radius:8px;border:3px solid #DC0032;padding:2px;background:white;image-rendering:pixelated;}
.qr-hint{font-size:8px;color:#6B7882;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:.8px;line-height:1.2;}

@media print{
  body{background:white;padding:12px 8px;}
  .ticket,.summary{box-shadow:none;border:1px solid #DDD;max-width:100%;margin-bottom:14px;}
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
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:580px;background:#F5F7F8;padding:20px;z-index:-9999;';
      container.innerHTML = html.replace(/<script[\s\S]*?<\/script>/gi, '');
      document.body.appendChild(container);
      
      // Wait for all images to load
      await new Promise<void>(resolve => {
        const imgs = container.querySelectorAll('img');
        if (!imgs.length) { resolve(); return; }
        let loaded = 0;
        imgs.forEach((img) => {
          const imageElement = img as HTMLImageElement;
          const done = () => { 
            loaded++;
            if (loaded === imgs.length) resolve(); 
          };
          if (imageElement.complete) {
            done();
          } else {
            imageElement.onload = done;
            imageElement.onerror = done;
          }
        });
      });
      
      // Add delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(container, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#F5F7F8', 
        width: 580,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
      });
      
      document.body.removeChild(container);
      
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW - 4; // margin
      const imgH = (canvas.height * imgW) / canvas.width;
      
      let yPos = 0;
      let pageIndex = 0;
      let remaining = imgH;
      
      while (remaining > 0) {
        const heightLeft = remaining;
        let position = 0;
        
        if (pageIndex > 0) {
          pdf.addPage();
          position = heightLeft - pageH;
        } else {
          position = 0;
        }
        
        const sourceY = yPos * canvas.height / imgH;
        const sourceHeight = Math.min(pageH * canvas.height / imgH, canvas.height - sourceY);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
          pdf.addImage(tempCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', 2, position + 2, imgW, (sourceHeight * imgW) / canvas.width);
        }
        
        remaining -= pageH;
        yPos += pageH;
        pageIndex++;
      }
      
      pdf.save(`E-Ticket_${personalData.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF Error:', err);
      alert('Gagal membuat PDF. Coba Preview lalu simpan manual.');
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
