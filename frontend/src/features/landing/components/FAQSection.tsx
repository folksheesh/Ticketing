import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { FAQ_ITEMS } from '../../../constants/event';

const accordionContent = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto' as const, opacity: 1 },
};

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      id="faq"
      className="relative section-padding"
      style={{
        background: 'linear-gradient(180deg, var(--color-denso-blue-pale) 0%, var(--color-denso-white) 100%)',
      }}
      aria-label="Frequently asked questions"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 space-y-3"
          >
            <p
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-denso-blue)' }}
            >
              Ada Pertanyaan?
            </p>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--color-denso-slate)' }}
            >
              Yang Sering{' '}
              <span style={{ color: 'var(--color-denso-red)' }}>Ditanyakan</span>
            </h2>
          </motion.div>

          {/* Search */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-7"
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--color-denso-slate-soft)' }}
              />
              <input
                type="text"
                placeholder="Cari pertanyaan…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl font-sans text-sm transition-all duration-300"
                style={{
                  background: 'var(--color-denso-white)',
                  border: '1px solid var(--color-denso-slate-pale)',
                  color: 'var(--color-denso-slate)',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(30, 63, 143, 0.06)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-denso-blue)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 63, 143, 0.10)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-denso-slate-pale)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 63, 143, 0.06)';
                }}
                aria-label="Cari FAQ"
              />
            </div>
          </motion.div>

          {/* FAQ items */}
          <div className="space-y-2.5">
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: index * 0.04 + 0.1 }}
              >
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: 'var(--color-denso-white)',
                    border: openIndex === index
                      ? '1px solid rgba(30, 63, 143, 0.2)'
                      : '1px solid rgba(30, 63, 143, 0.08)',
                    boxShadow: openIndex === index
                      ? '0 4px 20px rgba(30, 63, 143, 0.08)'
                      : '0 1px 4px rgba(30, 63, 143, 0.04)',
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="font-display font-semibold text-sm pr-4 leading-snug"
                      style={{ color: 'var(--color-denso-slate)' }}
                    >
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                      style={{
                        background: openIndex === index
                          ? 'var(--color-denso-blue)'
                          : 'var(--color-denso-blue-pale)',
                        color: openIndex === index
                          ? 'var(--color-denso-white)'
                          : 'var(--color-denso-blue)',
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
                          <div
                            className="h-px mb-4"
                            style={{ background: 'rgba(30, 63, 143, 0.1)' }}
                          />
                          <p
                            className="font-sans text-sm leading-relaxed"
                            style={{ color: 'var(--color-denso-slate-mid)' }}
                          >
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
                <p className="font-sans text-sm" style={{ color: 'var(--color-denso-slate-mid)' }}>
                  Pertanyaan tidak ditemukan.{' '}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-semibold hover:underline"
                    style={{ color: 'var(--color-denso-blue)' }}
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
