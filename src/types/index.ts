export type Role = 'Admin' | 'Doctor' | 'Receptionist';

export type UserStatus = 'Active' | 'Disabled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  password?: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  phone: string;
  email: string;
  status: UserStatus;
  created_at: string;
}

export interface ToothCondition {
  toothNumber: number; // 1-32
  status: 'Healthy' | 'Decayed' | 'Filled' | 'Missing' | 'Crown' | 'RootCanal' | 'Implant';
  notes?: string;
}

export interface Patient {
  id: string;
  patient_code: string; // e.g. DP-1001
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  phone: string;
  address: string;
  city: string;
  blood_group: string;
  allergies: string;
  medical_conditions: string;
  notes: string;
  teeth_conditions?: Record<number, ToothCondition>;
  created_at: string;
}

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM
  status: AppointmentStatus;
  notes: string;
  created_at: string;
  // Joined fields for display UI
  patient_name?: string;
  doctor_name?: string;
}

export type TreatmentPlanStatus = 'Active' | 'Completed' | 'Cancelled';

export interface TreatmentPlan {
  id: string;
  patient_id: string;
  doctor_id: string;
  treatment_name: string; // Braces, Aligners, Implants, Root Canal, Crowns, etc.
  description: string;
  start_date: string;
  expected_end_date: string;
  estimated_cost: number;
  status: TreatmentPlanStatus;
  created_at: string;
  // Joined fields for display UI
  patient_name?: string;
  doctor_name?: string;
}

export interface TreatmentVisit {
  id: string;
  treatment_plan_id: string;
  visit_date: string;
  procedure_done: string;
  notes: string;
  amount_charged: number;
  created_at: string;
  // Joined fields for display UI
  treatment_name?: string;
  patient_name?: string;
}

export type InvoiceStatus = 'Paid' | 'Partial' | 'Pending';

export interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  treatment_plan_id?: string;
  amount: number;
  paid_amount: number;
  due_date: string;
  description: string;
  status: InvoiceStatus;
  created_at: string;
  // Joined fields for display UI
  patient_name?: string;
  treatment_name?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';

export interface Payment {
  id: string;
  invoice_id: string;
  patient_id: string;
  amount_paid: number;
  payment_method: PaymentMethod;
  payment_date: string;
  notes?: string;
  created_at: string;
  // Joined fields
  patient_name?: string;
  invoice_number?: string;
}

export interface LedgerEntry {
  id: string;
  patient_id: string;
  date: string;
  description: string;
  debit: number; // Charge / Invoice
  credit: number; // Payment received
  balance: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalPatients: number;
  newPatientsThisMonth: number;
  todaysAppointments: number;
  activeTreatmentPlans: number;
  pendingPayments: number;
  totalRevenue: number;
}
