import { Heart, Mail, MapPin, Calendar } from 'lucide-react';
import { Logo } from '../atoms/Logo';
import { EVENT_CONFIG } from '../../constants/event';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#4A565E', color: '#FFFFFF' }} role="contentinfo">
      {/* Red accent bar */}
      <div style={{ height: '4px', background: '#DC0032' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Logo size="md" variant="full" onDark />
            <p className="font-sans text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Bersama 15.000 karyawan dan keluarganya untuk satu hari penuh kebersamaan.
            </p>
          </div>

          {/* Event details */}
          <div className="space-y-4">
            <h3
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: '#DC0032' }}
            >
              Detail Acara
            </h3>
            <ul className="space-y-3 font-sans text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#DC0032' }} />
                <span className="capitalize">
                  {EVENT_CONFIG.date.toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#DC0032' }} />
                <span>
                  {EVENT_CONFIG.venue.name}<br />
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
                    {EVENT_CONFIG.venue.address}
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#DC0032' }} />
                <a
                  href="mailto:event@denso.co.id"
                  className="transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  event@denso.co.id
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: '#DC0032' }}
            >
              Navigasi
            </h3>
            <ul className="space-y-3 font-sans text-sm">
              {[
                { label: 'Jadwal Acara', href: '#schedule' },
                { label: 'Cara Daftar', href: '#timeline' },
                { label: 'Lokasi',      href: '#venue' },
                { label: 'FAQ',         href: '#faq' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}
        >
          <p>© {currentYear} {EVENT_CONFIG.company}. Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1.5">
            Dibuat dengan{' '}
            <Heart className="w-3 h-3" style={{ color: '#DC0032', fill: '#DC0032' }} />{' '}
            oleh Tim IT Denso
          </p>
        </div>
      </div>
    </footer>
  );
}
