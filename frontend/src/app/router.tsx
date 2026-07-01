import { createBrowserRouter } from 'react-router';
import { ROUTES } from '../constants/routes';
import { MainLayout } from '../components/layouts/MainLayout';
import { LandingPage } from '../features/landing/LandingPage';
import { RegistrationPage } from '../features/registration/RegistrationPage';

// Placeholder components for routing structure
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500">This page is under construction (Next Phase).</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <LandingPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegistrationPage />,
      },
      {
        path: ROUTES.AUTH.LOGIN,
        element: <PlaceholderPage title="Login" />,
      },
    ],
  },
  // Protected Routes (Dashboard)
  {
    path: ROUTES.DASHBOARD.ROOT,
    element: <PlaceholderPage title="Dashboard Layout" />,
    children: [
      {
        index: true,
        element: <PlaceholderPage title="Dashboard Summary" />,
      },
      {
        path: ROUTES.DASHBOARD.TICKET,
        element: <PlaceholderPage title="My Tickets" />,
      },
    ],
  },
  // Admin Routes
  {
    path: ROUTES.ADMIN.ROOT,
    element: <PlaceholderPage title="Admin Layout" />,
    children: [
      {
        index: true,
        element: <PlaceholderPage title="Admin Overview" />,
      },
    ],
  },
]);

