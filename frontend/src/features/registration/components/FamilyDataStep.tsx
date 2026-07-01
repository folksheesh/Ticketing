import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Users, Plus, Trash2, ArrowRight, ArrowLeft, Download } from 'lucide-react';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { RippleButton } from '../../../components/atoms/RippleButton';
import { cn } from '../../../lib/cn';

const familyDataSchema = z.object({
  hasSpouse: z.boolean(),
  spouseName: z.string().optional(),
  spouseTshirtSize: z.enum(['S','M','L','XL','XXL','3XL']).optional(),
  hasChildren: z.boolean(),
  children: z.array(z.object({
    id: z.string(),
    name: z.string().min(2, "Nama anak harus diisi"),
    age: z.coerce.number().min(0, "Umur tidak valid").max(50, "Umur tidak valid"),
    tshirtSize: z.enum(['S','M','L','XL','XXL','3XL'], { errorMap: () => ({ message: "Pilih ukuran baju" }) }).optional(),
  })),
}).superRefine((data, ctx) => {
  if (data.hasSpouse && (!data.spouseName || data.spouseName.length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nama pasangan harus diisi",
      path: ["spouseName"]
    });
  }
});

type FamilyDataForm = z.infer<typeof familyDataSchema>;

export function FamilyDataStep() {
  const { familyData, setFamilyData, nextStep, prevStep } = useRegistrationStore();
  
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FamilyDataForm>({
    resolver: zodResolver(familyDataSchema),
    defaultValues: {
      hasSpouse: familyData.hasSpouse,
      spouseName: familyData.spouseName,
      spouseTshirtSize: (familyData.spouseTshirtSize as any) || undefined,
      hasChildren: familyData.hasChildren,
      children: familyData.children,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children"
  });

  const watchHasSpouse = watch('hasSpouse');
  const watchHasChildren = watch('hasChildren');

  const onSubmit = (data: FamilyDataForm) => {
    const cleanData = {
      ...data,
      spouseName: data.hasSpouse ? data.spouseName : '',
      spouseTshirtSize: data.hasSpouse ? data.spouseTshirtSize : undefined,
      children: data.hasChildren ? data.children : []
    };
    
    setFamilyData(cleanData);
    nextStep();
  };

  return (
    <div className="p-8 md:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-denso-slate">Data Keluarga</h2>
        <p className="text-denso-slate-light text-sm mt-1">
          Daftarkan anggota keluarga inti Anda yang akan hadir.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Spouse Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl border border-denso-gray-100">
            <div>
              <p className="font-semibold text-denso-slate">Membawa Pasangan?</p>
              <p className="text-xs text-denso-slate-light">Istri / Suami</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register('hasSpouse')} />
              <div className="w-11 h-6 bg-denso-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-denso-navy"></div>
            </label>
          </div>

          {watchHasSpouse && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 pl-2">
              {/* Spouse Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-denso-slate">Nama Pasangan</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-denso-gray-400" />
                  </div>
                  <input 
                    className={cn(
                      "w-full pl-12 pr-4 py-3 bg-white border border-denso-gray-200 rounded-xl",
                      "focus:outline-none focus:ring-2 focus:ring-denso-amber/30 focus:border-denso-amber",
                      "transition-all duration-300 font-sans text-denso-slate placeholder:text-denso-gray-400",
                      errors.spouseName && "border-denso-error focus:ring-denso-error/30 focus:border-denso-error"
                    )}
                    placeholder="Ketik nama pasangan..."
                    {...register('spouseName')}
                  />
                </div>
                {errors.spouseName && <p className="text-xs text-denso-error font-medium pl-1">{errors.spouseName.message}</p>}
              </div>

              {/* Spouse T-Shirt Size */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-denso-slate">Ukuran Baju Pasangan</label>
                <select
                  className={cn(
                    "w-full md:w-48 px-4 py-3 bg-white border border-denso-gray-200 rounded-xl",
                    "focus:outline-none focus:ring-2 focus:ring-denso-amber/30 focus:border-denso-amber",
                    "transition-all duration-300 font-sans text-denso-slate"
                  )}
                  {...register('spouseTshirtSize')}
                >
                  <option value="">Pilih Ukuran</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="3XL">3XL</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-denso-gray-100" />

        {/* Children Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl border border-denso-gray-100">
            <div>
              <p className="font-semibold text-denso-slate">Membawa Anak?</p>
              <p className="text-xs text-denso-slate-light">Anak yang terdaftar akan diverifikasi untuk mendapat tiket khusus.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register('hasChildren')} />
              <div className="w-11 h-6 bg-denso-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-denso-amber"></div>
            </label>
          </div>

          {watchHasChildren && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 pl-2">
              {fields.map((field, index) => (
                <div key={field.id} className="relative p-5 bg-white border border-denso-gray-200 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center">
                  {/* Child Name */}
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="block text-xs font-semibold text-denso-slate">Nama Anak {index + 1}</label>
                    <input 
                      className={cn(
                        "w-full px-4 py-2.5 bg-[#F8F9FA] border border-denso-gray-200 rounded-xl text-sm",
                        "focus:bg-white focus:outline-none focus:ring-2 focus:ring-denso-amber/30 focus:border-denso-amber",
                        errors.children?.[index]?.name && "border-denso-error"
                      )}
                      placeholder="Nama anak"
                      {...register(`children.${index}.name` as const)}
                    />
                    {errors.children?.[index]?.name && <p className="text-[10px] text-denso-error">{errors.children[index]?.name?.message}</p>}
                  </div>
                  
                  {/* Child Age */}
                  <div className="w-full md:w-24 space-y-1.5">
                    <label className="block text-xs font-semibold text-denso-slate">Umur (Thn)</label>
                    <input 
                      type="number"
                      className={cn(
                        "w-full px-4 py-2.5 bg-[#F8F9FA] border border-denso-gray-200 rounded-xl text-sm",
                        "focus:bg-white focus:outline-none focus:ring-2 focus:ring-denso-amber/30 focus:border-denso-amber",
                        errors.children?.[index]?.age && "border-denso-error"
                      )}
                      placeholder="0"
                      {...register(`children.${index}.age` as const)}
                    />
                    {errors.children?.[index]?.age && <p className="text-[10px] text-denso-error">{errors.children[index]?.age?.message}</p>}
                  </div>

                  {/* Child T-Shirt Size */}
                  <div className="w-full md:w-32 space-y-1.5">
                    <label className="block text-xs font-semibold text-denso-slate">Ukuran Baju</label>
                    <select
                      className={cn(
                        "w-full px-4 py-2.5 bg-[#F8F9FA] border border-denso-gray-200 rounded-xl text-sm",
                        "focus:bg-white focus:outline-none focus:ring-2 focus:ring-denso-amber/30 focus:border-denso-amber",
                        errors.children?.[index]?.tshirtSize && "border-denso-error"
                      )}
                      {...register(`children.${index}.tshirtSize` as const)}
                    >
                      <option value="" disabled>Pilih Ukuran</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="3XL">3XL</option>
                    </select>
                    {errors.children?.[index]?.tshirtSize && <p className="text-[10px] text-denso-error">{errors.children[index]?.tshirtSize?.message}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 md:static md:mt-6 p-2.5 text-denso-gray-400 hover:text-denso-error hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  {/* Hidden ID field */}
                  <input type="hidden" {...register(`children.${index}.id` as const)} value={field.id} />
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ id: crypto.randomUUID(), name: '', age: 0, tshirtSize: 'S' })}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-denso-gray-300 rounded-2xl text-denso-slate-light font-semibold hover:border-denso-amber hover:text-denso-amber hover:bg-denso-amber/5 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Tambah Anak
              </button>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-denso-gray-100 flex justify-between items-center">
          <RippleButton 
            type="button" 
            variant="ghost" 
            onClick={prevStep}
            icon={<ArrowLeft className="w-5 h-5" />} 
          >
            Kembali
          </RippleButton>
          
          <div className="flex gap-4">
            <RippleButton variant="outline" icon={<Download className="w-4 h-4" />} onClick={() => window.print()}>
              Unduh PDF
            </RippleButton>
            <RippleButton type="submit" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
              Generate Ticket
            </RippleButton>
          </div>
        </div>
      </form>
    </div>
  );
}
