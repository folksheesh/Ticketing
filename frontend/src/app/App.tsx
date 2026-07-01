import { AnimatePresence } from 'framer-motion';
import { Providers } from './providers';

export function App() {
  return (
    <AnimatePresence mode="wait">
      <Providers />
    </AnimatePresence>
  );
}
