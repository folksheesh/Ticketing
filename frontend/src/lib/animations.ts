import type { Variants, Transition } from 'framer-motion';

/* ===== Transition Presets ===== */
export const transitions = {
  spring: { type: 'spring', stiffness: 300, damping: 30 } as Transition,
  springBounce: { type: 'spring', stiffness: 400, damping: 10 } as Transition,
  smooth: { type: 'tween', duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } as Transition,
  slow: { type: 'tween', duration: 0.8, ease: 'easeInOut' } as Transition,
  fast: { type: 'tween', duration: 0.2, ease: 'easeOut' } as Transition,
} as const;

/* ===== Animation Variants ===== */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const scaleInBounce: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

/* ===== Container Variants (stagger) ===== */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/* ===== Page Transition ===== */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/* ===== Slide Variants ===== */
export const slideUp: Variants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
};

export const slideDown: Variants = {
  initial: { y: '-100%' },
  animate: { y: 0 },
  exit: { y: '-100%' },
};

/* ===== Card Hover ===== */
export const cardHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 24px rgba(0, 84, 166, 0.06)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 40px rgba(0, 84, 166, 0.12)',
  },
};

/* ===== Float Animation ===== */
export const floatAnimation = {
  y: [0, -15, -8, 0],
  rotate: [0, 1, -1, 0],
  transition: {
    duration: 6,
    ease: 'easeInOut',
    repeat: Infinity,
  },
};

export const floatAnimationDelayed = {
  y: [0, -12, -6, 0],
  rotate: [0, -1, 1, 0],
  transition: {
    duration: 7,
    ease: 'easeInOut',
    repeat: Infinity,
    delay: 2,
  },
};

/* ===== Accordion ===== */
export const accordionContent: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1 },
};

/* ===== Button Press ===== */
export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};
