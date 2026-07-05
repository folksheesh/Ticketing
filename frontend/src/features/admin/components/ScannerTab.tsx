import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  ScanQrCode, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, Keyboard, Clock, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import type { TicketStatus } from '../types';
import { cn } from '../../../lib/cn';

const TICKET_EMOJI: Record<string, string> = {
  entry: '🎫', snack: '☕', lunch: '🍽️', icecream: '🍦',
};

const STATUS_COLOR: Record<TicketStatus, string> = {
  active:  'border-emerald-400 bg-emerald-50',
  used:    'border-sky-400 bg-sky-50',
  expired: 'border-red-400 bg-red-50',
};

const STATUS_LABEL: Record<TicketStatus, string> = {
  active: '✅ Aktif — Belum Digunakan',
  used:   '🔵 Sudah Digunakan',
  expired:'🔴 Expired / Tidak Valid',
};

export function ScannerTab() {
  const { scanResult, scanError, scanTicket, updateTicketStatus, clearScan, employees } = useAdminStore();
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [cameraError, setCameraError] = useState('');
  const [showIds, setShowIds] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    setCameraError('');
    setScanning(true);
    clearScan();

    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decoded) => {
          scanner.stop().catch(() => {});
          setScanning(false);
          scanTicket(decoded.trim());
        },
        () => {}
      );
    } catch {
      setScanning(false);
      setCameraError('Kamera tidak dapat diakses. Coba mode input manual.');
    }
  };

  const stopScanner = () => {
    scannerRef.current?.stop().catch(() => {});
    scannerRef.current = null;
    setScanning(false);
  };

  useEffect(() => () => { scannerRef.current?.stop().catch(() => {}); }, []);

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    scanTicket(manualId.trim().toUpperCase());
    setManualId('');
  };

  const handleValidate = (status: TicketStatus) => {
    if (!scanResult) return;
    updateTicketStatus(scanResult.employee.id, scanResult.ticket.id, status);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-denso-slate">Scanner QR</h1>
        <p className="text-denso-slate-light text-sm mt-1">Scan QR Code tiket untuk validasi kehadiran</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 bg-denso-gray-100 p-1 rounded-xl w-fit">
        {(['camera', 'manual'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); stopScanner(); clearScan(); }}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all',
              mode === m ? 'bg-white text-denso-navy shadow-sm' : 'text-denso-slate-light hover:text-denso-slate'
            )}
          >
            {m === 'camera' ? <ScanQrCode className="w-4 h-4" /> : <Keyboard className="w-4 h-4" />}
            {m === 'camera' ? 'Kamera' : 'Manual'}
          </button>
        ))}
      </div>

      {/* Camera Scanner */}
      {mode === 'camera' && (
        <div className="bg-white rounded-2xl border border-denso-gray-100 shadow-sm overflow-hidden">
          <div className="relative bg-black min-h-[320px] flex items-center justify-center">
            <div id="qr-reader" className="w-full" />

            {!scanning && !scanResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-2xl border-4 border-dashed border-white/40 flex items-center justify-center">
                  <ScanQrCode className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-white/60 text-sm">Kamera belum aktif</p>
              </div>
            )}
          </div>

          <div className="p-5 flex items-center justify-center gap-3">
            {!scanning ? (
              <button
                onClick={startScanner}
                className="flex items-center gap-2 px-6 py-3 bg-denso-navy text-white font-bold rounded-xl hover:bg-denso-navy-dark transition-colors"
              >
                <ScanQrCode className="w-5 h-5" /> Mulai Scan
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
              >
                <XCircle className="w-5 h-5" /> Stop
              </button>
            )}
          </div>

          {cameraError && (
            <div className="mx-5 mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-700 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {cameraError}
            </div>
          )}
        </div>
      )}

      {/* Manual Input */}
      {mode === 'manual' && (
        <div className="bg-white rounded-2xl border border-denso-gray-100 shadow-sm p-6">
          <p className="text-sm text-denso-slate-light mb-4">
            Masukkan ID tiket secara manual. Contoh: <code className="bg-denso-gray-100 px-1.5 py-0.5 rounded font-mono text-denso-navy">REG-123456</code>
          </p>
          <form onSubmit={handleManual} className="flex gap-3">
            <input
              className="flex-1 px-4 py-3 border border-denso-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-denso-amber/30 focus:border-denso-amber uppercase"
              placeholder="REG-XXXXXX"
              value={manualId}
              onChange={e => setManualId(e.target.value.toUpperCase())}
            />
            <button
              type="submit"
              className="px-5 py-3 bg-denso-navy text-white font-bold rounded-xl hover:bg-denso-navy-dark transition-colors"
            >
              Cek
            </button>
          </form>

          {/* Quick-test: show real IDs from store */}
          <div className="mt-4 border-t border-denso-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-denso-gray-400 font-semibold">ID Tiket Tersedia di Sistem:</p>
              <button
                onClick={() => setShowIds(v => !v)}
                className="text-xs text-denso-navy font-semibold flex items-center gap-1"
              >
                {showIds ? <><ChevronUp className="w-3 h-3"/>Sembunyikan</> : <><ChevronDown className="w-3 h-3"/>Tampilkan</>}
              </button>
            </div>
            {showIds && (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {employees.map(emp => (
                  <div key={emp.id}>
                    <p className="text-[10px] font-bold text-denso-gray-400 uppercase mb-1">{emp.fullName}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {emp.tickets.map(t => (
                        <button
                          key={t.id}
                          onClick={() => { scanTicket(t.id); }}
                          className={cn(
                            'font-mono text-[10px] px-2.5 py-1.5 rounded-lg transition-colors border',
                            t.status === 'active'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-gray-50 border-gray-200 text-gray-400 line-through'
                          )}
                        >
                          {t.id}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {scanError && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex items-start gap-4">
          <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-700">Tiket Tidak Ditemukan</p>
            <p className="text-sm text-red-600 mt-1">{scanError}</p>
            <button onClick={clearScan} className="mt-3 text-sm font-semibold text-red-600 underline flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Scan Ulang
            </button>
          </div>
        </div>
      )}

      {/* Scan Result */}
      {scanResult && (
        <div className={cn(
          'bg-white border-2 rounded-2xl overflow-hidden shadow-lg',
          STATUS_COLOR[scanResult.ticket.status]
        )}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-current/10 flex items-center gap-4">
            <span className="text-4xl">{TICKET_EMOJI[scanResult.ticket.type]}</span>
            <div>
              <p className="font-display font-bold text-lg text-denso-slate">{scanResult.ticket.label}</p>
              <p className="font-mono text-xs text-denso-gray-400 tracking-wider">{scanResult.ticket.id}</p>
            </div>
            <div className="ml-auto">
              {scanResult.ticket.status === 'active' && <CheckCircle2 className="w-8 h-8 text-emerald-500" />}
              {scanResult.ticket.status === 'used'   && <Clock        className="w-8 h-8 text-sky-500" />}
              {scanResult.ticket.status === 'expired'&& <XCircle      className="w-8 h-8 text-red-500" />}
            </div>
          </div>

          {/* Status badge */}
          <div className="px-6 py-3 bg-white/60 border-b border-current/10">
            <p className="text-sm font-bold">{STATUS_LABEL[scanResult.ticket.status]}</p>
            {scanResult.ticket.scannedAt && (
              <p className="text-xs text-denso-slate-light mt-0.5">
                Digunakan: {new Date(scanResult.ticket.scannedAt).toLocaleString('id-ID')}
              </p>
            )}
          </div>

          {/* Employee info */}
          <div className="px-6 py-4 space-y-2">
            <p className="text-xs font-bold text-denso-gray-400 uppercase tracking-wide">Data Peserta</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-denso-navy flex items-center justify-center text-white font-bold">
                {scanResult.employee.fullName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-denso-slate">{scanResult.employee.fullName}</p>
                <p className="text-xs text-denso-slate-light">{scanResult.employee.division} · NIK {scanResult.employee.nik}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {scanResult.ticket.status === 'active' && (
            <div className="px-6 py-4 border-t border-current/10 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleValidate('used')}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" /> Validasi & Tandai Digunakan
              </button>
              <button
                onClick={() => handleValidate('expired')}
                className="flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
              >
                <XCircle className="w-5 h-5" /> Tandai Expired
              </button>
            </div>
          )}

          {scanResult.ticket.status !== 'active' && (
            <div className="px-6 py-4 border-t border-current/10 flex justify-between items-center">
              <p className="text-sm text-denso-slate-light">Tiket ini sudah tidak aktif</p>
              <button
                onClick={clearScan}
                className="flex items-center gap-2 px-4 py-2.5 bg-denso-navy text-white font-semibold rounded-xl text-sm hover:bg-denso-navy-dark transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Scan Berikutnya
              </button>
            </div>
          )}

          {scanResult.ticket.status === 'active' && (
            <div className="px-6 pb-4">
              <button onClick={clearScan} className="text-sm text-denso-gray-400 underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Scan tiket lain
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
