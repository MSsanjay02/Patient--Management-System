import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  Doctor,
  Patient,
  Appointment,
  TreatmentPlan,
  TreatmentVisit,
  Invoice,
  Payment,
  LedgerEntry,
  DashboardMetrics,
  ToothCondition,
} from '../types';
import {
  initialUsers,
  initialDoctors,
  initialPatients,
  initialAppointments,
  initialTreatmentPlans,
  initialTreatmentVisits,
  initialInvoices,
  initialPayments,
} from '../lib/mockData';

interface DataContextType {
  // Current logged in user & role preview switcher
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'created_at'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;

  // Doctors
  doctors: Doctor[];
  addDoctor: (doc: Omit<Doctor, 'id' | 'created_at'>) => void;
  updateDoctor: (id: string, doc: Partial<Doctor>) => void;

  // Patients
  patients: Patient[];
  addPatient: (pat: Omit<Patient, 'id' | 'patient_code' | 'created_at'>) => Patient;
  updatePatient: (id: string, pat: Partial<Patient>) => void;
  updatePatientTooth: (patientId: string, toothNumber: number, condition: ToothCondition) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'created_at'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  // Treatment Plans
  treatmentPlans: TreatmentPlan[];
  addTreatmentPlan: (tp: Omit<TreatmentPlan, 'id' | 'created_at'>) => void;
  updateTreatmentPlanStatus: (id: string, status: TreatmentPlan['status']) => void;

  // Visits
  treatmentVisits: TreatmentVisit[];
  addTreatmentVisit: (visit: Omit<TreatmentVisit, 'id' | 'created_at'>) => void;

  // Invoices & Payments
  invoices: Invoice[];
  addInvoice: (inv: Omit<Invoice, 'id' | 'invoice_number' | 'paid_amount' | 'status' | 'created_at'>) => void;
  payments: Payment[];
  addPayment: (pay: Omit<Payment, 'id' | 'created_at'>) => void;

  // Helper selectors
  getPatientLedger: (patientId: string) => LedgerEntry[];
  getMetrics: () => DashboardMetrics;
  exportDataToCSV: (type: 'patients' | 'appointments' | 'revenue') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('dpms_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => users[0] || initialUsers[0]);

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('dpms_doctors');
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('dpms_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('dpms_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(() => {
    const saved = localStorage.getItem('dpms_treatment_plans');
    return saved ? JSON.parse(saved) : initialTreatmentPlans;
  });

  const [treatmentVisits, setTreatmentVisits] = useState<TreatmentVisit[]>(() => {
    const saved = localStorage.getItem('dpms_treatment_visits');
    return saved ? JSON.parse(saved) : initialTreatmentVisits;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('dpms_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('dpms_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('dpms_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('dpms_doctors', JSON.stringify(doctors));
  }, [doctors]);
  useEffect(() => {
    localStorage.setItem('dpms_patients', JSON.stringify(patients));
  }, [patients]);
  useEffect(() => {
    localStorage.setItem('dpms_appointments', JSON.stringify(appointments));
  }, [appointments]);
  useEffect(() => {
    localStorage.setItem('dpms_treatment_plans', JSON.stringify(treatmentPlans));
  }, [treatmentPlans]);
  useEffect(() => {
    localStorage.setItem('dpms_treatment_visits', JSON.stringify(treatmentVisits));
  }, [treatmentVisits]);
  useEffect(() => {
    localStorage.setItem('dpms_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('dpms_payments', JSON.stringify(payments));
  }, [payments]);

  // Actions
  const addUser = (newUser: Omit<User, 'id' | 'created_at'>) => {
    const user: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, user]);
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
  };

  const addDoctor = (newDoc: Omit<Doctor, 'id' | 'created_at'>) => {
    const doc: Doctor = {
      ...newDoc,
      id: `doc-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setDoctors((prev) => [...prev, doc]);
  };

  const updateDoctor = (id: string, updated: Partial<Doctor>) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
  };

  const addPatient = (newPat: Omit<Patient, 'id' | 'patient_code' | 'created_at'>): Patient => {
    const nextNum = patients.length + 1001;
    const code = `DP-${nextNum}`;
    const patient: Patient = {
      ...newPat,
      id: `pat-${Date.now()}`,
      patient_code: code,
      teeth_conditions: newPat.teeth_conditions || {},
      created_at: new Date().toISOString(),
    };
    setPatients((prev) => [patient, ...prev]);
    return patient;
  };

  const updatePatient = (id: string, updated: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const updatePatientTooth = (patientId: string, toothNumber: number, condition: ToothCondition) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const currentTeeth = { ...(p.teeth_conditions || {}) };
        currentTeeth[toothNumber] = condition;
        return { ...p, teeth_conditions: currentTeeth };
      })
    );
  };

  const addAppointment = (newApt: Omit<Appointment, 'id' | 'created_at'>) => {
    const apt: Appointment = {
      ...newApt,
      id: `apt-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setAppointments((prev) => [apt, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const addTreatmentPlan = (newTp: Omit<TreatmentPlan, 'id' | 'created_at'>) => {
    const tp: TreatmentPlan = {
      ...newTp,
      id: `tp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setTreatmentPlans((prev) => [tp, ...prev]);
  };

  const updateTreatmentPlanStatus = (id: string, status: TreatmentPlan['status']) => {
    setTreatmentPlans((prev) => prev.map((tp) => (tp.id === id ? { ...tp, status } : tp)));
  };

  const addTreatmentVisit = (newVisit: Omit<TreatmentVisit, 'id' | 'created_at'>) => {
    const visit: TreatmentVisit = {
      ...newVisit,
      id: `vis-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setTreatmentVisits((prev) => [visit, ...prev]);
  };

  const addInvoice = (newInv: Omit<Invoice, 'id' | 'invoice_number' | 'paid_amount' | 'status' | 'created_at'>) => {
    const count = invoices.length + 1;
    const invNum = `INV-2026-${String(count).padStart(3, '0')}`;
    const inv: Invoice = {
      ...newInv,
      id: `inv-${Date.now()}`,
      invoice_number: invNum,
      paid_amount: 0,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };
    setInvoices((prev) => [inv, ...prev]);
  };

  const addPayment = (newPay: Omit<Payment, 'id' | 'created_at'>) => {
    const pay: Payment = {
      ...newPay,
      id: `pay-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setPayments((prev) => [pay, ...prev]);

    // Recalculate invoice status & paid_amount
    setInvoices((prevInvoices) =>
      prevInvoices.map((inv) => {
        if (inv.id === newPay.invoice_id) {
          const totalPaid = inv.paid_amount + newPay.amount_paid;
          let status: Invoice['status'] = 'Pending';
          if (totalPaid >= inv.amount) {
            status = 'Paid';
          } else if (totalPaid > 0) {
            status = 'Partial';
          }
          return { ...inv, paid_amount: totalPaid, status };
        }
        return inv;
      })
    );
  };

  const getPatientLedger = (patientId: string): LedgerEntry[] => {
    const patInvoices = invoices.filter((inv) => inv.patient_id === patientId);
    const patPayments = payments.filter((pay) => pay.patient_id === patientId);

    const items: Array<{ date: string; description: string; debit: number; credit: number }> = [];

    patInvoices.forEach((inv) => {
      items.push({
        date: inv.created_at.slice(0, 10),
        description: `Invoice ${inv.invoice_number}: ${inv.description}`,
        debit: inv.amount,
        credit: 0,
      });
    });

    patPayments.forEach((pay) => {
      const inv = invoices.find((i) => i.id === pay.invoice_id);
      items.push({
        date: pay.payment_date,
        description: `Payment (${pay.payment_method}) for ${inv ? inv.invoice_number : 'Bill'}`,
        debit: 0,
        credit: pay.amount_paid,
      });
    });

    // Sort by date ascending
    items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    return items.map((item, idx) => {
      runningBalance += item.debit - item.credit;
      return {
        id: `led-${idx}`,
        patient_id: patientId,
        date: item.date,
        description: item.description,
        debit: item.debit,
        credit: item.credit,
        balance: runningBalance,
      };
    });
  };

  const getMetrics = (): DashboardMetrics => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const currentMonth = new Date().toISOString().slice(0, 7);

    const totalPatients = patients.length;
    const newPatientsThisMonth = patients.filter((p) => p.created_at.startsWith(currentMonth)).length;
    const todaysAppointments = appointments.filter((a) => a.appointment_date === todayStr).length;
    const activeTreatmentPlans = treatmentPlans.filter((tp) => tp.status === 'Active').length;

    const pendingPayments = invoices.reduce((sum, inv) => sum + (inv.amount - inv.paid_amount), 0);
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount_paid, 0);

    return {
      totalPatients,
      newPatientsThisMonth,
      todaysAppointments,
      activeTreatmentPlans,
      pendingPayments,
      totalRevenue,
    };
  };

  const exportDataToCSV = (type: 'patients' | 'appointments' | 'revenue') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `${type}_report_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'patients') {
      headers = ['Patient Code', 'Full Name', 'Age', 'Gender', 'Phone', 'City', 'Blood Group', 'Allergies', 'Medical Conditions', 'Registration Date'];
      rows = patients.map((p) => [
        p.patient_code,
        `"${p.name}"`,
        String(p.age),
        p.gender,
        p.phone,
        `"${p.city}"`,
        p.blood_group,
        `"${p.allergies || 'None'}"`,
        `"${p.medical_conditions || 'None'}"`,
        p.created_at.slice(0, 10),
      ]);
    } else if (type === 'appointments') {
      headers = ['Appointment ID', 'Patient Name', 'Doctor Name', 'Date', 'Time', 'Status', 'Notes'];
      rows = appointments.map((a) => {
        const pat = patients.find((p) => p.id === a.patient_id);
        const doc = doctors.find((d) => d.id === a.doctor_id);
        return [
          a.id,
          `"${pat?.name || 'Unknown'}"`,
          `"${doc?.name || 'Unknown'}"`,
          a.appointment_date,
          a.appointment_time,
          a.status,
          `"${a.notes || ''}"`,
        ];
      });
    } else if (type === 'revenue') {
      headers = ['Payment ID', 'Patient Name', 'Invoice Number', 'Payment Method', 'Amount Paid', 'Date', 'Notes'];
      rows = payments.map((p) => {
        const pat = patients.find((pt) => pt.id === p.patient_id);
        const inv = invoices.find((i) => i.id === p.invoice_id);
        return [
          p.id,
          `"${pat?.name || 'Unknown'}"`,
          inv?.invoice_number || 'N/A',
          p.payment_method,
          String(p.amount_paid),
          p.payment_date,
          `"${p.notes || ''}"`,
        ];
      });
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        updateUser,
        doctors,
        addDoctor,
        updateDoctor,
        patients,
        addPatient,
        updatePatient,
        updatePatientTooth,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        treatmentPlans,
        addTreatmentPlan,
        updateTreatmentPlanStatus,
        treatmentVisits,
        addTreatmentVisit,
        invoices,
        addInvoice,
        payments,
        addPayment,
        getPatientLedger,
        getMetrics,
        exportDataToCSV,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
