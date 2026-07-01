import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MessageCircleQuestion } from 'lucide-react';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer, accordionContent } from '../../../lib/animations';
import { FAQ_ITEMS } from '../../../constants/event';
import { cn } from '../../../lib/cn';

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
      className="relative py-24 md:py-32 bg-white overflow-hidden"
      aria-label="Frequently asked questions"
    >
      {/* ── Background Aesthetics ── */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-denso-navy/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-denso-amber/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* ── Left Side: Header & Graphic ── */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={isVisible ? 'animate' : 'initial'}
            className="lg:col-span-5 space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-denso-amber/10 border border-denso-amber/20 text-xs font-display font-bold uppercase tracking-[0.15em] text-denso-amber-deep">
                <MessageCircleQuestion className="w-4 h-4" />
                Ada Pertanyaan?
              </span>
              <h2 className="font-display font-extrabold text-denso-slate text-4xl md:text-5xl tracking-tight">
                Yang Sering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-denso-navy to-denso-navy-light">Ditanyakan</span>
              </h2>
              <p className="font-sans text-lg text-denso-slate-light">
                Temukan jawaban untuk pertanyaan umum seputar acara Family Gathering 2026.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative hidden lg:block">
              {/* Decorative Graphic Element */}
              <div className="w-full aspect-square rounded-[3rem] bg-gradient-to-br from-denso-cream to-[#F7F3ED] border border-denso-gray-100 p-8 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="absolute top-10 right-10 w-32 h-32 bg-denso-amber/20 rounded-full blur-2xl" />
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-denso-navy/10 rounded-full blur-2xl" />
                <div className="h-full w-full border-2 border-dashed border-denso-gray-200 rounded-[2rem] flex items-center justify-center">
                   <div className="text-center space-y-3">
                     <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-denso-navy transform -rotate-12">
                       <span className="text-4xl font-display font-bold">?</span>
                     </div>
                     <div className="w-20 h-20 bg-gradient-to-br from-denso-amber to-denso-amber-deep rounded-2xl shadow-amber flex items-center justify-center mx-auto text-white transform rotate-12 -mt-10">
                       <span className="text-4xl font-display font-bold">!</span>
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Side: FAQ Accordion ── */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={isVisible ? 'animate' : 'initial'}
            className="lg:col-span-7"
          >
            {/* Search */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-denso-gray-400 group-focus-within:text-denso-navy transition-colors" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full pl-14 pr-6 py-4 rounded-2xl font-sans text-base',
                    'bg-[#F8F9FA] border border-transparent',
                    'text-denso-slate placeholder:text-denso-gray-400',
                    'focus:outline-none focus:bg-white focus:ring-4 focus:ring-denso-navy/10 focus:border-denso-navy/20',
                    'transition-all duration-300 shadow-sm'
                  )}
                  aria-label="Cari FAQ"
                />
              </div>
            </motion.div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                >
                  <div
                    className={cn(
                      'rounded-2xl border transition-all duration-300 overflow-hidden',
                      openIndex === index
                        ? 'bg-white border-denso-navy/20 shadow-[0_8px_30px_rgba(0,84,166,0.08)]'
                        : 'bg-white border-denso-gray-100 hover:border-denso-gray-200 hover:shadow-sm'
                    )}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-denso-amber"
                      aria-expanded={openIndex === index}
                    >
                      <span className={cn(
                        "font-display font-bold text-lg pr-4 leading-snug transition-colors duration-300",
                        openIndex === index ? "text-denso-navy" : "text-denso-slate"
                      )}>
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "backOut" }}
                        className={cn(
                          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300',
                          openIndex === index ? 'bg-denso-navy text-white' : 'bg-denso-gray-50 text-denso-gray-500 group-hover:bg-denso-gray-100'
                        )}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          variants={accordionContent}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <div className="px-6 pb-6 pt-2">
                            <div className="p-5 rounded-xl bg-[#F8F9FA] border border-denso-gray-100">
                              <p className="font-sans text-base text-denso-slate-light leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}

              {filteredFAQs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-[#F8F9FA] rounded-3xl border border-dashed border-denso-gray-200"
                >
                  <p className="font-sans text-denso-slate-light text-lg">
                    Pertanyaan tidak ditemukan.{' '}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="font-semibold text-denso-navy hover:text-denso-amber transition-colors mt-2 block mx-auto"
                    >
                      Hapus pencarian
                    </button>
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
