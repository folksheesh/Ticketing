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
    <div className="h-screen bg-slate-50/50 flex overflow-hidden font-sans">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-40 flex flex-col flex-shrink-0',
        'bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:shadow-none'
      )}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 shadow-sm shadow-blue-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight tracking-tight">Admin Panel</p>
            <p className="text-[10px] font-medium text-slate-500 leading-tight">Family Gathering</p>
          </div>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-md" onClick={() => setSidebarOpen(false)}>
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
                  ? 'bg-blue-50/80 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-blue-600" : "text-slate-400")} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4">
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center gap-3">
             <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm shadow-sm shrink-0">
                A
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-semibold text-slate-900 truncate">Super Admin</p>
               <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider truncate">IT Department</p>
             </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-semibold text-slate-800 hidden sm:block">{currentPath}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Admin</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs">
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
