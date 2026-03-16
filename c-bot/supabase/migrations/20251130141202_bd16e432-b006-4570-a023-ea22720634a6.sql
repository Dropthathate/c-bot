-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('patient', 'therapist');

-- Create enum for subscription tiers
CREATE TYPE public.subscription_tier AS ENUM ('free', 'active_recovery', 'pro');

-- Create user roles table (security best practice - separate from profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier subscription_tier NOT NULL DEFAULT 'free',
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mobilization techniques table (1/276 Video Library)
CREATE TABLE public.mobilization_techniques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technique_number INTEGER NOT NULL UNIQUE,
    technique_name TEXT NOT NULL,
    body_part TEXT NOT NULL,
    video_url TEXT,
    indication TEXT,
    oxford_reference_page TEXT,
    travell_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create legal templates table
CREATE TABLE public.legal_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modality TEXT NOT NULL,
    template_name TEXT NOT NULL,
    template_type TEXT NOT NULL,
    pdf_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SOAP notes table
CREATE TABLE public.soap_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    raw_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat history table
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobilization_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to get user's subscription tier
CREATE OR REPLACE FUNCTION public.get_subscription_tier(_user_id UUID)
RETURNS subscription_tier
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT subscription_tier
    FROM public.profiles
    WHERE user_id = _user_id
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role during signup"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for mobilization_techniques (viewable by authenticated users with paid tiers)
CREATE POLICY "Anyone can view techniques"
ON public.mobilization_techniques FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for legal_templates (therapists with pro tier only)
CREATE POLICY "Therapists can view legal templates"
ON public.legal_templates FOR SELECT
TO authenticated
USING (
    public.has_role(auth.uid(), 'therapist') 
    AND public.get_subscription_tier(auth.uid()) = 'pro'
);

-- RLS Policies for soap_notes
CREATE POLICY "Therapists can view their own SOAP notes"
ON public.soap_notes FOR SELECT
USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can insert their own SOAP notes"
ON public.soap_notes FOR INSERT
WITH CHECK (auth.uid() = therapist_id AND public.has_role(auth.uid(), 'therapist'));

CREATE POLICY "Therapists can update their own SOAP notes"
ON public.soap_notes FOR UPDATE
USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can delete their own SOAP notes"
ON public.soap_notes FOR DELETE
USING (auth.uid() = therapist_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
ON public.chat_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Trigger for updating profiles updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_soap_notes_updated_at
BEFORE UPDATE ON public.soap_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation (creates profile and default role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Insert sample mobilization techniques
INSERT INTO public.mobilization_techniques (technique_number, technique_name, body_part, indication, oxford_reference_page, travell_reference) VALUES
(1, 'Cervical Flexion Mobilization', 'Neck', 'Stiff neck, reduced flexion ROM', 'Ch. 12, p. 234', 'Vol 1, Ch 5'),
(2, 'Cervical Extension Mobilization', 'Neck', 'Neck pain with extension', 'Ch. 12, p. 236', 'Vol 1, Ch 5'),
(3, 'Cervical Rotation Grade III', 'Neck', 'Limited rotation, torticollis', 'Ch. 12, p. 238', 'Vol 1, Ch 5'),
(45, 'Cervical Lateral Flexion', 'Neck', 'Stiff neck, lateral flexion restriction', 'Ch. 12, p. 240', 'Vol 1, Ch 5'),
(50, 'Thoracic Extension Mobilization', 'Thoracic Spine', 'Kyphotic posture, thoracic stiffness', 'Ch. 13, p. 256', 'Vol 1, Ch 8'),
(75, 'Lumbar Flexion Grade IV', 'Lower Back', 'Chronic low back pain, flexion restriction', 'Ch. 14, p. 312', 'Vol 2, Ch 3'),
(100, 'Hip Flexion Mobilization', 'Hip', 'Hip stiffness, reduced flexion', 'Ch. 15, p. 378', 'Vol 2, Ch 4'),
(125, 'Knee Extension Mobilization', 'Knee', 'Post-surgical stiffness, extension lag', 'Ch. 16, p. 412', 'Vol 2, Ch 5'),
(150, 'Ankle Dorsiflexion Mobilization', 'Ankle', 'Reduced dorsiflexion, post-sprain', 'Ch. 17, p. 456', 'Vol 2, Ch 6'),
(175, 'Shoulder Flexion Grade III', 'Shoulder', 'Frozen shoulder, adhesive capsulitis', 'Ch. 11, p. 198', 'Vol 1, Ch 4'),
(200, 'Elbow Extension Mobilization', 'Elbow', 'Post-fracture stiffness', 'Ch. 10, p. 156', 'Vol 1, Ch 3'),
(225, 'Wrist Extension Mobilization', 'Wrist', 'Carpal tunnel, wrist stiffness', 'Ch. 9, p. 134', 'Vol 1, Ch 2');

-- Insert sample legal templates
INSERT INTO public.legal_templates (modality, template_name, template_type, description) VALUES
('Deep Tissue', 'Deep Tissue Massage Consent Form', 'consent', 'Consent form for deep tissue massage therapy including risks and contraindications'),
('Cupping', 'Cupping Therapy Waiver', 'waiver', 'Waiver form for cupping therapy including bruising disclosure'),
('Hot Stone', 'Hot Stone Massage Consent', 'consent', 'Consent form for hot stone massage including burn risk disclosure'),
('Trigger Point', 'Trigger Point Therapy Consent', 'consent', 'Consent form for trigger point therapy based on Travell methodology'),
('Sports Massage', 'Sports Massage Waiver', 'waiver', 'Athletic massage waiver including soreness and injury disclosure'),
('Prenatal', 'Prenatal Massage Consent', 'consent', 'Specialized consent for prenatal massage with contraindications'),
('Lymphatic Drainage', 'Manual Lymphatic Drainage Consent', 'consent', 'Consent for MLD therapy including contraindications'),
('Myofascial Release', 'Myofascial Release Therapy Consent', 'consent', 'Consent form for myofascial release techniques');