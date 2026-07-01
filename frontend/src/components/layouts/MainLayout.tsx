import { Outlet } from 'react-router';
import { Header } from '../organisms/Header';
import { Footer } from '../organisms/Footer';

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
