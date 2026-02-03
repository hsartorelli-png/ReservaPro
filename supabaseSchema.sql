
-- SQL for setting up the Supabase database
-- Run this in the Supabase SQL Editor

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  unit_number TEXT,
  role TEXT DEFAULT 'resident' CHECK (role IN ('admin', 'resident'))
);

-- 2. Spaces Table
CREATE TABLE spaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  capacity INTEGER,
  description TEXT
);

-- 3. Reservations Table
CREATE TABLE reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Unavailable Dates Table
CREATE TABLE unavailable_dates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE, -- Null means all spaces
  date DATE NOT NULL,
  reason TEXT
);

-- Insert Initial Spaces
INSERT INTO spaces (name, icon, color, capacity, description) VALUES
('SUM Principal', '🏢', '#3B82F6', 40, 'Salón de usos múltiples con cocina completa.'),
('Parrilla Terraza', '🔥', '#10B981', 10, 'Espacio al aire libre con parrilla y mesa.'),
('Quincho', '🛖', '#F59E0B', 20, 'Quincho cerrado con aire acondicionado.'),
('Microcine', '🎬', '#8B5CF6', 12, 'Sala de cine privada con proyector 4K.'),
('Gimnasio', '💪', '#EF4444', 8, 'Equipamiento de última generación.'),
('Coworking', '💻', '#06B6D4', 15, 'Espacio silencioso para trabajo y reuniones.');

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Spaces are viewable by everyone" ON spaces FOR SELECT USING (true);
CREATE POLICY "Spaces can only be managed by admins" ON spaces FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Reservations are viewable by everyone" ON reservations FOR SELECT USING (true);
CREATE POLICY "Users can create their own reservations" ON reservations FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Admins can manage all reservations" ON reservations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
