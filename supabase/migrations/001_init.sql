-- Supabase migration: initial tables
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  phone text,
  space text,
  date date,
  time_slot text,
  amount numeric,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  created_at timestamptz DEFAULT now()
);
