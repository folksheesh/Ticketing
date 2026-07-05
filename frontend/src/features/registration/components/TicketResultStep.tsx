import { useEffect, useRef, useState } from 'react';
import { QrCode, Download, Mail, MessageCircle, IceCream, Utensils, Coffee, CheckCircle2, Eye } from 'lucide-react';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { useAdminStore } from '../../admin/store/useAdminStore';
import { RippleButton } from '../../../components/atoms/RippleButton';
import { cn } from '../../../lib/cn';
import type { PersonalData, FamilyData } from '../types';

const generateMockTicketId = (prefix: string) =>
  `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

const getQRUrl = (data: string, size = 200) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=002060&bgcolor=ffffff&qzone=2`;

interface TicketInfo {
  title: string;
  id: string;
  color: string;
  emoji: string;
  ownerName?: string;
}

// ─── PDF ticket HTML template ────────────────────────────────────────────────
function buildPDFHtml(
  tickets: TicketInfo[],
  iceCreamTickets: TicketInfo[],
  personal: PersonalData,
  family: FamilyData
) {
  const allTickets = [...tickets, ...iceCreamTickets];

  const cards = allTickets
    .map(
      t => `
    <div class="ticket">
      <div class="ticket-top" style="background:${t.color}">
        <span class="emoji">${t.emoji}</span>
        <div>
          <div class="sub">DENSO Family Gathering 2025</div>
          <div class="title">${t.title}</div>
        </div>
      </div>
      <div class="owner-bar">
        <span class="label">Atas Nama</span><span class="val">${t.ownerName ?? personal.fullName}</span>
        <span class="dot">·</span>
        <span class="label">NIK</span><span class="val">${personal.nik}</span>
        <span class="dot">·</span>
        <span class="label">Divisi</span><span class="val">${personal.division}</span>
      </div>
      <div class="qr-area">
        <img src="${getQRUrl(t.id, 600)}" class="qr" alt="QR"/>
        <p class="scan-hint">Scan QR Code untuk verifikasi</p>
      </div>
      <div class="punch">
        <div class="circle l"></div>
        <div class="dash"></div>
        <div class="circle r"></div>
      </div>
      <div class="footer">
        <span class="id-label">ID TIKET</span>
        <span class="id-val" style="color:${t.color}">${t.id}</span>
      </div>
    </div>`
    )
    .join('');

  return `<!DOCTYPE html><html lang="id"><head>
<meta charset="UTF-8"/>
<title>E-Ticket · ${personal.fullName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',sans-serif;background:#f1f5f9;padding:28px 16px 48px;color:#0f172a}
  h1{text-align:center;font-size:17px;font-weight:800;color:#002060;margin-bottom:4px}
  .sub-head{text-align:center;font-size:12px;color:#64748b;margin-bottom:28px}
  .ticket{background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,32,96,.12);max-width:460px;margin:0 auto 32px}
  .ticket-top{padding:18px 22px;display:flex;align-items:center;gap:14px;color:white}
  .emoji{font-size:30px;line-height:1}
  .sub{font-size:9px;font-weight:600;opacity:.7;text-transform:uppercase;letter-spacing:.8px}
  .title{font-size:18px;font-weight:800;letter-spacing:-.3px;margin-top:2px}
  .owner-bar{background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:9px 22px;display:flex;flex-wrap:wrap;gap:5px;align-items:center;font-size:11px}
  .label{color:#94a3b8;font-weight:600;text-transform:uppercase;font-size:9.5px;letter-spacing:.5px}
  .val{color:#1e293b;font-weight:700}
  .dot{color:#cbd5e1}
  .qr-area{padding:24px 22px 16px;display:flex;flex-direction:column;align-items:center;background:white}
  .qr{width:100%;max-width:360px;height:auto;border-radius:12px;border:1.5px solid #e2e8f0;display:block}
  .scan-hint{font-size:10px;color:#94a3b8;margin-top:10px;font-weight:500}
  .punch{display:flex;align-items:center;background:white}
  .circle{width:22px;height:22px;border-radius:50%;background:#f1f5f9;border:1.5px solid #e2e8f0;flex-shrink:0}
  .l{margin-left:-11px}.r{margin-right:-11px}
  .dash{flex:1;border-top:2px dashed #cbd5e1;margin:0 10px}
  .footer{background:white;padding:12px 22px 16px;display:flex;align-items:center;justify-content:center;gap:10px}
  .id-label{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px}
  .id-val{font-family:monospace;font-size:14px;font-weight:800;letter-spacing:2px}
  @media print{body{background:white;padding:0}.ticket{break-inside:avoid;box-shadow:none;border:1px solid #e2e8f0;max-width:100%;margin-bottom:20px}}
  .rekap-container{background:white;border-radius:20px;padding:24px;box-shadow:0 8px 32px rgba(0,32,96,.12);max-width:460px;margin:0 auto 32px;page-break-inside:avoid;}
  .rekap-container h2{font-size:15px;color:#002060;margin-bottom:16px;border-bottom:1px solid #e2e8f0;padding-bottom:8px;font-weight:800;text-align:left;}
  .rekap-section{margin-bottom:16px;}
  .rekap-section:last-child{margin-bottom:0;}
  .rekap-section h3{font-size:13px;color:#0f172a;margin-bottom:8px;font-weight:700;}
  .rekap-table{width:100%;border-collapse:collapse;font-size:11px;}
  .rekap-table td{padding:4px 0;vertical-align:top;color:#334155;}
  .rekap-table td:first-child{width:140px;font-weight:600;color:#64748b;}
  .rekap-table-child{width:100%;border-collapse:collapse;font-size:11px;margin-top:8px;}
  .rekap-table-child th{padding:6px;background:#f8fafc;font-size:10px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0;font-weight:600;}
  .rekap-table-child td{padding:6px;border-bottom:1px solid #e2e8f0;color:#334155;}
  @media print{
    .rekap-container{box-shadow:none;border:1px solid #e2e8f0;max-width:100%;margin-bottom:20px;}
  }
</style>
</head><body>
<h1>🎪 DENSO Family Gathering 2025</h1>
<p class="sub-head">E-Ticket Resmi · Tunjukkan QR Code kepada petugas saat check-in</p>
${cards}

<div class="rekap-container">
  <h2>Rekap Data Registrasi</h2>
  <div class="rekap-section">
    <h3>Data Peserta</h3>
    <table class="rekap-table">
      <tr><td>Nama Lengkap</td><td>: ${personal.fullName}</td></tr>
      <tr><td>NIK</td><td>: ${personal.nik}</td></tr>
      <tr><td>Divisi</td><td>: ${personal.division}</td></tr>
      <tr><td>Email</td><td>: ${personal.email}</td></tr>
      <tr><td>No. HP</td><td>: ${personal.phone}</td></tr>
      <tr><td>Ukuran Kaos</td><td>: ${personal.tshirtSize || '-'}</td></tr>
      <tr><td>Status Marital</td><td>: ${personal.maritalStatus}</td></tr>
    </table>
  </div>
  ${personal.maritalStatus === 'Family' ? `
    <div class="rekap-section">
      <h3>Data Keluarga</h3>
      ${family.hasSpouse ? `
      <table class="rekap-table">
        <tr><td>Nama Pasangan</td><td>: ${family.spouseName}</td></tr>
        <tr><td>Ukuran Kaos Pasangan</td><td>: ${family.spouseTshirtSize || '-'}</td></tr>
      </table>
      ` : ''}
      ${family.hasChildren && family.children.length > 0 ? `
      <table class="rekap-table-child">
        <tr>
          <th>Nama Anak</th>
          <th>Usia</th>
          <th>Ukuran Kaos</th>
        </tr>
        ${family.children.map(c => `
          <tr>
            <td>${c.name}</td>
            <td>${c.age} Tahun</td>
            <td>${c.tshirtSize || '-'}</td>
          </tr>
        `).join('')}
      </table>
      ` : ''}
      ${!family.hasSpouse && (!family.hasChildren || family.children.length === 0) ? '<p style="font-size:11px;color:#64748b;margin-top:4px;">Tidak ada data keluarga yang diisi.</p>' : ''}
    </div>
  ` : ''}
</div>

<script>
  window.onload=function(){
    const imgs=document.querySelectorAll('img');
    let n=0;
    if(!imgs.length){window.print();return;}
    imgs.forEach(img=>{
      const done=()=>{if(++n===imgs.length)window.print();};
      if(img.complete)done();else{img.onload=done;img.onerror=done;}
    });
  };
<\/script>
</body></html>`;
}

// ─── Component ───────────────────────────────────────────────────────────────
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
        { title: 'Tiket Masuk & Souvenir', id: generateMockTicketId('REG'), color: '#002060', emoji: '🎫' },
        { title: 'Kupon Snack Pagi',        id: generateMockTicketId('SNK'), color: '#B45309', emoji: '☕' },
        { title: 'Kupon Makan Siang',        id: generateMockTicketId('LNC'), color: '#C2410C', emoji: '🍽️' },
      ];

      let iceTickets: TicketInfo[] = [];
      if (personalData.maritalStatus === 'Family' && familyData.hasChildren) {
        const kids = familyData.children.filter(c => c.age <= 12);
        iceTickets = kids.map(kid => ({
          title: 'Kupon Es Krim',
          id: generateMockTicketId('ICE'),
          color: '#9D174D',
          emoji: '🍦',
          ownerName: kid.name,
        }));
      }

      setTickets(mainTickets);
      setIceCreamTickets(iceTickets);

      // Sync to admin store so scanner can find these tickets
      registerEmployee({
        fullName: personalData.fullName,
        nik: personalData.nik,
        division: personalData.division,
        email: personalData.email,
        phone: personalData.phone,
        tshirtSize: personalData.tshirtSize as string,
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
    }, 2000);
    return () => clearTimeout(timer);
  }, [personalData, familyData]);

  // Preview → buka di window baru
  const handlePreview = () => {
    const html = buildPDFHtml(tickets, iceCreamTickets, personalData, familyData);
    const pw = window.open('', '_blank', 'width=560,height=900');
    if (pw) { pw.document.write(html); pw.document.close(); }
  };

  // Unduh PDF → langsung download tanpa print dialog via html2canvas + jsPDF
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);

      // Render hidden iframe dengan konten tiket
      const html = buildPDFHtml(tickets, iceCreamTickets, personalData, familyData);

      // Buat container tersembunyi
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:480px;background:white;';
      container.innerHTML = html.replace(/<script[\s\S]*?<\/script>/gi, '');
      document.body.appendChild(container);

      // Tunggu QR images load
      await new Promise<void>(resolve => {
        const imgs = container.querySelectorAll('img');
        if (!imgs.length) { resolve(); return; }
        let loaded = 0;
        imgs.forEach(img => {
          const done = () => { if (++loaded === imgs.length) resolve(); };
          if ((img as HTMLImageElement).complete) done();
          else { img.onload = done; img.onerror = done; }
        });
      });

      // Capture ke canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f1f5f9',
        width: 480,
      });

      document.body.removeChild(container);

      // Generate PDF
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * pageW) / canvas.width;

      let yPos = 0;
      let remaining = imgH;

      while (remaining > 0) {
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, -yPos, imgW, imgH);
        remaining -= pageH;
        yPos += pageH;
        if (remaining > 0) pdf.addPage();
      }

      pdf.save(`E-Ticket_${personalData.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Gagal membuat PDF. Silakan coba Preview lalu simpan manual.');
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-denso-gray-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-denso-amber rounded-full border-t-transparent animate-spin" />
          <QrCode className="w-8 h-8 text-denso-amber animate-pulse" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-denso-slate mb-2">Memproses Data...</h3>
          <p className="text-sm text-denso-slate-light">Sedang membuat QR Code tiket unik untuk Anda.</p>
        </div>
      </div>
    );
  }

  // ── Ticket card (compact web view) ─────────────────────────────────────────
  const CompactTicketCard = ({ ticket }: { ticket: TicketInfo }) => (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-denso-gray-200 shadow-sm flex">
      {/* Left accent bar */}
      <div className="w-2 flex-shrink-0" style={{ background: ticket.color }} />

      <div className="flex-1 flex items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-3">
          {/* Icon circle */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
            style={{ background: ticket.color + '18' }}>
            {ticket.emoji}
          </div>
          <div>
            {ticket.ownerName && (
              <p className="text-[10px] font-semibold text-denso-gray-400 uppercase tracking-wide mb-0.5">
                {ticket.ownerName}
              </p>
            )}
            <p className="font-display font-bold text-denso-slate text-sm leading-tight">{ticket.title}</p>
            <p className="font-mono text-[10px] font-semibold text-denso-gray-400 tracking-widest mt-0.5">
              {ticket.id}
            </p>
          </div>
        </div>

        {/* Small QR */}
        <img
          src={getQRUrl(ticket.id, 120)}
          alt={`QR ${ticket.title}`}
          className="w-14 h-14 rounded-lg border border-denso-gray-200 flex-shrink-0"
        />
      </div>
    </div>
  );

  const allTickets = [...tickets, ...iceCreamTickets];

  return (
    <div className="p-6 md:p-10" ref={ticketRef}>
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-denso-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-denso-success" />
        </div>
        <h2 className="text-2xl font-display font-bold text-denso-slate">Registrasi Berhasil!</h2>
        <p className="text-denso-slate-light text-sm mt-2 max-w-md mx-auto">
          Terima kasih <strong>{personalData.fullName}</strong>, tiket Anda telah diterbitkan.
          Simpan dan tunjukkan QR Code saat check-in.
        </p>
      </div>

      {/* Compact ticket list */}
      <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-denso-gray-100 mb-6">
        <h3 className="text-xs font-semibold text-denso-gray-500 uppercase tracking-widest mb-4 border-b border-denso-gray-200 pb-2">
          Daftar E-Ticket ({allTickets.length} Tiket)
        </h3>
        <div className="space-y-3">
          {allTickets.map((ticket, i) => (
            <CompactTicketCard key={i} ticket={ticket} />
          ))}
        </div>
      </div>

      {/* Info hint */}
      <p className="text-center text-xs text-denso-gray-400 mb-5">
        💡 Klik <strong>Preview PDF</strong> untuk melihat tampilan tiket lengkap, atau <strong>Unduh PDF</strong> untuk menyimpan langsung.
      </p>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <RippleButton
          variant="outline"
          icon={<Eye className="w-4 h-4" />}
          onClick={handlePreview}
        >
          Preview PDF
        </RippleButton>
        <RippleButton
          variant="outline"
          icon={isDownloading
            ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            : <Download className="w-4 h-4" />}
          onClick={handleDownloadPDF}
          disabled={isDownloading}
        >
          {isDownloading ? 'Membuat PDF...' : 'Unduh PDF'}
        </RippleButton>
        <RippleButton variant="outline" icon={<Mail className="w-4 h-4" />}>
          Kirim ke Email
        </RippleButton>
        <RippleButton variant="primary" icon={<MessageCircle className="w-4 h-4" />}>
          Kirim via WA
        </RippleButton>
      </div>
    </div>
  );
}
