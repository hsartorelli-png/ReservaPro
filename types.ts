
export type Role = 'admin' | 'resident';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  unit_number: string;
  role: Role;
}

export interface Space {
  id: string;
  name: string;
  icon: string;
  color: string;
  capacity: number;
  description: string;
}

export interface Reservation {
  id: string;
  space_id: string;
  profile_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  status: 'confirmed' | 'pending' | 'cancelled';
  user_name?: string;
  space_name?: string;
}

export interface UnavailableDate {
  id: string;
  space_id?: string; // If null, applies to all
  date: string;
  reason: string;
}

export type ViewType = 'resident' | 'admin';
