import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer, accordionContent } from '../../../lib/animations';
import { FAQ_ITEMS } from '../../../constants/event';

export function FAQSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      ref={ref}
      id="faq"
      className="relative section-padding"
      style={{ background: '#F5F7F8' }}
      aria-label="Frequently asked questions"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isVisible ? 'animate' : 'initial'}
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 space-y-3"
          >
            <p
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: '#DC0032' }}
            >
              Ada Pertanyaan?
            </p>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: '#4A565E' }}
            >
              Yang Sering{' '}
              <span style={{ color: '#DC0032' }}>Ditanyakan</span>
            </h2>
          </motion.div>

          {/* Search */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-7"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9AAAB3' }} />
              <input
                type="text"
                placeholder="Cari pertanyaan…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl font-sans text-sm transition-all duration-300"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CDD4D8',
                  color: '#4A565E',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(74,86,94,0.06)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#DC0032'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220,0,50,0.10)'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = '#CDD4D8'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(74,86,94,0.06)'; }}
                aria-label="Cari FAQ"
              />
            </div>
          </motion.div>

          {/* FAQ items */}
          <div className="space-y-2.5">
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: index * 0.04 + 0.1 }}
              >
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: '#FFFFFF',
                    border: openIndex === index ? '1px solid #DC003225' : '1px solid #4A565E10',
                    boxShadow: openIndex === index
                      ? '0 4px 20px rgba(74,86,94,0.08)'
                      : '0 1px 4px rgba(74,86,94,0.04)',
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="font-display font-semibold text-sm pr-4 leading-snug"
                      style={{ color: '#4A565E' }}
                    >
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                      style={{
                        background: openIndex === index ? '#DC0032' : '#EEF1F3',
                        color: openIndex === index ? '#FFFFFF' : '#6B7882',
                      }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        variants={accordionContent}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <div className="h-px mb-4" style={{ background: '#DC003218' }} />
                          <p className="font-sans text-sm leading-relaxed" style={{ color: '#6B7882' }}>
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}

            {filteredFAQs.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <p className="font-sans text-sm" style={{ color: '#6B7882' }}>
                  Pertanyaan tidak ditemukan.{' '}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-semibold hover:underline"
                    style={{ color: '#DC0032' }}
                  >
                    Hapus pencarian
                  </button>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
