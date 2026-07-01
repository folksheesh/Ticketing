// Admin types
export type TicketStatus = 'active' | 'used' | 'expired';
export type TicketType = 'entry' | 'snack' | 'lunch' | 'icecream';

export interface Ticket {
  id: string;
  type: TicketType;
  label: string;
  status: TicketStatus;
  scannedAt?: string;
  scannedBy?: string;
}

export interface FamilyMember {
  name: string;
  relation: 'spouse' | 'child';
  age?: number;
  tshirtSize?: string;
}

export interface Employee {
  id: string;
  fullName: string;
  nik: string;
  division: string;
  email: string;
  phone: string;
  tshirtSize: string;
  maritalStatus: 'Single' | 'Family';
  registeredAt: string;
  family: FamilyMember[];
  tickets: Ticket[];
  checkedIn: boolean;
}
