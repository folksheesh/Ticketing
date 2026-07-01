import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Briefcase, Hash, Shirt, ArrowRight } from 'lucide-react';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { RippleButton } from '../../../components/atoms/RippleButton';
import { cn } from '../../../lib/cn';
import type { MaritalStatus, TShirtSize } from '../types';

const personalDataSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap harus minimal 3 karakter"),
  nik: z.string().min(5, "NIK harus diisi dengan benar"),
  division: z.string().min(2, "Divisi harus diisi"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(9, "Nomor HP tidak valid"),
  tshirtSize: z.enum(['S', 'M', 'L', 'XL', 'XXL', '3XL'], { 
    errorMap: () => ({ message: "Pilih ukuran baju" })
  }),
  maritalStatus: z.enum(['Single', 'Family'], {
    errorMap: () => ({ message: "Pilih status pernikahan" })
  }),
});

type PersonalDataForm = z.infer<typeof personalDataSchema>;

export function PersonalDataStep() {
  const { personalData, setPersonalData, nextStep, setStep } = useRegistrationStore();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PersonalDataForm>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      fullName: personalData.fullName,
      nik: personalData.nik,
      division: personalData.division,
      email: personalData.email,
      phone: personalData.phone,
      tshirtSize: (personalData.tshirtSize || undefined) as any,
      maritalStatus: (personalData.maritalStatus || undefined) as any,
    },
  });

  const onSubmit = (data: PersonalDataForm) => {
    setPersonalData({
      ...data,
      tshirtSize: data.tshirtSize as TShirtSize,
      maritalStatus: data.maritalStatus as MaritalStatus
    });

    if (data.maritalStatus === 'Single') {
      // Skip family step
      setStep(3);
    } else {
      nextStep();
    }
  };

  const InputField = ({ label, icon: Icon, error, ...props }: any) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-denso-slate">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-denso-gray-400" />
        </div>
        <input 
          className={cn(
            "w-full pl-12 pr-4 py-3 bg-[#F8F9FA] border border-denso-gray-200 rounded-xl",
            "focus:bg-white focus:outline-none focus:ring-2 focus:ring-denso-amber/30 focus:border-denso-amber",
            "transition-all duration-300 font-sans text-denso-slate placeholder:text-denso-gray-400",
            error && "border-denso-error focus:ring-denso-error/30 focus:border-denso-error"
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-denso-error font-medium pl-1">{error.message}</p>}
    </div>
  );

  return (
    <div className="p-8 md:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-denso-slate">Lengkapi Data Diri</h2>
        <p className="text-denso-slate-light text-sm mt-1">
          Informasi ini digunakan untuk keperluan pencetakan tiket dan pendataan acara.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField 
            label="Nama Lengkap" 
            icon={User} 
            placeholder="Ketik nama lengkap..." 
            error={errors.fullName} 
            {...register('fullName')} 
          />
          <InputField 
            label="NIK (Nomor Induk Karyawan)" 
            icon={Hash} 
            placeholder="Ketik NIK..." 
            error={errors.nik} 
            {...register('nik')} 
          />
          <InputField 
            label="Email Pribadi / Kantor" 
            icon={Mail} 
            type="email"
            placeholder="email@example.com" 
            error={errors.email} 
            {...register('email')} 
          />
          <InputField 
            label="Nomor WhatsApp" 
            icon={Phone} 
            placeholder="08123456789" 
            error={errors.phone} 
            {...register('phone')} 
          />
          <InputField 
            label="Divisi / Departemen" 
            icon={Briefcase} 
            placeholder="Contoh: IT, HRD, Production" 
            error={errors.division} 
            {...register('division')} 
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-denso-slate">Ukuran Kaos</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Shirt className="h-5 w-5 text-denso-gray-400" />
              </div>
              <select 
                className={cn(
                  "w-full pl-12 pr-10 py-3 bg-[#F8F9FA] border border-denso-gray-200 rounded-xl appearance-none",
                  "focus:bg-white focus:outline-none focus:ring-2 focus:ring-denso-amber/30 focus:border-denso-amber",
                  "transition-all duration-300 font-sans text-denso-slate",
                  errors.tshirtSize && "border-denso-error focus:ring-denso-error/30 focus:border-denso-error"
                )}
                {...register('tshirtSize')}
              >
                <option value="" disabled>Pilih Ukuran</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="3XL">3XL</option>
              </select>
            </div>
            {errors.tshirtSize && <p className="text-xs text-denso-error font-medium pl-1">{errors.tshirtSize.message}</p>}
          </div>
        </div>

        {/* Marital Status (Radio Cards) */}
        <div className="pt-2">
          <label className="block text-sm font-semibold text-denso-slate mb-3">Status Pernikahan</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="cursor-pointer relative">
              <input type="radio" value="Single" className="peer sr-only" {...register('maritalStatus')} />
              <div className="p-4 rounded-xl border-2 border-denso-gray-200 bg-[#F8F9FA] text-center transition-all peer-checked:border-denso-amber peer-checked:bg-denso-amber/10 hover:border-denso-amber/50">
                <p className="font-display font-bold text-denso-slate mb-1">Single</p>
                <p className="text-xs text-denso-slate-light">Datang sendiri (Tidak membawa keluarga)</p>
              </div>
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-denso-gray-300 peer-checked:border-denso-amber peer-checked:bg-denso-amber" />
            </label>
            <label className="cursor-pointer relative">
              <input type="radio" value="Family" className="peer sr-only" {...register('maritalStatus')} />
              <div className="p-4 rounded-xl border-2 border-denso-gray-200 bg-[#F8F9FA] text-center transition-all peer-checked:border-denso-navy peer-checked:bg-denso-navy/10 hover:border-denso-navy/50">
                <p className="font-display font-bold text-denso-slate mb-1">Family</p>
                <p className="text-xs text-denso-slate-light">Datang bersama pasangan / anak</p>
              </div>
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-denso-gray-300 peer-checked:border-denso-navy peer-checked:bg-denso-navy" />
            </label>
          </div>
          {errors.maritalStatus && <p className="text-xs text-denso-error font-medium pl-1 mt-2">{errors.maritalStatus.message}</p>}
        </div>

        <div className="pt-6 border-t border-denso-gray-100 flex justify-end">
          <RippleButton type="submit" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
            Lanjut
          </RippleButton>
        </div>
      </form>
    </div>
  );
}
