import { Heart, Mail, MapPin, Calendar } from 'lucide-react';
import { Logo } from '../atoms/Logo';
import { EVENT_CONFIG } from '../../constants/event';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-denso-navy text-white" role="contentinfo">
      {/* Amber top border — the arc motif made linear */}
      <div className="h-1 w-full bg-gradient-to-r from-denso-amber via-denso-amber-deep to-denso-amber" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="md" variant="full" onDark />
            <p className="text-denso-gray-300 text-sm leading-relaxed max-w-xs font-sans">
              Join 15,000 Denso employees and their families for a day of joy, games, and togetherness.
            </p>
          </div>

          {/* Event Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-display font-semibold uppercase tracking-widest text-denso-amber">
              Event Details
            </h3>
            <ul className="space-y-3 text-sm text-denso-gray-300 font-sans">
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-denso-amber" />
                {EVENT_CONFIG.date.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-denso-amber" />
                <span>
                  {EVENT_CONFIG.venue.name}<br />
                  <span className="text-denso-gray-400 text-xs">{EVENT_CONFIG.venue.address}</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-denso-amber" />
                <a
                  href="mailto:event@denso.co.id"
                  className="hover:text-denso-amber transition-colors"
                >
                  event@denso.co.id
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-display font-semibold uppercase tracking-widest text-denso-amber">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm font-sans">
              {[
                { label: 'Event Schedule',   href: '#schedule' },
                { label: 'How It Works',     href: '#timeline' },
                { label: 'Venue & Directions', href: '#venue' },
                { label: 'FAQ',              href: '#faq' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-denso-gray-300 hover:text-denso-amber transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-denso-navy-mid/30 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-denso-gray-400 font-sans">
          <p>© {currentYear} {EVENT_CONFIG.company}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-denso-amber fill-denso-amber" /> by Denso IT Team
          </p>
        </div>
      </div>
    </footer>
  );
}
