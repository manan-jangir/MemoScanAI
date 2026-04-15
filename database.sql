-- 1. Create a custom category type to strictly enforce Document tagging
CREATE TYPE document_category AS ENUM ('Utility', 'Finance', 'Event', 'Medical', 'Other');

-- 2. Create the Storage Bucket for uploaded image scans (making it public for easy serving, but we can lock it down)
INSERT INTO storage.buckets (id, name, public) VALUES ('document_scans', 'document_scans', true);

-- Enable Storage Bucket RLS (Row Level Security) allowing authenticated users to upload
CREATE POLICY "Users can upload their own scans" 
  ON storage.objects FOR INSERT TO authenticated 
  WITH CHECK ( bucket_id = 'document_scans' AND auth.uid() = owner );

CREATE POLICY "Users can view their own scans"
  ON storage.objects FOR SELECT TO authenticated
  USING ( bucket_id = 'document_scans' AND auth.uid() = owner );

-- 3. Create the Smart Vault 'Documents' table with relations to Supabase Auth
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    title TEXT NOT NULL,
    category document_category DEFAULT 'Other',
    extracted_date DATE,
    excerpt TEXT,
    
    image_url TEXT NOT NULL,
    raw_text TEXT -- In case we want to store the fully raw OCR dump
);

-- 4. Enable Row Level Security (RLS) on Documents so users can't snoop on other users
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own documents"
  ON public.documents FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own documents"
  ON public.documents FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own documents"
  ON public.documents FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own documents"
  ON public.documents FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
