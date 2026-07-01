import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Users, UserCheck, User, Baby, Shirt } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import type { Employee } from '../types';

const ticketStatusBadge = (status: string) => {
  if (status === 'active')  return 'bg-emerald-100 text-emerald-700';
  if (status === 'used')    return 'bg-sky-100 text-sky-700';
  if (status === 'expired') return 'bg-red-100 text-red-700';
  return '';
};

function EmployeeRow({ emp }: { emp: Employee }) {
  const [expanded, setExpanded] = useState(false);

  const activeCount  = emp.tickets.filter(t => t.status === 'active').length;
  const usedCount    = emp.tickets.filter(t => t.status !== 'active').length;

  return (
    <>
      <tr
        className="hover:bg-[#F8FAFF] transition-colors cursor-pointer border-b border-denso-gray-50"
        onClick={() => setExpanded(v => !v)}
      >
        {/* Avatar + name */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-denso-navy flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {emp.fullName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-denso-slate text-sm leading-tight">{emp.fullName}</p>
              <p className="text-xs text-denso-slate-light">{emp.nik}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-sm text-denso-slate hidden md:table-cell">{emp.division}</td>
        <td className="px-4 py-4 hidden sm:table-cell">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            emp.maritalStatus === 'Family' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {emp.maritalStatus === 'Family' ? `👨‍👩‍👧 Keluarga` : '👤 Single'}
          </span>
        </td>
        <td className="px-4 py-4 hidden lg:table-cell">
          <div className="flex items-center gap-1.5">
            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 font-semibold rounded-full">{activeCount} aktif</span>
            {usedCount > 0 && <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 font-semibold rounded-full">{usedCount} used</span>}
          </div>
        </td>
        <td className="px-4 py-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            emp.checkedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {emp.checkedIn ? '✓ Hadir' : '– Belum'}
          </span>
        </td>
        <td className="px-4 py-4 text-denso-gray-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </td>
      </tr>

      {/* Expanded detail */}
      {expanded && (
        <tr className="bg-[#F8FAFF] border-b border-denso-gray-100">
          <td colSpan={6} className="px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Info */}
              <div className="space-y-2 text-sm">
                <p className="font-bold text-denso-slate text-xs uppercase tracking-wide mb-2">Info Peserta</p>
                <div className="flex gap-2"><User className="w-4 h-4 text-denso-gray-400 flex-shrink-0 mt-0.5" /><span className="text-denso-slate">{emp.email}</span></div>
                <div className="flex gap-2"><Shirt className="w-4 h-4 text-denso-gray-400 flex-shrink-0 mt-0.5" /><span className="text-denso-slate">Ukuran baju: <strong>{emp.tshirtSize}</strong></span></div>
                {emp.family.length > 0 && (
                  <div>
                    <p className="font-bold text-denso-slate text-xs uppercase tracking-wide my-2">Anggota Keluarga</p>
                    <div className="space-y-1.5">
                      {emp.family.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {f.relation === 'child' ? <Baby className="w-4 h-4 text-pink-400" /> : <Users className="w-4 h-4 text-violet-400" />}
                          <span className="text-denso-slate">{f.name}</span>
                          {f.age && <span className="text-xs text-denso-gray-400">{f.age} thn</span>}
                          {f.tshirtSize && <span className="text-xs bg-denso-gray-100 px-2 py-0.5 rounded-full font-semibold">{f.tshirtSize}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tickets */}
              <div>
                <p className="font-bold text-denso-slate text-xs uppercase tracking-wide mb-2">Tiket</p>
                <div className="space-y-2">
                  {emp.tickets.map(t => (
                    <div key={t.id} className="flex items-center justify-between bg-white border border-denso-gray-100 rounded-xl px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold text-denso-slate">{t.label}</p>
                        <p className="font-mono text-[10px] text-denso-gray-400">{t.id}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ticketStatusBadge(t.status)}`}>
                        {t.status === 'active' ? 'Aktif' : t.status === 'used' ? 'Sudah Digunakan' : 'Expired'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function EmployeeListTab() {
  const { employees } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'checked' | 'notchecked'>('all');

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-denso-slate">Data Karyawan</h1>
        <p className="text-denso-slate-light text-sm mt-1">{employees.length} peserta terdaftar</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-denso-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-denso-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-denso-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-denso-amber/30 focus:border-denso-amber"
            placeholder="Cari nama, NIK, atau divisi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'checked', 'notchecked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-denso-navy text-white shadow'
                  : 'bg-denso-gray-100 text-denso-slate hover:bg-denso-gray-200'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'checked' ? '✓ Hadir' : '– Belum Hadir'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-denso-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFF] border-b border-denso-gray-100">
                <th className="px-5 py-3 text-left text-xs font-bold text-denso-gray-500 uppercase tracking-wide">Karyawan</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-denso-gray-500 uppercase tracking-wide hidden md:table-cell">Divisi</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-denso-gray-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-denso-gray-500 uppercase tracking-wide hidden lg:table-cell">Tiket</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-denso-gray-500 uppercase tracking-wide">Kehadiran</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-denso-gray-400">Tidak ada data ditemukan</td></tr>
              ) : (
                filtered.map(emp => <EmployeeRow key={emp.id} emp={emp} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
