export const EVENT_CONFIG = {
  name: 'PT Denso Family Gathering',
  year: 2026,
  tagline: 'Bringing Families Together',
  date: new Date('2026-09-15T08:00:00+07:00'),
  venue: {
    name: 'Grand Convention Center',
    address: 'Jl. Raya Convention No. 1, Jakarta Selatan',
    city: 'Jakarta',
    mapUrl: 'https://maps.google.com',
  },
  maxParticipants: 15000,
  company: 'PT Denso Indonesia',
} as const;

export const AGE_CATEGORIES = {
  BABY: { min: 0, max: 2, label: 'Baby', emoji: '👶' },
  KID: { min: 3, max: 12, label: 'Kid', emoji: '🧒' },
  TEEN: { min: 13, max: 17, label: 'Teen', emoji: '🧑' },
  ADULT: { min: 18, max: 59, label: 'Adult', emoji: '🧑‍🦰' },
  SENIOR: { min: 60, max: 150, label: 'Senior', emoji: '👴' },
} as const;

export type AgeCategory = keyof typeof AGE_CATEGORIES;

export function classifyAge(age: number): AgeCategory {
  if (age <= 2) return 'BABY';
  if (age <= 12) return 'KID';
  if (age <= 17) return 'TEEN';
  if (age <= 59) return 'ADULT';
  return 'SENIOR';
}

export function getAgeFromBirthDate(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const SCHEDULE = [
  { time: '07:00', title: 'Gate Open & Registration', description: 'Check-in and welcome refreshments', icon: 'DoorOpen' },
  { time: '08:30', title: 'Opening Ceremony', description: 'Welcome speech by Board of Directors', icon: 'Mic2' },
  { time: '09:30', title: 'Family Games', description: 'Interactive games and competitions for all ages', icon: 'Gamepad2' },
  { time: '11:30', title: 'Lunch Break', description: 'Buffet lunch with family-friendly menu', icon: 'UtensilsCrossed' },
  { time: '13:00', title: 'Entertainment Show', description: 'Live music performances and talent show', icon: 'Music' },
  { time: '14:30', title: 'Lucky Draw', description: 'Exciting prizes including electronics and travel packages', icon: 'Gift' },
  { time: '15:30', title: 'Souvenir Collection', description: 'Collect your exclusive family gathering souvenirs', icon: 'Package' },
  { time: '16:00', title: 'Closing Ceremony', description: 'Thank you and see you next year!', icon: 'PartyPopper' },
] as const;

export const FAQ_ITEMS = [
  {
    question: 'Who can attend the Family Gathering?',
    answer: 'All active PT Denso employees and their immediate family members (spouse and children) are welcome to attend. Each employee can register their family members during the registration process.',
  },
  {
    question: 'How do I register for the event?',
    answer: 'Click the "Register Now" button on this page, fill in your employee ID and personal details, then add your family members if applicable. You\'ll receive a confirmation email with your QR codes for entry, lunch, and souvenir collection.',
  },
  {
    question: 'What should I bring on event day?',
    answer: 'Please bring your digital or printed QR code tickets for registration, lunch, and souvenir collection. We recommend wearing comfortable clothing and shoes suitable for outdoor activities.',
  },
  {
    question: 'Is there parking available?',
    answer: 'Yes, ample parking is available at the venue. We also provide shuttle buses from designated pick-up points. Details will be shared via email closer to the event date.',
  },
  {
    question: 'Can I update my registration after submitting?',
    answer: 'Yes, you can log in to your dashboard and update your registration details, including adding or removing family members, up until 3 days before the event.',
  },
  {
    question: 'What happens if I lose my QR code?',
    answer: 'You can always access your QR codes from your dashboard by logging in with your registered email. Staff at the venue can also look up your registration using your Employee ID.',
  },
  {
    question: 'Are there activities for children?',
    answer: 'Absolutely! We have dedicated play areas for different age groups, supervised activities for kids, and family-friendly games that everyone can enjoy together.',
  },
  {
    question: 'Is the event accessible for people with disabilities?',
    answer: 'Yes, the venue is fully accessible with wheelchair ramps, accessible restrooms, and priority seating. Please indicate any special requirements during registration.',
  },
] as const;
