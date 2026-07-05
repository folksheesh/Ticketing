import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { RippleButton } from '../../../components/atoms/RippleButton';

/* ─── schema ──────────────────────────────────────────────────────────────── */
const schema = z.object({
  hasSpouse: z.boolean(),
  spouseName: z.string().optional(),
  spouseTshirtSize: z.enum(['S','M','L','XL','XXL','3XL']).optional(),
  hasChildren: z.boolean(),
  children: z.array(z.object({
    id: z.string(),
    name: z.string().min(2, 'Nama anak harus diisi'),
    age:  z.coerce.number().min(0).max(50, 'Umur tidak valid'),
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

/* ─── style helpers (same pattern as PersonalDataStep) ───────────────────── */
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
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const focusIn  = { borderColor: '#DC0032', boxShadow: '0 0 0 3px rgba(220,0,50,0.10)', background: '#FFFFFF' };
const focusOut = { ...inputBase };

function SInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      style={inputBase}
      onFocus={(e) => Object.assign(e.currentTarget.style, focusIn)}
      onBlur={(e)  => Object.assign(e.currentTarget.style, focusOut)}
      {...props}
    />
  );
}
function SSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      style={{ ...inputBase, appearance: 'none' }}
      onFocus={(e) => Object.assign(e.currentTarget.style, { ...focusIn, appearance: 'none' })}
      onBlur={(e)  => Object.assign(e.currentTarget.style, { ...inputBase, appearance: 'none' })}
      {...props}
    />
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
      className="relative flex-shrink-0 focus:outline-none"
      style={{
        width: '2.75rem', height: '1.5rem',
        borderRadius: '999px',
        background: checked ? '#DC0032' : '#CDD4D8',
        transition: 'background 0.25s',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <span
        className="absolute top-[3px]"
        style={{
          left: checked ? 'calc(100% - 1.125rem - 3px)' : '3px',
          width: '1.125rem', height: '1.125rem',
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.25s',
          display: 'block',
        }}
      />
    </button>
  );
}

/* ─── Section toggle row ──────────────────────────────────────────────────── */
function ToggleRow({
  title, subtitle, checked, onChange,
}: { title: string; subtitle: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl"
      style={{ background: '#F5F7F8', border: '1.5px solid #EEF1F3' }}
    >
      <div>
        <p className="font-display font-semibold text-sm" style={{ color: '#4A565E' }}>{title}</p>
        <p className="font-sans text-xs mt-0.5" style={{ color: '#6B7882' }}>{subtitle}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

const SIZES = ['S','M','L','XL','XXL','3XL'] as const;

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

  const hasSpouse   = watch('hasSpouse');
  const hasChildren = watch('hasChildren');

  const onSubmit = (data: Form) => {
    setFamilyData({
      ...data,
      spouseName:       data.hasSpouse   ? data.spouseName : '',
      spouseTshirtSize: data.hasSpouse   ? data.spouseTshirtSize : undefined,
      children:         data.hasChildren ? data.children  : [],
    });
    nextStep();
  };

  return (
    <div className="p-7 sm:p-10">
      {/* Step header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-3">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

        {/* ── Spouse ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <ToggleRow
            title="Membawa Pasangan?"
            subtitle="Istri / Suami"
            checked={hasSpouse}
            onChange={(v) => setValue('hasSpouse', v)}
          />

          {hasSpouse && (
            <div className="space-y-4 pl-1">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold" style={{ color: '#4A565E' }}>
                  Nama Pasangan
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-[18px] h-[18px]" style={{ color: '#9AAAB3' }} />
                  </span>
                  <input
                    style={{ ...inputBase, paddingLeft: '2.75rem', ...(errors.spouseName ? { borderColor: '#DC0032' } : {}) }}
                    placeholder="Ketik nama pasangan…"
                    onFocus={(e) => Object.assign(e.currentTarget.style, { ...focusIn, paddingLeft: '2.75rem' })}
                    onBlur={(e)  => Object.assign(e.currentTarget.style, { ...inputBase, paddingLeft: '2.75rem' })}
                    {...register('spouseName')}
                  />
                </div>
                {errors.spouseName && (
                  <p className="text-xs font-medium pl-1" style={{ color: '#DC0032' }}>
                    {errors.spouseName.message}
                  </p>
                )}
              </div>

              {/* T-shirt size */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold" style={{ color: '#4A565E' }}>
                  Ukuran Baju Pasangan
                </label>
                <SSelect className="w-full sm:w-40" {...register('spouseTshirtSize')}>
                  <option value="">Pilih ukuran…</option>
                  {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </SSelect>
              </div>
            </div>
          )}
        </div>

        <div style={{ height: '1px', background: '#EEF1F3' }} />

        {/* ── Children ────────────────────────────────────────────── */}
        <div className="space-y-4">
          <ToggleRow
            title="Membawa Anak?"
            subtitle="Tiket khusus anak usia ≤12 tahun termasuk kupon es krim 🍦"
            checked={hasChildren}
            onChange={(v) => setValue('hasChildren', v)}
          />

          {hasChildren && (
            <div className="space-y-3 pl-1">
              {fields.map((field, i) => (
                <div
                  key={field.id}
                  className="rounded-2xl p-4 relative"
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #EEF1F3',
                    boxShadow: '0 1px 6px rgba(74,86,94,0.06)',
                  }}
                >
                  {/* Row label */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-display font-bold text-xs uppercase tracking-widest"
                      style={{ color: '#DC0032' }}
                    >
                      Anak {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                      style={{ color: '#9AAAB3' }}
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1 space-y-1">
                      <label className="block text-xs font-semibold" style={{ color: '#4A565E' }}>Nama</label>
                      <SInput placeholder="Nama anak" {...register(`children.${i}.name`)} />
                      {errors.children?.[i]?.name && (
                        <p className="text-[11px]" style={{ color: '#DC0032' }}>{errors.children[i]?.name?.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold" style={{ color: '#4A565E' }}>Umur (tahun)</label>
                      <SInput type="number" placeholder="0" {...register(`children.${i}.age`)} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold" style={{ color: '#4A565E' }}>Ukuran Baju</label>
                      <SSelect {...register(`children.${i}.tshirtSize`)}>
                        <option value="" disabled>Pilih…</option>
                        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </SSelect>
                    </div>
                  </div>

                  <input type="hidden" {...register(`children.${i}.id`)} value={field.id} />
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ id: crypto.randomUUID(), name: '', age: 0, tshirtSize: 'S' })}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-sans font-semibold text-sm transition-all duration-200"
                style={{
                  border: '2px dashed #CDD4D8',
                  color: '#9AAAB3',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#DC0032';
                  e.currentTarget.style.color = '#DC0032';
                  e.currentTarget.style.background = '#DC00320A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#CDD4D8';
                  e.currentTarget.style.color = '#9AAAB3';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Plus className="w-4 h-4" />
                Tambah Anak
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="pt-6 flex justify-between items-center"
          style={{ borderTop: '1px solid #EEF1F3' }}
        >
          <RippleButton
            type="button"
            variant="ghost"
            onClick={prevStep}
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            Kembali
          </RippleButton>

          <RippleButton
            type="submit"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            Generate Tiket
          </RippleButton>
        </div>
      </form>
    </div>
  );
}
