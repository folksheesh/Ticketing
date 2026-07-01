import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  LayoutDashboard, Users, ScanQrCode, Settings, ShieldCheck, Menu, X
} from 'lucide-react';
import { cn } from '../../../lib/cn';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',  to: '/admin' },
  { icon: Users,           label: 'Karyawan',   to: '/admin/participants' },
  { icon: ScanQrCode,      label: 'Scanner QR', to: '/admin/scanner' },
  { icon: Settings,        label: 'Pengaturan', to: '/admin/settings' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-40 flex flex-col',
        'bg-denso-navy text-white transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto',
      )}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-denso-amber flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-denso-navy-dark" />
          </div>
          <div>
            <p className="font-display font-bold text-sm leading-tight">Admin Panel</p>
            <p className="text-[10px] text-white/50 leading-tight">Family Gathering 2025</p>
          </div>
          <button className="ml-auto lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200',
                isActive
                  ? 'bg-denso-amber text-denso-navy-dark shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10',
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-white/40">Logged in as</p>
          <p className="text-sm font-bold text-white">Super Admin</p>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-denso-gray-100 px-4 lg:px-8 py-3 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-denso-gray-100 text-denso-slate"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-denso-navy flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="text-sm font-semibold text-denso-slate hidden sm:block">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
