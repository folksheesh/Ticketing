import { useEffect, useState } from 'react';
import { QrCode, Download, Mail, MessageCircle, IceCream, Utensils, Coffee, CheckCircle2 } from 'lucide-react';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { RippleButton } from '../../../components/atoms/RippleButton';
import { cn } from '../../../lib/cn';

// Simple mock function for QR generation
const generateMockTicketId = (prefix: string) => `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

export function TicketResultStep() {
  const { personalData, familyData } = useRegistrationStore();
  const [isGenerating, setIsGenerating] = useState(true);
  
  // Tickets
  const [mainTicket, setMainTicket] = useState('');
  const [snackTicket, setSnackTicket] = useState('');
  const [lunchTicket, setLunchTicket] = useState('');
  const [iceCreamTickets, setIceCreamTickets] = useState<{name: string, id: string}[]>([]);

  useEffect(() => {
    // Simulate API call for generating tickets
    const timer = setTimeout(() => {
      setMainTicket(generateMockTicketId('REG'));
      setSnackTicket(generateMockTicketId('SNK'));
      setLunchTicket(generateMockTicketId('LNC'));

      // Evaluate kids for ice cream (e.g., age <= 12)
      if (personalData.maritalStatus === 'Family' && familyData.hasChildren) {
        const eligibleKids = familyData.children.filter(child => child.age <= 12);
        setIceCreamTickets(eligibleKids.map(kid => ({
          name: kid.name,
          id: generateMockTicketId('ICE')
        })));
      }

      setIsGenerating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [personalData, familyData]);

  if (isGenerating) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-denso-gray-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-denso-amber rounded-full border-t-transparent animate-spin" />
          <QrCode className="w-8 h-8 text-denso-amber animate-pulse" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-denso-slate mb-2">Memproses Data...</h3>
          <p className="text-sm text-denso-slate-light">Sedang membuat QR Code tiket unik untuk Anda.</p>
        </div>
      </div>
    );
  }

  const TicketCard = ({ title, id, icon: Icon, colorClass, bgClass }: any) => (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-denso-gray-200 shadow-sm flex">
      {/* Left colored accent */}
      <div className={cn("w-3", bgClass)} />
      
      <div className="p-4 flex-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bgClass, "bg-opacity-10")}>
            <Icon className={cn("w-6 h-6", colorClass)} />
          </div>
          <div>
            <p className="font-display font-bold text-denso-slate text-sm mb-0.5">{title}</p>
            <p className="font-mono text-xs font-semibold text-denso-gray-500 tracking-widest">{id}</p>
          </div>
        </div>
        
        {/* Mock QR display */}
        <div className="w-14 h-14 bg-[#F8F9FA] rounded-lg border border-denso-gray-200 flex items-center justify-center p-1">
          <QrCode className="w-full h-full text-denso-slate" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10">
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-denso-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-denso-success" />
        </div>
        <h2 className="text-2xl font-display font-bold text-denso-slate">Registrasi Berhasil!</h2>
        <p className="text-denso-slate-light text-sm mt-2 max-w-md mx-auto">
          Terima kasih {personalData.fullName}, tiket Anda telah berhasil diterbitkan. Simpan QR Code di bawah ini untuk ditunjukkan saat acara.
        </p>
      </div>

      <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-denso-gray-100 mb-8">
        <h3 className="text-sm font-semibold text-denso-gray-500 uppercase tracking-widest mb-4 border-b border-denso-gray-200 pb-2">
          Daftar E-Ticket Anda
        </h3>
        
        <div className="space-y-4">
          <TicketCard 
            title="Tiket Masuk & Souvenir" 
            id={mainTicket} 
            icon={QrCode} 
            colorClass="text-denso-navy" 
            bgClass="bg-denso-navy" 
          />
          <TicketCard 
            title="Kupon Snack Pagi" 
            id={snackTicket} 
            icon={Coffee} 
            colorClass="text-denso-amber-deep" 
            bgClass="bg-denso-amber" 
          />
          <TicketCard 
            title="Kupon Makan Siang" 
            id={lunchTicket} 
            icon={Utensils} 
            colorClass="text-orange-600" 
            bgClass="bg-orange-500" 
          />

          {iceCreamTickets.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-denso-gray-500 uppercase tracking-widest mb-3 pl-1">
                Kupon Khusus Anak
              </h4>
              <div className="space-y-3">
                {iceCreamTickets.map((ticket, index) => (
                  <TicketCard 
                    key={index}
                    title={`Es Krim - ${ticket.name}`}
                    id={ticket.id} 
                    icon={IceCream} 
                    colorClass="text-pink-600" 
                    bgClass="bg-pink-500" 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <RippleButton variant="outline" icon={<Download className="w-4 h-4" />}>
          Unduh PDF
        </RippleButton>
        <RippleButton variant="outline" icon={<Mail className="w-4 h-4" />}>
          Kirim ke Email
        </RippleButton>
        <RippleButton variant="primary" icon={<MessageCircle className="w-4 h-4" />}>
          Kirim via WA
        </RippleButton>
      </div>

    </div>
  );
}
