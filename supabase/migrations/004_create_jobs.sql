-- Create jobs table for employer job postings
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  description TEXT,
  skills_needed TEXT[] DEFAULT '{}',
  pay_range TEXT,
  location TEXT,
  contact_email TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Anyone can view active jobs
CREATE POLICY "Anyone can view active jobs"
ON jobs FOR SELECT
USING (is_active = true);

-- Anyone can post jobs (for now - simple MVP)
CREATE POLICY "Anyone can post jobs"
ON jobs FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_jobs_created ON jobs(created_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_jobs_updated_at();

