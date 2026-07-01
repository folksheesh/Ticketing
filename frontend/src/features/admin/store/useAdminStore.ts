import { create } from 'zustand';
import type { Employee, Ticket, TicketStatus } from '../types';

// ── Seed mock data ────────────────────────────────────────────────────────────
const makeTickets = (prefix: string, withIcecream = false): Ticket[] => {
  const base: Ticket[] = [
    { id: `REG-${prefix}1`, type: 'entry',    label: 'Tiket Masuk & Souvenir', status: 'active' },
    { id: `SNK-${prefix}2`, type: 'snack',    label: 'Kupon Snack Pagi',        status: 'active' },
    { id: `LNC-${prefix}3`, type: 'lunch',    label: 'Kupon Makan Siang',       status: 'active' },
  ];
  if (withIcecream)
    base.push({ id: `ICE-${prefix}4`, type: 'icecream', label: 'Kupon Es Krim', status: 'active' });
  return base;
};

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001', fullName: 'Muhammad Zein', nik: '123456', division: 'Engineering',
    email: 'zein@denso.com', phone: '08123456789', tshirtSize: 'L',
    maritalStatus: 'Family', registeredAt: '2025-07-01T08:00:00Z', checkedIn: false,
    family: [
      { name: 'Siti Zein', relation: 'spouse', tshirtSize: 'M' },
      { name: 'Robert Zein', relation: 'child', age: 8, tshirtSize: 'S' },
    ],
    tickets: makeTickets('100', true),
  },
  {
    id: 'EMP-002', fullName: 'Andi Pratama', nik: '234567', division: 'HR',
    email: 'andi@denso.com', phone: '08234567890', tshirtSize: 'M',
    maritalStatus: 'Single', registeredAt: '2025-07-01T09:15:00Z', checkedIn: true,
    family: [],
    tickets: makeTickets('200'),
  },
  {
    id: 'EMP-003', fullName: 'Sari Dewi', nik: '345678', division: 'Finance',
    email: 'sari@denso.com', phone: '08345678901', tshirtSize: 'S',
    maritalStatus: 'Family', registeredAt: '2025-07-01T10:00:00Z', checkedIn: false,
    family: [
      { name: 'Budi Santoso', relation: 'spouse', tshirtSize: 'XL' },
      { name: 'Cinta Dewi', relation: 'child', age: 5, tshirtSize: 'S' },
      { name: 'Dito Dewi', relation: 'child', age: 10, tshirtSize: 'M' },
    ],
    tickets: makeTickets('300', true),
  },
  {
    id: 'EMP-004', fullName: 'Reza Firmansyah', nik: '456789', division: 'Production',
    email: 'reza@denso.com', phone: '08456789012', tshirtSize: 'XL',
    maritalStatus: 'Family', registeredAt: '2025-07-01T11:30:00Z', checkedIn: false,
    family: [{ name: 'Lisa Firmansyah', relation: 'spouse', tshirtSize: 'M' }],
    tickets: makeTickets('400'),
  },
  {
    id: 'EMP-005', fullName: 'Nina Kusuma', nik: '567890', division: 'Marketing',
    email: 'nina@denso.com', phone: '08567890123', tshirtSize: 'M',
    maritalStatus: 'Single', registeredAt: '2025-07-01T12:00:00Z', checkedIn: true,
    family: [],
    tickets: makeTickets('500'),
  },
];

// Mark EMP-002 entry as used (already checked in)
MOCK_EMPLOYEES[1].tickets[0].status = 'used';
MOCK_EMPLOYEES[1].tickets[0].scannedAt = '2025-07-01T13:00:00Z';
MOCK_EMPLOYEES[1].tickets[0].scannedBy = 'Admin';

interface AdminStore {
  employees: Employee[];
  scanResult: { ticket: Ticket; employee: Employee } | null;
  scanError: string | null;

  // Actions
  scanTicket: (ticketId: string) => void;
  updateTicketStatus: (employeeId: string, ticketId: string, status: TicketStatus) => void;
  clearScan: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  employees: MOCK_EMPLOYEES,
  scanResult: null,
  scanError: null,

  scanTicket: (ticketId: string) => {
    const { employees } = get();
    for (const emp of employees) {
      const ticket = emp.tickets.find(t => t.id === ticketId);
      if (ticket) {
        set({ scanResult: { ticket, employee: emp }, scanError: null });
        return;
      }
    }
    set({ scanResult: null, scanError: `Tiket "${ticketId}" tidak ditemukan.` });
  },

  updateTicketStatus: (employeeId, ticketId, status) => {
    set(state => ({
      employees: state.employees.map(emp => {
        if (emp.id !== employeeId) return emp;
        const updatedTickets = emp.tickets.map(t =>
          t.id === ticketId
            ? { ...t, status, scannedAt: new Date().toISOString(), scannedBy: 'Admin' }
            : t
        );
        const allEntryUsed = updatedTickets.find(t => t.type === 'entry')?.status === 'used';
        return { ...emp, tickets: updatedTickets, checkedIn: allEntryUsed || emp.checkedIn };
      }),
      scanResult: state.scanResult
        ? {
            ...state.scanResult,
            ticket: { ...state.scanResult.ticket, status, scannedAt: new Date().toISOString() },
          }
        : null,
    }));
  },

  clearScan: () => set({ scanResult: null, scanError: null }),
}));
