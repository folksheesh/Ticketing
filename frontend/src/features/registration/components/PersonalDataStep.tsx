import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Briefcase, Hash, Shirt, ArrowRight, UserRound, Users } from 'lucide-react';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { RippleButton } from '../../../components/atoms/RippleButton';
import { cn } from '../../../lib/cn';
import type { MaritalStatus, TShirtSize } from '../types';

const schema = z.object({
  fullName:      z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  nik:           z.string().min(5, 'NIK harus diisi'),
  division:      z.string().min(2, 'Divisi harus diisi'),
  email:         z.string().email('Format email tidak valid'),
  phone:         z.string().min(9, 'Nomor HP tidak valid'),
  tshirtSize:    z.enum(['S','M','L','XL','XXL','3XL'], { errorMap: () => ({ message: 'Pilih ukuran kaos' }) }),
  maritalStatus: z.enum(['Single','Family'],            { errorMap: () => ({ message: 'Pilih status pernikahan' }) }),
});
type Form = z.infer<typeof schema>;

/* ─── shared input style helpers ──────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  width: '100%',
  background: '#F5F7F8',
  border: '1.5px solid #CDD4D8',
  borderRadius: '0.75rem',
  padding: '0.75rem 1rem 0.75rem 2.75rem',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  color: '#4A565E',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const inputFocusStyle = {
  borderColor: '#DC0032',
  boxShadow: '0 0 0 3px rgba(220,0,50,0.10)',
  background: '#FFFFFF',
};

const inputErrorStyle = { borderColor: '#DC0032' };

function Field({
  label, icon: Icon, error, children,
}: {
  label: string;
  icon: React.ElementType;
  error?: { message?: string };
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold" style={{ color: '#4A565E' }}>{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: '#9AAAB3' }} />
        </span>
        {children}
      </div>
      {error && (
        <p className="text-xs font-medium pl-1" style={{ color: '#DC0032' }}>{error.message}</p>
      )}
    </div>
  );
}

function StyledInput({ error, onFocus, onBlur, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      style={{ ...inputBase, ...(error ? inputErrorStyle : {}) }}
      onFocus={(e) => { Object.assign(e.currentTarget.style, inputFocusStyle); onFocus?.(e); }}
      onBlur={(e)  => { Object.assign(e.currentTarget.style, { ...inputBase, ...(error ? inputErrorStyle : {}) }); onBlur?.(e); }}
      {...props}
    />
  );
}

function StyledSelect({ error, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      style={{
        ...inputBase,
        padding: '0.75rem 1rem 0.75rem 2.75rem',
        appearance: 'none',
        ...(error ? inputErrorStyle : {}),
      }}
      onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
      onBlur={(e)  => Object.assign(e.currentTarget.style, { ...inputBase, padding: '0.75rem 1rem 0.75rem 2.75rem', appearance: 'none' })}
      {...props}
    />
  );
}

export function PersonalDataStep() {
  const { personalData, setPersonalData, nextStep, setStep } = useRegistrationStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName:      personalData.fullName,
      nik:           personalData.nik,
      division:      personalData.division,
      email:         personalData.email,
      phone:         personalData.phone,
      tshirtSize:    (personalData.tshirtSize  || undefined) as any,
      maritalStatus: (personalData.maritalStatus || undefined) as any,
    },
  });

  const watchedStatus = watch('maritalStatus');

  const onSubmit = (data: Form) => {
    setPersonalData({ ...data, tshirtSize: data.tshirtSize as TShirtSize, maritalStatus: data.maritalStatus as MaritalStatus });
    data.maritalStatus === 'Single' ? setStep(3) : nextStep();
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
            1
          </span>
          <h2 className="font-display font-extrabold text-xl" style={{ color: '#4A565E' }}>
            Data Pribadi
          </h2>
        </div>
        <p className="font-sans text-sm" style={{ color: '#6B7882' }}>
          Informasi ini digunakan untuk pencetakan tiket dan pendataan acara.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Nama Lengkap" icon={User} error={errors.fullName}>
            <StyledInput
              placeholder="Ketik nama lengkap…"
              error={!!errors.fullName}
              {...register('fullName')}
            />
          </Field>

          <Field label="NIK (Nomor Induk Karyawan)" icon={Hash} error={errors.nik}>
            <StyledInput
              placeholder="Ketik NIK…"
              error={!!errors.nik}
              {...register('nik')}
            />
          </Field>

          <Field label="Email Pribadi / Kantor" icon={Mail} error={errors.email}>
            <StyledInput
              type="email"
              placeholder="email@example.com"
              error={!!errors.email}
              {...register('email')}
            />
          </Field>

          <Field label="Nomor WhatsApp" icon={Phone} error={errors.phone}>
            <StyledInput
              placeholder="08123456789"
              error={!!errors.phone}
              {...register('phone')}
            />
          </Field>

          <Field label="Divisi / Departemen" icon={Briefcase} error={errors.division}>
            <StyledInput
              placeholder="Contoh: IT, HRD, Production"
              error={!!errors.division}
              {...register('division')}
            />
          </Field>

          <Field label="Ukuran Kaos" icon={Shirt} error={errors.tshirtSize}>
            <StyledSelect error={!!errors.tshirtSize} {...register('tshirtSize')}>
              <option value="" disabled>Pilih ukuran…</option>
              {(['S','M','L','XL','XXL','3XL'] as const).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </StyledSelect>
          </Field>
        </div>

        {/* Marital status */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: '#4A565E' }}>
            Status Kehadiran
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['Single', 'Family'] as const).map((val) => {
              const active = watchedStatus === val;
              const Icon = val === 'Single' ? UserRound : Users;
              return (
                <label key={val} className="cursor-pointer">
                  <input type="radio" value={val} className="sr-only" {...register('maritalStatus')} />
                  <div
                    className="relative p-4 rounded-2xl text-center transition-all duration-200 select-none"
                    style={{
                      border: active ? '2px solid #DC0032' : '2px solid #CDD4D8',
                      background: active ? '#FFF0F3' : '#F5F7F8',
                    }}
                  >
                    <div className="flex justify-center mb-2">
                      <Icon
                        className="w-6 h-6"
                        style={{ color: active ? '#DC0032' : '#9AAAB3' }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <p
                      className="font-display font-bold text-base mb-1"
                      style={{ color: active ? '#DC0032' : '#4A565E' }}
                    >
                      {val === 'Single' ? 'Single' : 'Family'}
                    </p>
                    <p className="font-sans text-xs" style={{ color: '#6B7882' }}>
                      {val === 'Single'
                        ? 'Datang sendiri'
                        : 'Bersama pasangan / anak'}
                    </p>
                    {active && (
                      <span
                        className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full"
                        style={{ background: '#DC0032' }}
                      />
                    )}
                  </div>
                </label>
              );
            })}
          </div>
          {errors.maritalStatus && (
            <p className="text-xs font-medium pl-1 mt-2" style={{ color: '#DC0032' }}>
              {errors.maritalStatus.message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="pt-6 flex justify-end"
          style={{ borderTop: '1px solid #EEF1F3' }}
        >
          <RippleButton
            type="submit"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            Lanjut
          </RippleButton>
        </div>
      </form>
    </div>
  );
}
