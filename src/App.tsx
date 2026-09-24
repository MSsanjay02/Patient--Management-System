import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { LoginView } from './components/auth/LoginView';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PatientManagement } from './components/patients/PatientManagement';
import { AppointmentManagement } from './components/appointments/AppointmentManagement';
import { TreatmentPlanManagement } from './components/treatments/TreatmentPlanManagement';
import { BillingManagement } from './components/billing/BillingManagement';
import { DoctorManagement } from './components/doctors/DoctorManagement';
import { UserManagement } from './components/users/UserManagement';
import { ReportsView } from './components/reports/ReportsView';
import type { Patient } from './types';

const MainApp: React.FC = () => {
  const { currentUser } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [preselectedPatient, setPreselectedPatient] = useState<Patient | null>(null);

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const handleNavigateWithPatient = (tab: string, patient?: Patient) => {
    if (patient) setPreselectedPatient(patient);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar onLogout={() => setIsAuthenticated(false)} activeTab={activeTab} />

      {/* Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}

          {activeTab === 'patients' && (
            <PatientManagement
              onBookAppointment={(pat) => handleNavigateWithPatient('appointments', pat)}
              onCreateTreatmentPlan={(pat) => handleNavigateWithPatient('treatments', pat)}
              onCreateInvoice={(pat) => handleNavigateWithPatient('billing', pat)}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentManagement preselectedPatient={preselectedPatient} />
          )}

          {activeTab === 'treatments' && (
            <TreatmentPlanManagement preselectedPatient={preselectedPatient} />
          )}

          {activeTab === 'billing' && (
            <BillingManagement preselectedPatient={preselectedPatient} />
          )}

          {activeTab === 'doctors' && currentUser.role === 'Admin' && <DoctorManagement />}

          {activeTab === 'users' && currentUser.role === 'Admin' && <UserManagement />}

          {activeTab === 'reports' && currentUser.role === 'Admin' && <ReportsView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}
