
import { Space, Profile } from './types';

export const SPACES: Space[] = [
  { id: '1', name: 'SUM Principal', icon: '🏢', color: '#3B82F6', capacity: 40, description: 'Salón de usos múltiples con cocina completa.' },
  { id: '2', name: 'Parrilla Terraza', icon: '🔥', color: '#10B981', capacity: 10, description: 'Espacio al aire libre con parrilla y mesa.' },
  { id: '3', name: 'Quincho', icon: '🛖', color: '#F59E0B', capacity: 20, description: 'Quincho cerrado con aire acondicionado.' },
  { id: '4', name: 'Microcine', icon: '🎬', color: '#8B5CF6', capacity: 12, description: 'Sala de cine privada con proyector 4K.' },
  { id: '5', name: 'Gimnasio', icon: '💪', color: '#EF4444', capacity: 8, description: 'Equipamiento de última generación.' },
  { id: '6', name: 'Coworking', icon: '💻', color: '#06B6D4', capacity: 15, description: 'Espacio silencioso para trabajo y reuniones.' },
];

export const MOCK_ADMIN: Profile = {
  id: 'admin-1',
  email: 'admin@edificio.com',
  full_name: 'Roberto Administrador',
  unit_number: 'AD-01',
  role: 'admin',
};

export const MOCK_RESIDENT: Profile = {
  id: 'res-1',
  email: 'maria@edificio.com',
  full_name: 'María García',
  unit_number: '4B',
  role: 'resident',
};

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];
