import { useState } from 'react';
import { Search, X, Mail, Shirt, CheckCircle2, Clock, Ticket } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import type { Employee } from '../types';
import { cn } from '../../../lib/cn';

function EmployeeDrawer({ emp, onClose }: { emp: Employee; onClose: () => void }) {
  const activeCount  = emp.tickets.filter(t => t.status === 'active').length;
  const usedCount    = emp.tickets.filter(t => t.status === 'used').length;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <h2 className="text-sm font-semibold text-slate-800">Detail Peserta</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 p-6 space-y-8">
          
          {/* Profile Basic */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xl shrink-0 border border-slate-200">
              {emp.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{emp.fullName}</h3>
              <p className="text-sm text-slate-500 font-mono mt-0.5">{emp.nik}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border",
                  emp.checkedIn ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", emp.checkedIn ? "bg-emerald-500" : "bg-amber-500")} />
                  {emp.checkedIn ? 'Hadir' : 'Menunggu Kehadiran'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-slate-50 text-slate-600 border-slate-200">
                  {emp.maritalStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Informasi Umum</span>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-slate-500">Departemen</span>
                <span className="text-sm font-medium text-slate-900">{emp.division}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm font-medium text-slate-900">{emp.email}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-slate-500">Ukuran Kaos</span>
                <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{emp.tshirtSize}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-slate-500">Waktu Registrasi</span>
                <span className="text-sm font-medium text-slate-900">
                  {new Date(emp.registeredAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          </div>

          {/* Family */}
          {emp.family.length > 0 && (
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Anggota Keluarga</span>
                <span className="text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">{emp.family.length}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {emp.family.map((f, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{f.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{f.relation === 'child' ? 'Anak' : 'Pasangan'}</p>
                    </div>
                    <div className="text-right">
                      {f.age && <p className="text-sm text-slate-600">{f.age} thn</p>}
                      {f.tshirtSize && <p className="text-xs font-semibold text-slate-600 mt-0.5">Size {f.tshirtSize}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tickets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Tiket & Kupon</h3>
              <div className="flex items-center gap-2 text-[10px] font-medium">
                <span className="text-emerald-600">{activeCount} Aktif</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{usedCount} Used</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {emp.tickets.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                      t.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                    )}>
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t.label}</p>
                      <p className="font-mono text-[10px] text-slate-400">{t.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded uppercase",
                      t.status === 'active' ? "bg-emerald-50 text-emerald-700" :
                      t.status === 'used' ? "bg-slate-100 text-slate-600" : "bg-red-50 text-red-600"
                    )}>
                      {t.status}
                    </span>
                    {t.scannedAt && (
                      <p className="text-[9px] text-slate-400 mt-1">
                        {new Date(t.scannedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export function EmployeeListTab() {
  const { employees } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'checked' | 'notchecked'>('all');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const filtered = employees.filter(e => {
    const matchSearch =
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.nik.includes(search) ||
      e.division.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true :
      filter === 'checked' ? e.checkedIn :
      !e.checkedIn;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Data Karyawan</h1>
        <p className="text-slate-500 mt-1 text-sm">Kelola {employees.length} peserta terdaftar untuk Family Gathering.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-sm"
            placeholder="Cari nama, NIK, divisi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex bg-slate-100/50 p-1 rounded-md border border-slate-200 w-full sm:w-auto">
          {(['all', 'checked', 'notchecked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-medium transition-colors",
                filter === f
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              )}
            >
              {f === 'all' ? 'Semua' : f === 'checked' ? 'Hadir' : 'Belum Hadir'}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Table List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-slate-900">Tidak ada data ditemukan</p>
            <p className="text-sm text-slate-500 mt-1">Coba sesuaikan pencarian atau filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-5 py-3 text-xs font-medium text-slate-500">Nama Lengkap</th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-500">Departemen</th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-500">Tipe</th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-500">Tiket</th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-500">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(emp => {
                  const activeCount = emp.tickets.filter(t => t.status === 'active').length;
                  return (
                    <tr 
                      key={emp.id}
                      onClick={() => setSelectedEmp(emp)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold shrink-0">
                            {emp.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{emp.fullName}</p>
                            <p className="text-xs font-mono text-slate-500">{emp.nik}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-slate-600">{emp.division}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-slate-600">{emp.maritalStatus}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{emp.tickets.length}</span>
                          {activeCount > 0 && (
                            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1">
                              {activeCount} aktif
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {emp.checkedIn ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm font-medium text-emerald-700">Hadir</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-amber-500" />
                              <span className="text-sm font-medium text-amber-700">Belum</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Drawer */}
      {selectedEmp && (
        <EmployeeDrawer emp={selectedEmp} onClose={() => setSelectedEmp(null)} />
      )}
    </div>
  );
}
