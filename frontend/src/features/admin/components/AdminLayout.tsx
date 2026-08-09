import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import {
  LayoutDashboard, Users, ScanQrCode, Settings, ShieldCheck, Menu, X, Bell
} from 'lucide-react';
import { cn } from '../../../lib/cn';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',  to: '/admin' },
  { icon: Users,           label: 'Data Karyawan',   to: '/admin/participants' },
  { icon: ScanQrCode,      label: 'Scanner QR', to: '/admin/scanner' },
  { icon: Settings,        label: 'Pengaturan', to: '/admin/settings' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = navItems.find(item => item.to === location.pathname || (item.to !== '/admin' && location.pathname.startsWith(item.to)))?.label || 'Overview';

  return (
    <div className="h-screen flex overflow-hidden font-sans" style={{ background: 'var(--color-denso-paper)' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          style={{ background: 'rgba(11, 37, 96, 0.15)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-40 flex flex-col flex-shrink-0',
        'transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto'
      )}
        style={{
          background: 'var(--color-denso-blue)',
          boxShadow: '4px 0 24px rgba(30, 63, 143, 0.1)',
        }}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(255,255,255,0.15)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight tracking-tight">Admin Panel</p>
            <p className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>Family Gathering</p>
          </div>
          <button
            className="ml-auto lg:hidden p-1.5 rounded-md"
            style={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-white'
                  : 'hover:text-white'
              )}
              style={({ isActive }) => ({
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-[18px] h-[18px] shrink-0"
                    style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.5)' }}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4">
          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
             <div
               className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0"
               style={{
                 background: 'rgba(255,255,255,0.15)',
                 color: 'white',
                 border: '1px solid rgba(255,255,255,0.2)',
               }}
             >
                A
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-semibold text-white truncate">Super Admin</p>
               <p className="text-[10px] font-medium uppercase tracking-wider truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>IT Department</p>
             </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <header
          className="h-16 flex-shrink-0 sticky top-0 z-20 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between"
          style={{
            background: 'rgba(255,255,255,0.8)',
            borderBottom: '1px solid rgba(30, 63, 143, 0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 rounded-md transition-colors"
              style={{ color: 'var(--color-denso-slate-mid)' }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--color-denso-slate)' }}>{currentPath}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative" style={{ color: 'var(--color-denso-slate-mid)' }}>
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{
                  background: 'var(--color-denso-red)',
                  border: '2px solid white',
                }}
              />
            </button>
            <div className="w-px h-6 hidden sm:block" style={{ background: 'var(--color-denso-slate-pale)' }} />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--color-denso-slate-mid)' }}>Admin</span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs"
                style={{
                  background: 'var(--color-denso-blue-pale)',
                  color: 'var(--color-denso-blue)',
                  border: '1px solid rgba(30, 63, 143, 0.15)',
                }}
              >
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
