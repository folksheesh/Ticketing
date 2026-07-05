import { useAdminStore } from '../store/useAdminStore';
import { Users, UserCheck, QrCode, Ticket, Shirt, Building2 } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  colorClass: string;
}

function StatCard({ label, value, sub, icon: Icon, colorClass }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-denso-gray-100 shadow-sm flex items-start gap-5 transition-all hover:shadow-card">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-denso-slate-light mb-1.5">{label}</p>
        <p className="text-3xl font-display font-bold text-denso-slate leading-none tracking-tight">{value}</p>
        {sub && <p className="text-xs text-denso-gray-400 mt-2 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

export function DashboardTab() {
  const { employees } = useAdminStore();

  const total      = employees.length;
  const checkedIn  = employees.filter(e => e.checkedIn).length;
  const familyCount = employees.filter(e => e.maritalStatus === 'Family').length;
  const singleCount = total - familyCount;
  const children   = employees.reduce((a, e) => a + e.family.filter(f => f.relation === 'child').length, 0);
  const totalTickets = employees.reduce((a, e) => a + e.tickets.length, 0);
  const usedTickets  = employees.reduce((a, e) => a + e.tickets.filter(t => t.status !== 'active').length, 0);

  const divisions = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.division] = (acc[e.division] || 0) + 1; return acc;
  }, {});
  const maxDivCount = Math.max(...Object.values(divisions), 1);

  const sizes = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.tshirtSize] = (acc[e.tshirtSize] || 0) + 1; return acc;
  }, {});
  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-denso-slate tracking-tight">Dashboard Overview</h1>
        <p className="text-denso-slate-light mt-1 text-sm">Real-time insight untuk Family Gathering 2025.</p>
      </div>

      {/* Hero & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Hero Stat */}
        <div className="lg:col-span-1 bg-gradient-denso rounded-3xl p-8 text-white shadow-card relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="relative z-10">
            <p className="text-white/80 font-semibold text-sm mb-2 uppercase tracking-wider">Total Registrasi</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-6xl font-display font-black tracking-tighter">{total}</h2>
              <span className="text-white/60 font-medium">Peserta</span>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="text-white/50 text-xs mb-1 uppercase tracking-wider font-semibold">Single</p>
                <p className="text-2xl font-bold">{singleCount}</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1 uppercase tracking-wider font-semibold">Keluarga</p>
                <p className="text-2xl font-bold flex items-baseline gap-1.5">
                  {familyCount}
                  {children > 0 && <span className="text-xs text-white/50 font-normal">+{children} anak</span>}
                </p>
              </div>
            </div>
          </div>
          <Users className="absolute -bottom-8 -right-8 w-56 h-56 text-white/5 pointer-events-none" />
        </div>

        {/* Secondary Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard 
            label="Telah Hadir (Check-in)" 
            value={checkedIn} 
            sub={`${total > 0 ? Math.round((checkedIn/total)*100) : 0}% attendance rate`} 
            icon={UserCheck} 
            colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100" 
          />
          <StatCard 
            label="Belum Hadir" 
            value={total - checkedIn} 
            sub="Menunggu kedatangan" 
            icon={Users} 
            colorClass="bg-denso-gray-50 text-denso-slate-light border border-denso-gray-100" 
          />
          <StatCard 
            label="Total Tiket Beredar" 
            value={totalTickets} 
            sub="Termasuk tiket masuk & kupon" 
            icon={Ticket} 
            colorClass="bg-denso-amber/10 text-denso-amber-deep border border-denso-amber/20" 
          />
          <StatCard 
            label="Tiket Terpakai" 
            value={usedTickets} 
            sub={`${totalTickets - usedTickets} tiket masih aktif`} 
            icon={QrCode} 
            colorClass="bg-violet-50 text-violet-600 border border-violet-100" 
          />
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Divisi Chart */}
        <div className="bg-white rounded-3xl p-7 border border-denso-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-denso-slate text-lg">Distribusi Divisi</h3>
              <p className="text-xs text-denso-slate-light">Sebaran peserta per departemen</p>
            </div>
          </div>
          
          <div className="space-y-5 flex-1">
            {Object.entries(divisions).length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-denso-gray-400">Belum ada data</div>
            ) : (
              Object.entries(divisions)
                .sort((a, b) => b[1] - a[1])
                .map(([div, count]) => (
                  <div key={div} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-denso-slate">{div}</span>
                      <span className="text-sm font-bold text-denso-navy">{count}</span>
                    </div>
                    <div className="w-full bg-denso-gray-50 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full bg-denso-navy transition-all duration-1000 group-hover:bg-denso-amber-deep"
                        style={{ width: `${(count / maxDivCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Ukuran Baju */}
        <div className="bg-white rounded-3xl p-7 border border-denso-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-denso-slate text-lg">Kebutuhan Kaos</h3>
              <p className="text-xs text-denso-slate-light">Total ukuran untuk suvenir</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-max">
            {sizeOrder.map((size) => {
              const count = sizes[size] || 0;
              return (
                <div
                  key={size}
                  className="flex items-center justify-between p-4 rounded-2xl border border-denso-gray-100 bg-[#F8FAFF] transition-colors hover:border-denso-navy/20"
                >
                  <span className="font-display font-bold text-denso-slate text-lg">{size}</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                    count > 0 ? 'bg-denso-navy text-white shadow-sm' : 'bg-white text-denso-gray-400 border border-denso-gray-100'
                  }`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-auto pt-6">
            <div className="bg-denso-amber/10 rounded-xl p-4 flex items-start gap-3 border border-denso-amber/20">
              <div className="w-2 h-2 rounded-full bg-denso-amber mt-1.5 flex-shrink-0" />
              <p className="text-xs text-denso-slate-light font-medium leading-relaxed">
                Pastikan stok kaos dialokasikan dengan toleransi +5% dari total masing-masing ukuran untuk menghindari kekurangan saat penukaran.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl border border-denso-gray-100 shadow-sm overflow-hidden">
        <div className="px-7 py-5 border-b border-denso-gray-50 flex items-center justify-between bg-[#F8FAFF]">
          <div>
            <h3 className="font-display font-bold text-denso-slate text-lg">Aktivitas Registrasi</h3>
            <p className="text-xs text-denso-slate-light mt-0.5">6 pendaftar terakhir masuk ke sistem</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-denso-gray-50">
              <tr>
                <th className="px-7 py-4 text-left text-xs font-bold text-denso-gray-400 uppercase tracking-wider">Nama Peserta</th>
                <th className="px-7 py-4 text-left text-xs font-bold text-denso-gray-400 uppercase tracking-wider">Departemen</th>
                <th className="px-7 py-4 text-left text-xs font-bold text-denso-gray-400 uppercase tracking-wider">Tipe</th>
                <th className="px-7 py-4 text-right text-xs font-bold text-denso-gray-400 uppercase tracking-wider">Waktu Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-denso-gray-50">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-7 py-8 text-center text-sm text-denso-gray-400">
                    Belum ada data registrasi.
                  </td>
                </tr>
              ) : (
                [...employees]
                  .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
                  .slice(0, 6)
                  .map(emp => (
                    <tr key={emp.id} className="hover:bg-denso-gray-50/50 transition-colors">
                      <td className="px-7 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-denso-navy text-white flex items-center justify-center font-bold text-sm">
                            {emp.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-denso-slate text-sm">{emp.fullName}</p>
                            <p className="text-xs text-denso-gray-400 font-mono">{emp.nik}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-7 py-4">
                        <span className="text-sm text-denso-slate-light font-medium">{emp.division}</span>
                      </td>
                      <td className="px-7 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                          emp.maritalStatus === 'Family' ? 'bg-violet-50 text-violet-700 border border-violet-100' : 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}>
                          {emp.maritalStatus === 'Family' ? 'Keluarga' : 'Single'}
                        </span>
                      </td>
                      <td className="px-7 py-4 text-right">
                        <span className="text-sm text-denso-gray-500">
                          {new Date(emp.registeredAt).toLocaleString('id-ID', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
