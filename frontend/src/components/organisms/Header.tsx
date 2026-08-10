import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from '../atoms/Logo';
import { RippleButton } from '../atoms/RippleButton';
import { NAV_LINKS, ROUTES } from '../../constants/routes';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const elem = document.getElementById(targetId);
      if (elem) {
        const headerOffset = 80;
        const elementPosition = elem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [isMobile, isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'py-3'
            : 'bg-transparent py-5'
        )}
        style={isScrolled ? {
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(30, 63, 143, 0.08)',
          boxShadow: '0 2px 16px rgba(30, 63, 143, 0.06)',
        } : undefined}
      >
        {/* Thin tricolor accent bar when scrolled */}
        {isScrolled && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, var(--color-denso-red) 0%, var(--color-denso-blue) 50%, var(--color-denso-sky) 100%)',
            }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between" aria-label="Main navigation">
            <Link to={ROUTES.HOME} className="relative z-10" aria-label="Go to homepage">
              <Logo size={isScrolled ? 'sm' : 'md'} />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 text-sm font-sans font-medium rounded-lg transition-all duration-200"
                  style={{
                    color: isScrolled
                      ? 'var(--color-denso-slate)'
                      : 'var(--color-denso-slate-mid)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-denso-blue)';
                    e.currentTarget.style.background = 'var(--color-denso-blue-pale)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isScrolled
                      ? 'var(--color-denso-slate)'
                      : 'var(--color-denso-slate-mid)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <Link to={ROUTES.REGISTER} className="hidden sm:block">
                <RippleButton size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Register
                </RippleButton>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative z-10 p-2 rounded-xl transition-all duration-200"
                style={{
                  color: isMobileMenuOpen ? 'var(--color-denso-red)' : 'var(--color-denso-slate)',
                }}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="close"
                      initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu"
                      initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: 'rgba(44, 53, 59, 0.2)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] shadow-2xl"
              style={{
                background: 'var(--color-denso-white)',
                borderLeft: '1px solid var(--color-denso-slate-mist)',
              }}
            >
              {/* Tricolor accent bar */}
              <div
                className="h-1 w-full"
                style={{
                  background: 'linear-gradient(90deg, var(--color-denso-red), var(--color-denso-blue))',
                }}
              />

              <div className="flex flex-col pt-24 px-6 pb-8 h-full">
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                      className="px-4 py-3 text-base font-sans font-medium rounded-xl transition-colors"
                      style={{ color: 'var(--color-denso-slate)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-denso-blue)';
                        e.currentTarget.style.background = 'var(--color-denso-blue-pale)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-denso-slate)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
                <div className="mt-auto">
                  <Link to={ROUTES.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                    <RippleButton fullWidth size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                      Register Now
                    </RippleButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
