import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Mail, Phone, Briefcase, Hash, Shirt,
  ArrowRight, UserRound, Users, AlertCircle,
  ChevronDown, Search, Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { RippleButton } from '../../../components/atoms/RippleButton';
import type { MaritalStatus, TShirtSize } from '../types';

/* ─── Zod schema ──────────────────────────────────────────────────────────── */
const schema = z.object({
  fullName:      z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  nik:           z.string().min(5, 'NIK harus diisi'),
  division:      z.string().min(2, 'Divisi harus diisi'),
  email:         z.string().email('Format email tidak valid'),
  phone:         z.string().min(9, 'Nomor HP tidak valid'),
  tshirtSize:    z.enum(['S','M','L','XL','XXL','3XL'] as const),
  maritalStatus: z.enum(['Single','Family'] as const),
});
type Form = z.infer<typeof schema>;

/* ─── Division list ───────────────────────────────────────────────────────── */
const DIVISIONS = [
  'IT', 'HRD', 'Finance', 'Production', 'Engineering',
  'Quality Control', 'Procurement', 'Logistics', 'Marketing',
  'Sales', 'R&D', 'Legal', 'Administration', 'Security',
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'] as const;

/* ─── Base input style ────────────────────────────────────────────────────── */
const base: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-denso-slate-ghost)',
  border: '1.5px solid #CDD4D8',
  borderRadius: '0.75rem',
  padding: '0.72rem 2.5rem 0.72rem 2.75rem',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  color: 'var(--color-denso-slate)',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};
const focusStyle  = { borderColor: 'var(--color-denso-red)', boxShadow: '0 0 0 3px rgba(220,0,50,0.10)', background: 'var(--color-denso-white)' };
const errorStyle  = { borderColor: 'var(--color-denso-red)', background: 'var(--color-denso-red-pale)' };

/* ─── Shared Field wrapper ────────────────────────────────────────────────── */
function Field({
  label, icon: Icon, error, children,
}: {
  label: string;
  icon: React.ElementType;
  error?: { message?: string };
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="space-y-1.5"
      animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <label className="block text-sm font-semibold" style={{ color: 'var(--color-denso-slate)' }}>{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ zIndex: 1 }}>
          <Icon width={17} height={17} style={{ color: error ? 'var(--color-denso-red)' : 'var(--color-denso-slate-soft)' }} strokeWidth={1.6} />
        </span>
        {children}
        {/* Right error icon */}
        {error && (
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <AlertCircle width={15} height={15} style={{ color: 'var(--color-denso-red)' }} />
          </span>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-medium pl-1 flex items-center gap-1"
            style={{ color: 'var(--color-denso-red)' }}
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Text input ──────────────────────────────────────────────────────────── */
function SInput({
  error, onFocus, onBlur, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      style={{ ...base, ...(error ? errorStyle : {}) }}
      onFocus={(e) => { Object.assign(e.currentTarget.style, focusStyle); onFocus?.(e); }}
      onBlur={(e)  => { Object.assign(e.currentTarget.style, { ...base, ...(error ? errorStyle : {}) }); onBlur?.(e); }}
      {...props}
    />
  );
}

/* ─── Custom dropdown: Division (searchable) ──────────────────────────────── */
function DivisionDropdown({
  value, onChange, error,
}: { value: string; onChange: (v: string) => void; error?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filtered = DIVISIONS.filter(d =>
    d.toLowerCase().includes(query.toLowerCase())
  );

  const updatePanelPosition = () => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const availableHeight = window.innerHeight - rect.bottom - 16;
    setPanelStyle({
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.bottom}px`,
      width: `${rect.width}px`,
      maxHeight: `${Math.max(120, Math.min(264, availableHeight))}px`,
      zIndex: 9999,
    });
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => {
      document.removeEventListener('pointerdown', handler);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, { passive: true });
    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition);
    };
  }, [open]);

  const select = (v: string) => { onChange(v); setOpen(false); setQuery(''); };

  useEffect(() => {
    if (!open) return;
    const preventScroll = (e: TouchEvent) => e.stopPropagation();
    document.body.style.overflow = 'hidden';
    document.body.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      document.body.style.overflow = '';
      document.body.removeEventListener('touchmove', preventScroll);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          ...base,
          padding: '0.72rem 2.5rem 0.72rem 2.75rem',
          textAlign: 'left',
          cursor: 'pointer',
          ...(error ? errorStyle : {}),
          ...(open ? focusStyle : {}),
        }}
      >
        <span style={{ color: value ? 'var(--color-denso-slate)' : 'var(--color-denso-slate-soft)' }}>
          {value || 'Pilih atau ketik divisi…'}
        </span>
      </button>

      {/* Chevron */}
      <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown width={16} height={16} style={{ color: 'var(--color-denso-slate-soft)' }} />
        </motion.span>
      </span>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            className="rounded-2xl overflow-hidden"
            style={{
              ...panelStyle,
              background: 'var(--color-denso-white)',
              border: '1.5px solid #EEF1F3',
              boxShadow: '0 8px 24px rgba(74,86,94,0.12)',
              transformOrigin: 'top',
            }}
          >
            {/* Search */}
            <div className="p-2 border-b" style={{ borderColor: 'var(--color-denso-slate-mist)' }}>
              <div className="relative">
                <Search width={14} height={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--color-denso-slate-soft)' }}
                />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Cari divisi…"
                  className="w-full rounded-xl text-sm"
                  style={{
                    padding: '0.5rem 0.75rem 0.5rem 2rem',
                    background: 'var(--color-denso-slate-ghost)',
                    border: '1px solid #EEF1F3',
                    outline: 'none',
                    fontFamily: 'inherit',
                    color: 'var(--color-denso-slate)',
                  }}
                />
              </div>
            </div>

            {/* Options */}
            <ul className="max-h-44 overflow-y-auto py-1 touch-manipulation" style={{ WebkitOverflowScrolling: 'touch' }}>
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-center" style={{ color: 'var(--color-denso-slate-soft)' }}>
                  Tidak ditemukan
                </li>
              ) : filtered.map(d => (
                <li key={d}>
                  <button
                    type="button"
                    onClick={() => select(d)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors"
                    style={{
                      background: value === d ? 'var(--color-denso-red-pale)' : 'transparent',
                      color: value === d ? 'var(--color-denso-red)' : 'var(--color-denso-slate)',
                      fontFamily: 'inherit',
                      fontWeight: value === d ? 600 : 400,
                    }}
                    onMouseEnter={e => { if (value !== d) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-denso-slate-ghost)'; }}
                    onMouseLeave={e => { if (value !== d) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    {d}
                    {value === d && <Check width={14} height={14} style={{ color: 'var(--color-denso-red)' }} />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Custom dropdown: T-shirt size (pill selector) ──────────────────────── */
function SizeSelector({
  value, onChange, error,
}: { value: string; onChange: (v: string) => void; error?: boolean }) {
  return (
    <div
      className="flex gap-2 flex-wrap"
      style={{ paddingLeft: '0.125rem' }}
      role="group"
      aria-label="Pilih ukuran kaos"
    >
      {SIZES.map(s => {
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="font-display font-bold transition-all duration-150"
            style={{
              minWidth: '2.75rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '0.625rem',
              fontSize: '0.8rem',
              border: active
                ? '2px solid #DC0032'
                : error
                  ? '1.5px solid #DC003240'
                  : '1.5px solid #CDD4D8',
              background: active ? 'var(--color-denso-red)' : error ? 'var(--color-denso-red-pale)' : 'var(--color-denso-slate-ghost)',
              color: active ? 'var(--color-denso-white)' : error ? 'var(--color-denso-red)' : 'var(--color-denso-slate-mid)',
              cursor: 'pointer',
              boxShadow: active ? '0 2px 10px rgba(220,0,50,0.25)' : 'none',
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export function PersonalDataStep() {
  const { personalData, setPersonalData, nextStep, setStep } = useRegistrationStore();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName:      personalData.fullName,
      nik:           personalData.nik,
      division:      personalData.division,
      email:         personalData.email,
      phone:         personalData.phone,
      tshirtSize:    (personalData.tshirtSize   || undefined) as any,
      maritalStatus: (personalData.maritalStatus || undefined) as any,
    },
  });

  const watchedStatus   = watch('maritalStatus');
  const watchedSize     = watch('tshirtSize');
  const watchedDivision = watch('division');

  const onSubmit = (data: Form) => {
    setPersonalData({
      ...data,
      tshirtSize:    data.tshirtSize    as TShirtSize,
      maritalStatus: data.maritalStatus as MaritalStatus,
    });
    data.maritalStatus === 'Single' ? setStep(3) : nextStep();
  };

  return (
    <div className="flex flex-col">
      {/* ── Content ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="p-7 sm:p-8 space-y-5">
          {/* Step header */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-bold text-white flex-shrink-0"
                style={{ background: 'var(--color-denso-red)' }}
              >
                1
              </span>
              <h2 className="font-display font-extrabold text-xl" style={{ color: 'var(--color-denso-slate)' }}>
                Data Pribadi
              </h2>
            </div>
            <p className="font-sans text-sm" style={{ color: 'var(--color-denso-slate-mid)' }}>
              Informasi ini digunakan untuk pencetakan tiket dan pendataan acara.
            </p>
          </div>

          {/* ── Text fields grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Lengkap" icon={User} error={errors.fullName}>
              <SInput placeholder="Ketik nama lengkap…" error={!!errors.fullName} {...register('fullName')} />
            </Field>
            <Field label="NIK (Nomor Induk Karyawan)" icon={Hash} error={errors.nik}>
              <SInput
                placeholder="Ketik NIK…"
                inputMode="numeric"
                error={!!errors.nik}
                {...register('nik', {
                  onChange: e => { e.target.value = e.target.value.replace(/\D/g, ''); }
                })}
              />
            </Field>
            <Field label="Email Pribadi / Kantor" icon={Mail} error={errors.email}>
              <SInput type="email" placeholder="email@example.com" error={!!errors.email} {...register('email')} />
            </Field>
            <Field label="Nomor WhatsApp" icon={Phone} error={errors.phone}>
              <SInput
                placeholder="08123456789"
                inputMode="numeric"
                error={!!errors.phone}
                {...register('phone', {
                  onChange: e => { e.target.value = e.target.value.replace(/\D/g, ''); }
                })}
              />
            </Field>
          </div>

          {/* ── Division ── */}
          <Field label="Divisi / Departemen" icon={Briefcase} error={errors.division}>
            <input type="hidden" {...register('division')} />
            <DivisionDropdown
              value={watchedDivision}
              onChange={v => setValue('division', v, { shouldValidate: true })}
              error={!!errors.division}
            />
          </Field>

          {/* ── T-shirt size ── */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Shirt width={16} height={16} style={{ color: errors.tshirtSize ? 'var(--color-denso-red)' : 'var(--color-denso-slate-soft)' }} strokeWidth={1.6} />
              <label className="text-sm font-semibold" style={{ color: 'var(--color-denso-slate)' }}>Ukuran Kaos</label>
              {errors.tshirtSize && <AlertCircle width={14} height={14} style={{ color: 'var(--color-denso-red)', marginLeft: 'auto' }} />}
            </div>
            <input type="hidden" {...register('tshirtSize')} />
            <SizeSelector
              value={watchedSize}
              onChange={v => setValue('tshirtSize', v as TShirtSize, { shouldValidate: true })}
              error={!!errors.tshirtSize}
            />
            <AnimatePresence>
              {errors.tshirtSize && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }} className="text-xs font-medium pl-1" style={{ color: 'var(--color-denso-red)' }}>
                  {errors.tshirtSize.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* ── Marital status ── */}
          <div>
            <label className="block text-sm font-semibold mb-2.5" style={{ color: 'var(--color-denso-slate)' }}>Status Kehadiran</label>
            <div className="flex gap-3">
              {(['Single', 'Family'] as const).map((val) => {
                const active = watchedStatus === val;
                const Icon   = val === 'Single' ? UserRound : Users;
                const hasErr = !!errors.maritalStatus;
                return (
                  <label key={val} className="cursor-pointer flex-1">
                    <input type="radio" value={val} className="sr-only" {...register('maritalStatus')} />
                    <div
                      className="relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 select-none"
                      style={{
                        border: active ? '2px solid #DC0032' : hasErr ? '2px solid #DC003240' : '2px solid #CDD4D8',
                        background: active ? 'var(--color-denso-red-pale)' : hasErr ? 'var(--color-denso-red-pale)' : 'var(--color-denso-slate-ghost)',
                      }}
                    >
                      <Icon width={20} height={20} strokeWidth={1.5}
                        style={{ color: active ? 'var(--color-denso-red)' : hasErr ? 'rgba(228,33,31,0.5)' : 'var(--color-denso-slate-soft)', flexShrink: 0 }} />
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm leading-tight" style={{ color: active ? 'var(--color-denso-red)' : 'var(--color-denso-slate)' }}>{val}</p>
                        <p className="font-sans text-xs leading-tight mt-0.5" style={{ color: 'var(--color-denso-slate-soft)' }}>
                          {val === 'Single' ? 'Datang sendiri' : 'Bawa keluarga'}
                        </p>
                      </div>
                      {active && <span className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full" style={{ background: 'var(--color-denso-red)' }} />}
                    </div>
                  </label>
                );
              })}
            </div>
            <AnimatePresence>
              {errors.maritalStatus && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }} className="text-xs font-medium pl-1 mt-2" style={{ color: 'var(--color-denso-red)' }}>
                  {errors.maritalStatus.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Footer — naturally at bottom, content padded above it ── */}
        <div
          className="flex justify-end px-7 sm:px-8 py-4"
          style={{ borderTop: '1px solid #EEF1F3', background: 'var(--color-denso-white)' }}
        >
          <RippleButton type="submit" size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
            Lanjut
          </RippleButton>
        </div>
      </form>
    </div>
  );
}
