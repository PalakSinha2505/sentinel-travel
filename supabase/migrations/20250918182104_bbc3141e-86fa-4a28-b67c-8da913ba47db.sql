-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nationality TEXT,
  kyc_document_number TEXT,
  phone TEXT,
  emergency_contact TEXT NOT NULL,
  profile_image_url TEXT,
  role TEXT DEFAULT 'tourist' CHECK (role IN ('tourist', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create digital_tourist_ids table for blockchain-simulated IDs
CREATE TABLE public.digital_tourist_ids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  digital_id TEXT NOT NULL UNIQUE,
  blockchain_hash TEXT NOT NULL,
  itinerary JSONB,
  expiry_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  qr_code_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sos_alerts table for panic button incidents
CREATE TABLE public.sos_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  digital_id TEXT REFERENCES public.digital_tourist_ids(digital_id),
  location JSONB, -- {latitude, longitude, address}
  alert_type TEXT DEFAULT 'manual' CHECK (alert_type IN ('manual', 'iot', 'automatic')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'false_alarm')),
  severity TEXT DEFAULT 'high' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  notes TEXT,
  response_time TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create e_fir_reports table for auto-generated FIR records
CREATE TABLE public.e_fir_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sos_alert_id UUID NOT NULL REFERENCES public.sos_alerts(id) ON DELETE CASCADE,
  fir_number TEXT NOT NULL UNIQUE,
  pdf_url TEXT,
  blockchain_hash TEXT NOT NULL,
  police_station TEXT,
  officer_assigned TEXT,
  incident_details TEXT NOT NULL,
  status TEXT DEFAULT 'filed' CHECK (status IN ('filed', 'under_investigation', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create danger_zones table for geo-fencing
CREATE TABLE public.danger_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  coordinates JSONB NOT NULL, -- Array of polygon coordinates
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incidents table for general incident tracking
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location JSONB,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  attachments JSONB, -- Array of file URLs
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_tourist_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.e_fir_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.danger_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Digital Tourist IDs policies
CREATE POLICY "Users can view their own digital ID" 
ON public.digital_tourist_ids FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own digital ID" 
ON public.digital_tourist_ids FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all digital IDs" 
ON public.digital_tourist_ids FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- SOS Alerts policies
CREATE POLICY "Users can view their own SOS alerts" 
ON public.sos_alerts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SOS alerts" 
ON public.sos_alerts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all SOS alerts" 
ON public.sos_alerts FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admins can update SOS alerts" 
ON public.sos_alerts FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- E-FIR Reports policies
CREATE POLICY "Users can view their own FIR reports" 
ON public.e_fir_reports FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.sos_alerts sa 
    WHERE sa.id = sos_alert_id AND sa.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all FIR reports" 
ON public.e_fir_reports FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "System can insert FIR reports" 
ON public.e_fir_reports FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update FIR reports" 
ON public.e_fir_reports FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Danger Zones policies
CREATE POLICY "Everyone can view active danger zones" 
ON public.danger_zones FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage danger zones" 
ON public.danger_zones FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Incidents policies
CREATE POLICY "Users can view their own incidents" 
ON public.incidents FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create incidents" 
ON public.incidents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all incidents" 
ON public.incidents FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admins can update incidents" 
ON public.incidents FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_digital_ids_user_id ON public.digital_tourist_ids(user_id);
CREATE INDEX idx_digital_ids_digital_id ON public.digital_tourist_ids(digital_id);
CREATE INDEX idx_sos_alerts_user_id ON public.sos_alerts(user_id);
CREATE INDEX idx_sos_alerts_status ON public.sos_alerts(status);
CREATE INDEX idx_sos_alerts_created_at ON public.sos_alerts(created_at);
CREATE INDEX idx_e_fir_reports_sos_alert_id ON public.e_fir_reports(sos_alert_id);
CREATE INDEX idx_danger_zones_active ON public.danger_zones(active);
CREATE INDEX idx_incidents_user_id ON public.incidents(user_id);
CREATE INDEX idx_incidents_status ON public.incidents(status);