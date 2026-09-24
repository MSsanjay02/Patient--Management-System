import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import type { Invoice, PaymentMethod, Patient, InvoiceStatus } from '../../types';
import {
  Receipt,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface BillingManagementProps {
  preselectedPatient?: Patient | null;
}

export const BillingManagement: React.FC<BillingManagementProps> = ({ preselectedPatient }) => {
  const {
    invoices,
    payments,
    patients,
    treatmentPlans,
    addInvoice,
    addPayment,
    getPatientLedger,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'payments' | 'ledger'>('invoices');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    preselectedPatient?.id || (patients[0]?.id || '')
  );

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [printableInvoice, setPrintableInvoice] = useState<Invoice | null>(null);

  // Invoice Form state
  const [invPatientId, setInvPatientId] = useState(preselectedPatient?.id || (patients[0]?.id || ''));
  const [invTreatmentPlanId, setInvTreatmentPlanId] = useState('');
  const [invAmount, setInvAmount] = useState<number | ''>(8000);
  const [invDescription, setInvDescription] = useState('Root Canal & Crown Consultation');
  const [invDueDate, setInvDueDate] = useState(new Date().toISOString().slice(0, 10));

  // Payment Form state
  const [payAmount, setPayAmount] = useState<number | ''>(5000);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('UPI');
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
  const [payNotes, setPayNotes] = useState('');

  const openInvoiceModal = () => {
    if (patients.length > 0 && !invPatientId) setInvPatientId(patients[0].id);
    setShowInvoiceModal(true);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invPatientId || !invAmount || !invDescription) return;

    addInvoice({
      patient_id: invPatientId,
      treatment_plan_id: invTreatmentPlanId || undefined,
      amount: Number(invAmount),
      due_date: invDueDate,
      description: invDescription,
    });

    setShowInvoiceModal(false);
  };

  const openPaymentModal = (invoice: Invoice) => {
    setSelectedInvoiceForPayment(invoice);
    const remaining = invoice.amount - invoice.paid_amount;
    setPayAmount(remaining > 0 ? remaining : invoice.amount);
    setShowPaymentModal(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment || !payAmount) return;

    addPayment({
      invoice_id: selectedInvoiceForPayment.id,
      patient_id: selectedInvoiceForPayment.patient_id,
      amount_paid: Number(payAmount),
      payment_method: payMethod,
      payment_date: payDate,
      notes: payNotes,
    });

    setShowPaymentModal(false);
  };

  // Metrics calculation
  const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.amount_paid, 0);
  const totalPending = totalBilled - totalCollected;

  const currentPatientLedger = selectedPatientId ? getPatientLedger(selectedPatientId) : [];

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Partial':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Pending':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-cyan-400" />
            <span>NM Clinic Invoicing & Patient Ledger</span>
          </h2>
          <p className="text-xs text-slate-400">Generate tax invoices, record payments (UPI/Cash/Card), and view patient ledgers</p>
        </div>

        <button
          onClick={openInvoiceModal}
          className="nm-gradient-bg text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Financial Overview Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Revenue Billed</div>
            <div className="text-2xl font-extrabold text-white mt-1">₹{totalBilled.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Payments Collected</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">₹{totalCollected.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Outstanding Balance</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">₹{totalPending.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/70 rounded-2xl px-4 py-2 space-x-2">
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'invoices' ? 'nm-gradient-bg text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Invoices Directory ({invoices.length})
        </button>
        <button
          onClick={() => setActiveSubTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'payments' ? 'nm-gradient-bg text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Payment Entries ({payments.length})
        </button>
        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'ledger' ? 'nm-gradient-bg text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Patient Ledger Statement
        </button>
      </div>

      {/* Subtab 1: Invoices */}
      {activeSubTab === 'invoices' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5 text-right">Total Amount</th>
                  <th className="px-5 py-3.5 text-right">Paid Amount</th>
                  <th className="px-5 py-3.5 text-right">Pending Balance</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map((inv) => {
                  const pat = patients.find((p) => p.id === inv.patient_id);
                  const pending = inv.amount - inv.paid_amount;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-cyan-400">{inv.invoice_number}</td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {pat?.name || 'Patient'} <span className="text-[10px] text-slate-400">({pat?.patient_code})</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">{inv.description}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-white">
                        ₹{inv.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-right text-emerald-400 font-medium">
                        ₹{inv.paid_amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-right text-amber-400 font-medium">
                        ₹{pending.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1">
                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => openPaymentModal(inv)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold"
                          >
                            + Record Payment
                          </button>
                        )}
                        <button
                          onClick={() => setPrintableInvoice(inv)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Payment Entries */}
      {activeSubTab === 'payments' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Payment Date</th>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Invoice Ref</th>
                  <th className="px-5 py-3.5">Payment Method</th>
                  <th className="px-5 py-3.5 text-right">Amount Paid</th>
                  <th className="px-5 py-3.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => {
                  const pat = patients.find((pt) => pt.id === p.patient_id);
                  const inv = invoices.find((i) => i.id === p.invoice_id);

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 text-slate-400 font-medium">{p.payment_date}</td>
                      <td className="px-5 py-3.5 font-semibold text-white">{pat?.name || 'Patient'}</td>
                      <td className="px-5 py-3.5 text-cyan-400 font-bold">{inv?.invoice_number || 'N/A'}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 text-[10px] font-bold">
                          {p.payment_method}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-emerald-400">
                        ₹{p.amount_paid.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{p.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Ledger View */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-400 font-semibold">Select Patient Ledger:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-semibold"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patient_code})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-400">
              Outstanding Balance for Patient:{' '}
              <span className="font-bold text-amber-400 text-sm">
                ₹{(currentPatientLedger.length > 0 ? currentPatientLedger[currentPatientLedger.length - 1].balance : 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Transaction Description</th>
                  <th className="px-5 py-3.5 text-right text-red-400">Debit (Invoice Charge)</th>
                  <th className="px-5 py-3.5 text-right text-emerald-400">Credit (Payment Received)</th>
                  <th className="px-5 py-3.5 text-right text-cyan-400">Cumulative Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {currentPatientLedger.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      No ledger transactions found for this patient.
                    </td>
                  </tr>
                ) : (
                  currentPatientLedger.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 text-slate-400 font-medium">{l.date}</td>
                      <td className="px-5 py-3.5 text-white font-medium">{l.description}</td>
                      <td className="px-5 py-3.5 text-right font-medium text-red-400">
                        {l.debit > 0 ? `₹${l.debit.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-emerald-400">
                        {l.credit > 0 ? `₹${l.credit.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-cyan-400">
                        ₹{l.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Generate NM Clinic Invoice</h3>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Patient *</label>
                <select
                  value={invPatientId}
                  onChange={(e) => setInvPatientId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patient_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Link Treatment Plan (Optional)</label>
                <select
                  value={invTreatmentPlanId}
                  onChange={(e) => setInvTreatmentPlanId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- General Consultation / No Specific Plan --</option>
                  {treatmentPlans
                    .filter((tp) => tp.patient_id === invPatientId)
                    .map((tp) => (
                      <option key={tp.id} value={tp.id}>
                        {tp.treatment_name} (Est: ₹{tp.estimated_cost})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Invoice Description *</label>
                <input
                  type="text"
                  value={invDescription}
                  onChange={(e) => setInvDescription(e.target.value)}
                  placeholder="e.g. Tooth Extraction & Medication"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Amount (₹) *</label>
                  <input
                    type="number"
                    value={invAmount}
                    onChange={(e) => setInvAmount(Number(e.target.value))}
                    placeholder="5000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 nm-gradient-bg text-white py-2.5 rounded-xl font-semibold shadow-md"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Record Patient Payment</h3>
            <p className="text-xs text-cyan-400 font-medium">
              Invoice #{selectedInvoiceForPayment.invoice_number} (Pending: ₹
              {(selectedInvoiceForPayment.amount - selectedInvoiceForPayment.paid_amount).toLocaleString()})
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Amount Paid (₹) *</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Payment Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Payment Date</label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Payment Reference / Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Transaction ID / Receipt number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 nm-gradient-bg text-white py-2.5 rounded-xl font-semibold shadow-md"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formally Branded NM Clinic Printable Invoice Modal */}
      {printableInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl p-8 w-full max-w-2xl shadow-2xl space-y-6 printable-area">
            <div className="flex justify-between items-start border-b-2 border-cyan-800 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black text-cyan-900 tracking-tight">NM CLINIC</span>
                  <span className="text-xs bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded">DENTAL HOSPITAL</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">NM Dental Speciality Hospital & Laser Implant Center</p>
                <p className="text-xs text-slate-500">NM Clinic Tower, 100 Feet Road, Indiranagar, Bengaluru</p>
                <p className="text-[11px] text-slate-500">Reg No: NM-DENT-2026 • Ph: +91 80 4567 8900</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">OFFICIAL TAX INVOICE</span>
                <span className="text-xl font-bold text-cyan-700">{printableInvoice.invoice_number}</span>
                <span className="text-xs text-slate-500 block">Date: {printableInvoice.created_at.slice(0, 10)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 block uppercase">Billed Patient:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {patients.find((p) => p.id === printableInvoice.patient_id)?.name}
                </span>
                <span className="block text-slate-600">
                  Patient Code: {patients.find((p) => p.id === printableInvoice.patient_id)?.patient_code}
                </span>
                <span className="block text-slate-600">
                  Phone: {patients.find((p) => p.id === printableInvoice.patient_id)?.phone}
                </span>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-500 block uppercase">Payment Status:</span>
                <span className="inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs uppercase">
                  {printableInvoice.status}
                </span>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b-2 border-slate-300">
                  <th className="py-2.5 px-3 font-bold">Treatment / Procedure Description</th>
                  <th className="py-2.5 px-3 text-right font-bold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3.5 px-3 font-semibold text-slate-800">{printableInvoice.description}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">₹{printableInvoice.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end pt-2 text-xs">
              <div className="w-56 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold">₹{printableInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Amount Paid:</span>
                  <span>₹{printableInvoice.paid_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-1 font-bold text-sm text-red-700">
                  <span>Pending Due:</span>
                  <span>₹{(printableInvoice.amount - printableInvoice.paid_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 text-center text-[10px] text-slate-500 no-print flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="nm-gradient-bg text-white px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center space-x-1"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official NM Clinic Invoice</span>
              </button>
              <button
                onClick={() => setPrintableInvoice(null)}
                className="bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
