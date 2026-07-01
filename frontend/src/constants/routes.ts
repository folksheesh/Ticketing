export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  AUTH: {
    LOGIN: '/auth/login',
    VERIFY: '/auth/verify/:token',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    TICKET: '/dashboard/ticket',
    PROFILE: '/dashboard/profile',
  },
  ADMIN: {
    ROOT: '/admin',
    PARTICIPANTS: '/admin/participants',
    FAMILIES: '/admin/families',
    ATTENDANCE: '/admin/attendance',
    SCANNER: '/admin/scanner',
    AUDIT: '/admin/audit',
    SETTINGS: '/admin/settings',
  },
} as const;

export const NAV_LINKS = [
  { label: 'Schedule', href: '#schedule' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Venue', href: '#venue' },
  { label: 'FAQ', href: '#faq' },
] as const;
