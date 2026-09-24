-- Dental Patient Management System (DPMS) Supabase PostgreSQL Schema

-- 1. Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Doctor', 'Receptionist')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Disabled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  qualification TEXT NOT NULL,
  specialization TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Disabled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  dob DATE,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  blood_group TEXT,
  allergies TEXT,
  medical_conditions TEXT,
  notes TEXT,
  teeth_conditions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No Show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Treatment Plans table
CREATE TABLE IF NOT EXISTS public.treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  treatment_name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  expected_end_date DATE,
  estimated_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Treatment Visits table
CREATE TABLE IF NOT EXISTS public.treatment_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_plan_id UUID REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  procedure_done TEXT NOT NULL,
  notes TEXT,
  amount_charged NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  treatment_plan_id UUID REFERENCES public.treatment_plans(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  due_date DATE,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Partial', 'Pending')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  amount_paid NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'UPI', 'Card', 'Bank Transfer')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to perform operations
CREATE POLICY "Allow authenticated read/write access" ON public.patients FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write access" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write access" ON public.treatment_plans FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write access" ON public.treatment_visits FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write access" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write access" ON public.payments FOR ALL USING (true);
