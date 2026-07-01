export type RegistrationStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed';
export type TicketType = 'registration' | 'lunch' | 'souvenir';
export type TicketStatus = 'active' | 'used' | 'expired' | 'revoked';
export type ScanResult = 'success' | 'duplicate' | 'invalid' | 'expired';
export type FamilyRelationship = 'spouse' | 'child';
export type AgeCategory = 'baby' | 'kid' | 'teen' | 'adult' | 'senior';
export type UserRole = 'superadmin' | 'admin' | 'staff' | 'participant';

export interface Employee {
  id: number;
  employeeId: string;
  fullName: string;
  division: string;
  email: string;
  phone: string;
}

export interface Registration {
  id: number;
  employeeId: number;
  registrationToken: string;
  hasFamily: boolean;
  status: RegistrationStatus;
  registeredAt: string;
  confirmedAt: string | null;
  employee?: Employee;
  familyMembers?: FamilyMember[];
  tickets?: Ticket[];
}

export interface FamilyMember {
  id: number;
  registrationId: number;
  fullName: string;
  relationship: FamilyRelationship;
  dateOfBirth: string | null;
  ageCategory: AgeCategory;
}

export interface Ticket {
  id: number;
  registrationId: number;
  type: TicketType;
  token: string;
  qrData: string;
  status: TicketStatus;
  usedAt: string | null;
}

export interface Scan {
  id: number;
  ticketId: number;
  scannedBy: number;
  scanType: TicketType;
  result: ScanResult;
  deviceInfo: string | null;
  ipAddress: string | null;
  scannedAt: string;
  syncedAt: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  employeeId: number | null;
}

export interface AuditLog {
  id: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: number | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}
