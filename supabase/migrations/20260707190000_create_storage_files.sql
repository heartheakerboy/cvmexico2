-- Create storage_files table for Cloudflare R2 metadata
CREATE TABLE IF NOT EXISTS public.storage_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  file_url text NOT NULL,
  status text NOT NULL DEFAULT 'completed', -- 'uploading', 'completed', 'failed', 'deleted'
  is_public boolean NOT NULL DEFAULT false,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.storage_files ENABLE ROW LEVEL SECURITY;

-- Select policy
CREATE POLICY "Users can read own files" ON public.storage_files
  FOR SELECT TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Insert policy
CREATE POLICY "Users can insert own files" ON public.storage_files
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Update policy
CREATE POLICY "Users can update own files" ON public.storage_files
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Delete policy
CREATE POLICY "Users can delete own files" ON public.storage_files
  FOR DELETE TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.storage_files TO authenticated;
GRANT ALL ON public.storage_files TO service_role;

-- Update trigger
CREATE TRIGGER update_storage_files_updated_at BEFORE UPDATE ON public.storage_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
