import { motion } from 'framer-motion';
import { HeroBanner } from './components/HeroBanner';
import { CountdownSection } from './components/CountdownSection';
import { ScheduleSection } from './components/ScheduleSection';
import { TimelineSection } from './components/TimelineSection';
import { VenueSection } from './components/VenueSection';
import { FAQSection } from './components/FAQSection';
import { SponsorsSection } from './components/SponsorsSection';

export function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      <HeroBanner />
      <CountdownSection />
      <TimelineSection />
      <ScheduleSection />
      <VenueSection />
      <FAQSection />
      <SponsorsSection />
    </motion.div>
  );
}
