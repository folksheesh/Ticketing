import { useAdminStore } from '../store/useAdminStore';
import { Users, UserCheck, QrCode, TrendingUp, Shirt, Baby } from 'lucide-react';

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: number | string; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-denso-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-display font-extrabold text-denso-slate">{value}</p>
        <p className="text-sm font-semibold text-denso-slate-light">{label}</p>
        {sub && <p className="text-xs text-denso-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function DashboardTab() {
  const { employees } = useAdminStore();

  const total = employees.length;
  const checkedIn = employees.filter(e => e.checkedIn).length;
  const family = employees.filter(e => e.maritalStatus === 'Family').length;
  const children = employees.reduce((acc, e) => acc + e.family.filter(f => f.relation === 'child').length, 0);
  const totalTickets = employees.reduce((acc, e) => acc + e.tickets.length, 0);
  const usedTickets = employees.reduce((acc, e) => acc + e.tickets.filter(t => t.status !== 'active').length, 0);

  // Division breakdown
  const divisions = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.division] = (acc[e.division] || 0) + 1;
    return acc;
  }, {});

  // Shirt size breakdown
  const sizes = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.tshirtSize] = (acc[e.tshirtSize] || 0) + 1;
    return acc;
  }, {});

  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-denso-slate">Dashboard Admin</h1>
        <p className="text-denso-slate-light text-sm mt-1">Ringkasan data Family Gathering 2025</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Peserta" value={total} icon={Users} color="bg-denso-navy" sub={`${family} keluarga, ${total - family} single`} />
        <StatCard label="Sudah Check-in" value={checkedIn} icon={UserCheck} color="bg-emerald-500" sub={`${total - checkedIn} belum hadir`} />
        <StatCard label="Total Anak" value={children} icon={Baby} color="bg-pink-500" sub="mendapat tiket es krim" />
        <StatCard label="Tiket Aktif" value={totalTickets - usedTickets} icon={QrCode} color="bg-denso-amber-deep" />
        <StatCard label="Tiket Digunakan" value={usedTickets} icon={TrendingUp} color="bg-violet-500" />
        <StatCard label="Total Tiket" value={totalTickets} icon={Shirt} color="bg-sky-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Divisi */}
        <div className="bg-white rounded-2xl p-6 border border-denso-gray-100 shadow-sm">
          <h3 className="font-display font-bold text-denso-slate mb-4">Peserta per Divisi</h3>
          <div className="space-y-3">
            {Object.entries(divisions).sort((a, b) => b[1] - a[1]).map(([div, count]) => (
              <div key={div}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-denso-slate">{div}</span>
                  <span className="text-denso-slate-light">{count} orang</span>
                </div>
                <div className="w-full bg-denso-gray-100 rounded-full h-2">
                  <div
                    className="bg-denso-navy h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ukuran baju */}
        <div className="bg-white rounded-2xl p-6 border border-denso-gray-100 shadow-sm">
          <h3 className="font-display font-bold text-denso-slate mb-4">Distribusi Ukuran Baju</h3>
          <div className="flex flex-wrap gap-3">
            {sizeOrder.map(size => (
              <div key={size} className="flex-1 min-w-[64px] text-center bg-[#F8FAFF] border border-denso-gray-100 rounded-xl py-3 px-2">
                <p className="text-xl font-extrabold text-denso-navy">{sizes[size] || 0}</p>
                <p className="text-xs font-bold text-denso-slate-light mt-1">{size}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent registrations */}
      <div className="bg-white rounded-2xl border border-denso-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-denso-gray-100">
          <h3 className="font-display font-bold text-denso-slate">Registrasi Terbaru</h3>
        </div>
        <div className="divide-y divide-denso-gray-50">
          {[...employees].sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
            .slice(0, 5)
            .map(emp => (
              <div key={emp.id} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-denso-navy/10 flex items-center justify-center font-bold text-denso-navy text-sm">
                    {emp.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-denso-slate text-sm">{emp.fullName}</p>
                    <p className="text-xs text-denso-slate-light">{emp.division} · {emp.nik}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    emp.checkedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {emp.checkedIn ? 'Hadir' : 'Belum Hadir'}
                  </span>
                  <span className="text-xs text-denso-gray-400 hidden sm:block">
                    {new Date(emp.registeredAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
