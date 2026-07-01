import { createBrowserRouter } from 'react-router';
import { ROUTES } from '../constants/routes';
import { MainLayout } from '../components/layouts/MainLayout';
import { LandingPage } from '../features/landing/LandingPage';
import { RegistrationPage } from '../features/registration/RegistrationPage';
import { AdminLayout, DashboardTab, EmployeeListTab, ScannerTab } from '../features/admin';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-denso-slate">{title}</h1>
        <p className="text-denso-slate-light">Halaman ini sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────────
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME,         element: <LandingPage /> },
      { path: ROUTES.REGISTER,     element: <RegistrationPage /> },
      { path: ROUTES.AUTH.LOGIN,   element: <PlaceholderPage title="Login" /> },
    ],
  },

  // ── Dashboard ──────────────────────────────────────────────────
  {
    path: ROUTES.DASHBOARD.ROOT,
    element: <PlaceholderPage title="Dashboard" />,
  },

  // ── Admin routes ───────────────────────────────────────────────
  {
    path: ROUTES.ADMIN.ROOT,
    element: <AdminLayout />,
    children: [
      { index: true,                            element: <DashboardTab /> },
      { path: ROUTES.ADMIN.PARTICIPANTS,        element: <EmployeeListTab /> },
      { path: ROUTES.ADMIN.SCANNER,             element: <ScannerTab /> },
      { path: ROUTES.ADMIN.SETTINGS,            element: <PlaceholderPage title="Pengaturan" /> },
    ],
  },
]);
