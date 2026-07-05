import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Plus, Trash2, ArrowRight, ArrowLeft, Shirt, Baby } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { RippleButton } from '../../../components/atoms/RippleButton';

/* ─── Schema ──────────────────────────────────────────────────────────────── */
const schema = z.object({
  hasSpouse:        z.boolean(),
  spouseName:       z.string().optional(),
  spouseTshirtSize: z.enum(['S','M','L','XL','XXL','3XL']).optional(),
  hasChildren:      z.boolean(),
  children: z.array(z.object({
    id:         z.string(),
    name:       z.string().min(2, 'Nama anak harus diisi'),
    age:        z.coerce.number().min(0).max(50, 'Umur tidak valid'),
    tshirtSize: z.enum(['S','M','L','XL','XXL','3XL'], {
      errorMap: () => ({ message: 'Pilih ukuran' }),
    }).optional(),
  })),
}).superRefine((data, ctx) => {
  if (data.hasSpouse && (!data.spouseName || data.spouseName.length < 2)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nama pasangan harus diisi', path: ['spouseName'] });
  }
});
type Form = z.infer<typeof schema>;

const SIZES = ['S','M','L','XL','XXL','3XL'] as const;

/* ─── Input styles ────────────────────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  width: '100%',
  background: '#F5F7F8',
  border: '1.5px solid #CDD4D8',
  borderRadius: '0.75rem',
  padding: '0.65rem 0.875rem',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  color: '#4A565E',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};
const focusIn  = { borderColor: '#DC0032', boxShadow: '0 0 0 3px rgba(220,0,50,0.10)', background: '#FFFFFF' };

function SInput({ hasError, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  const errStyle = hasError ? { borderColor: '#DC0032', background: '#FFF8F9' } : {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block minus and 'e' (scientific notation) on number inputs
    if (props.type === 'number' && (e.key === '-' || e.key === 'e' || e.key === '+')) {
      e.preventDefault();
    }
    props.onKeyDown?.(e);
  };

  return (
    <input
      style={{ ...inputBase, ...errStyle }}
      onFocus={(e) => Object.assign(e.currentTarget.style, focusIn)}
      onBlur={(e)  => Object.assign(e.currentTarget.style, { ...inputBase, ...errStyle })}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

/* ─── Pill size selector (same as PersonalDataStep) ──────────────────────── */
function SizeSelector({
  value, onChange,
}: { value: string | undefined; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {SIZES.map(s => {
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="font-display font-bold transition-all duration-150"
            style={{
              minWidth: '2.5rem',
              padding: '0.35rem 0.625rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              border: active ? '2px solid #DC0032' : '1.5px solid #CDD4D8',
              background: active ? '#DC0032' : '#F5F7F8',
              color: active ? '#FFFFFF' : '#6B7882',
              cursor: 'pointer',
              boxShadow: active ? '0 2px 8px rgba(220,0,50,0.22)' : 'none',
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Toggle switch ───────────────────────────────────────────────────────── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: '2.75rem', height: '1.5rem',
        borderRadius: '999px',
        background: checked ? '#DC0032' : '#CDD4D8',
        transition: 'background 0.25s',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: checked ? 'calc(100% - 1.125rem - 3px)' : '3px',
        width: '1.125rem', height: '1.125rem',
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.25s',
        display: 'block',
      }} />
    </button>
  );
}

/* ─── Section card with toggle ───────────────────────────────────────────── */
function ToggleCard({
  title, subtitle, checked, onChange, children,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        border: checked ? '1.5px solid #DC003225' : '1.5px solid #EEF1F3',
        background: '#FFFFFF',
        boxShadow: checked ? '0 2px 16px rgba(220,0,50,0.06)' : 'none',
      }}
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between px-4 py-3.5 cursor-pointer"
        style={{ background: checked ? '#FFF8F9' : '#F5F7F8' }}
        onClick={() => onChange(!checked)}
      >
        <div>
          <p className="font-display font-semibold text-sm" style={{ color: '#4A565E' }}>{title}</p>
          <p className="font-sans text-xs mt-0.5" style={{ color: '#9AAAB3' }}>{subtitle}</p>
        </div>
        <Toggle checked={checked} onChange={onChange} />
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {checked && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 pt-3 space-y-4" style={{ borderTop: '1px solid #EEF1F3' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export function FamilyDataStep() {
  const { familyData, setFamilyData, nextStep, prevStep } = useRegistrationStore();

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      hasSpouse:        familyData.hasSpouse,
      spouseName:       familyData.spouseName,
      spouseTshirtSize: (familyData.spouseTshirtSize as any) || undefined,
      hasChildren:      familyData.hasChildren,
      children:         familyData.children,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'children' });

  const hasSpouse        = watch('hasSpouse');
  const hasChildren      = watch('hasChildren');
  const spouseSize       = watch('spouseTshirtSize');
  const childrenValues   = watch('children');

  const onSubmit = (data: Form) => {
    setFamilyData({
      ...data,
      spouseName:       data.hasSpouse   ? data.spouseName   : '',
      spouseTshirtSize: data.hasSpouse   ? data.spouseTshirtSize : undefined,
      children:         data.hasChildren ? data.children     : [],
    });
    nextStep();
  };

  return (
    <div className="flex flex-col">
      {/* ── Content ── */}
      <div className="flex-1 p-6 sm:p-8" style={{ overscrollBehavior: 'contain' }}>
        {/* Step header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-bold text-white flex-shrink-0"
              style={{ background: '#DC0032' }}
            >
              2
            </span>
            <h2 className="font-display font-extrabold text-xl" style={{ color: '#4A565E' }}>
              Data Keluarga
            </h2>
          </div>
          <p className="font-sans text-sm" style={{ color: '#6B7882' }}>
            Daftarkan anggota keluarga inti yang akan hadir bersama Anda.
          </p>
        </div>

        <div className="space-y-4">
          {/* ── Pasangan ── */}
          <ToggleCard
            title="Membawa Pasangan?"
            subtitle="Istri / Suami"
            checked={hasSpouse}
            onChange={v => setValue('hasSpouse', v)}
          >
            {/* Spouse name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold" style={{ color: '#4A565E' }}>
                Nama Pasangan
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User width={16} height={16} style={{ color: errors.spouseName ? '#DC0032' : '#9AAAB3' }} strokeWidth={1.6} />
                </span>
                <input
                  style={{
                    ...inputBase,
                    paddingLeft: '2.5rem',
                    ...(errors.spouseName ? { borderColor: '#DC0032', background: '#FFF8F9' } : {}),
                  }}
                  placeholder="Ketik nama pasangan…"
                  onFocus={(e) => Object.assign(e.currentTarget.style, { ...focusIn, paddingLeft: '2.5rem' })}
                  onBlur={(e)  => Object.assign(e.currentTarget.style, {
                    ...inputBase,
                    paddingLeft: '2.5rem',
                    ...(errors.spouseName ? { borderColor: '#DC0032', background: '#FFF8F9' } : {}),
                  })}
                  {...register('spouseName')}
                />
              </div>
              {errors.spouseName && (
                <p className="text-xs font-medium pl-1" style={{ color: '#DC0032' }}>{errors.spouseName.message}</p>
              )}
            </div>

            {/* Spouse size */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Shirt width={14} height={14} style={{ color: '#9AAAB3' }} strokeWidth={1.6} />
                <label className="text-xs font-semibold" style={{ color: '#4A565E' }}>Ukuran Baju Pasangan</label>
              </div>
              <input type="hidden" {...register('spouseTshirtSize')} />
              <SizeSelector
                value={spouseSize}
                onChange={v => setValue('spouseTshirtSize', v as any, { shouldValidate: true })}
              />
            </div>
          </ToggleCard>

          {/* ── Anak ── */}
          <ToggleCard
            title="Membawa Anak?"
            subtitle="Anak ≤12 tahun mendapat kupon es krim"
            checked={hasChildren}
            onChange={v => setValue('hasChildren', v)}
          >
            <div className="space-y-3">
              {fields.map((field, i) => (
                <div
                  key={field.id}
                  className="rounded-xl p-4"
                  style={{ background: '#F5F7F8', border: '1px solid #EEF1F3' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold text-white"
                        style={{ background: '#DC0032' }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-display font-semibold text-xs uppercase tracking-wider" style={{ color: '#4A565E' }}>
                        Anak {i + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="p-1.5 rounded-lg"
                      style={{ color: '#CDD4D8', background: 'transparent' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#DC0032'; (e.currentTarget as HTMLButtonElement).style.background = '#FFF0F3'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#CDD4D8'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    >
                      <Trash2 width={15} height={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <label className="block text-xs font-semibold" style={{ color: '#4A565E' }}>Nama</label>
                      <SInput
                        placeholder="Nama anak"
                        hasError={!!errors.children?.[i]?.name}
                        {...register(`children.${i}.name`)}
                      />
                      {errors.children?.[i]?.name && (
                        <p className="text-[11px] font-medium" style={{ color: '#DC0032' }}>
                          {errors.children[i]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold" style={{ color: '#4A565E' }}>Umur (tahun)</label>
                      <SInput
                        type="number"
                        min="0"
                        max="50"
                        placeholder="0"
                        hasError={!!errors.children?.[i]?.age}
                        {...register(`children.${i}.age`)}
                      />
                      {errors.children?.[i]?.age && (
                        <p className="text-[11px] font-medium" style={{ color: '#DC0032' }}>
                          {errors.children[i]?.age?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Shirt width={13} height={13} style={{ color: '#9AAAB3' }} strokeWidth={1.6} />
                      <label className="text-xs font-semibold" style={{ color: '#4A565E' }}>Ukuran Baju</label>
                    </div>
                    <input type="hidden" {...register(`children.${i}.tshirtSize`)} />
                    <SizeSelector
                      value={childrenValues?.[i]?.tshirtSize}
                      onChange={v => setValue(`children.${i}.tshirtSize`, v as any, { shouldValidate: true })}
                    />
                  </div>

                  <input type="hidden" {...register(`children.${i}.id`)} value={field.id} />
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ id: crypto.randomUUID(), name: '', age: 0, tshirtSize: 'S' })}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sans font-semibold text-sm transition-all duration-200"
                style={{ border: '2px dashed #CDD4D8', color: '#9AAAB3', background: 'transparent' }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#DC0032'; b.style.color = '#DC0032'; b.style.background = '#DC00320A'; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#CDD4D8'; b.style.color = '#9AAAB3'; b.style.background = 'transparent'; }}
              >
                <Plus width={16} height={16} />
                Tambah Anak
              </button>
            </div>
          </ToggleCard>
        </div>
      </div>

      {/* ── Footer — naturally at bottom ── */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="flex items-center justify-between gap-2 px-6 sm:px-8 py-4 flex-nowrap"
          style={{ borderTop: '1px solid #EEF1F3', background: '#FFFFFF' }}
        >
          <RippleButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={prevStep}
            icon={<ArrowLeft className="w-4 h-4" />}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Kembali
          </RippleButton>

          <RippleButton
            type="submit"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Generate Tiket
          </RippleButton>
        </div>
      </form>
    </div>
  );
}
