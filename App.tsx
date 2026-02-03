
import React, { useState, useEffect, useMemo } from 'react';
import { Profile, Space, Reservation, ViewType } from './types';
import { SPACES, MOCK_ADMIN, MOCK_RESIDENT, TIME_SLOTS } from './constants';
import ThemeToggle from './components/ThemeToggle';
import Calendar from './components/Calendar';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  // Authentication & View State
  const [currentUser, setCurrentUser] = useState<Profile | null>(MOCK_RESIDENT);
  const [view, setView] = useState<ViewType>('resident');
  
  // App State
  const [residents, setResidents] = useState<Profile[]>([MOCK_RESIDENT]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Initial Sync (Simulation of Supabase load)
  useEffect(() => {
    const saved = localStorage.getItem('reserva_pro_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setReservations(parsed.reservations || []);
      setResidents(parsed.residents || [MOCK_RESIDENT]);
    }
  }, []);

  // Persistence (Simulation)
  useEffect(() => {
    localStorage.setItem('reserva_pro_data', JSON.stringify({ reservations, residents }));
  }, [reservations, residents]);

  const toggleRole = () => {
    if (view === 'resident') {
      setCurrentUser(MOCK_ADMIN);
      setView('admin');
    } else {
      setCurrentUser(MOCK_RESIDENT);
      setView('resident');
    }
    // Reset selection
    setSelectedSpace(null);
  };

  const handleAddResidents = (data: string) => {
    const lines = data.split('\n');
    const newProfiles: Profile[] = [];
    lines.forEach(line => {
      const parts = line.split(',').map(s => s.trim());
      if (parts.length >= 3) {
        newProfiles.push({
          id: Math.random().toString(36).substr(2, 9),
          full_name: parts[0],
          email: parts[1],
          unit_number: parts[2],
          role: 'resident'
        });
      }
    });
    setResidents(prev => [...prev, ...newProfiles]);
  };

  const createReservation = () => {
    if (!selectedSpace || !selectedDate || !selectedTime || !currentUser) return;

    const newRes: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      space_id: selectedSpace.id,
      space_name: selectedSpace.name,
      profile_id: currentUser.id,
      user_name: currentUser.full_name,
      date: selectedDate,
      start_time: selectedTime,
      end_time: 'Proxima Hora', // Simple for MVP
      status: 'confirmed'
    };

    setReservations(prev => [newRes, ...prev]);
    setSelectedTime('');
    setSelectedSpace(null);
    alert('¡Reserva confirmada con éxito!');
  };

  const cancelReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  };

  const isTimeBooked = (spaceId: string, date: string, time: string) => {
    return reservations.some(r => r.space_id === spaceId && r.date === date && r.start_time === time && r.status === 'confirmed');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-bg-dark-secondary p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 glass-effect sticky top-4 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent-indigo rounded-2xl flex items-center justify-center text-2xl shadow-indigo-500/50 shadow-lg">
            🏢
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-accent-indigo to-accent-violet">
              RESERVA<span className="text-slate-400">PRO</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Gestión de Consorcio Digital</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{currentUser?.full_name}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">{view === 'admin' ? 'Administración' : `Unidad ${currentUser?.unit_number}`}</p>
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
          <button 
            onClick={toggleRole}
            className="flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-600"
          >
            Modo {view === 'admin' ? 'Residente' : 'Admin'}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Areas */}
      <main>
        {view === 'admin' ? (
          <AdminPanel 
            residents={residents} 
            reservations={reservations} 
            onAddResidents={handleAddResidents}
            onCancelReservation={cancelReservation}
          />
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Step 1: Select Space */}
            <div className="lg:col-span-8 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">¿Qué espacio necesitás?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SPACES.map((space) => (
                    <button
                      key={space.id}
                      onClick={() => setSelectedSpace(space)}
                      className={`relative overflow-hidden group p-6 rounded-2xl border transition-all text-left ${
                        selectedSpace?.id === space.id 
                        ? 'border-accent-indigo ring-4 ring-accent-indigo/10 bg-accent-indigo/5' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-bg-dark-secondary hover:border-accent-indigo/50'
                      }`}
                    >
                      <div 
                        className="absolute top-0 left-0 w-1 h-full" 
                        style={{ backgroundColor: space.color }}
                      ></div>
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{space.icon}</span>
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          MAX {space.capacity} PERS
                        </span>
                      </div>
                      <h3 className="font-bold text-lg">{space.name}</h3>
                      <p className="text-sm text-slate-500 mt-1 leading-tight">{space.description}</p>
                    </button>
                  ))}
                </div>
              </section>

              {selectedSpace && (
                <section className="animate-in fade-in zoom-in duration-300">
                  <h2 className="text-2xl font-bold mb-6">Selecciona Horario para <span className="text-accent-indigo">{selectedSpace.name}</span></h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {TIME_SLOTS.map((time) => {
                      const booked = isTimeBooked(selectedSpace.id, selectedDate, time);
                      return (
                        <button
                          key={time}
                          disabled={booked}
                          onClick={() => setSelectedTime(time)}
                          className={`py-4 rounded-xl font-bold text-sm transition-all border ${
                            booked 
                            ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 cursor-not-allowed' 
                            : selectedTime === time 
                              ? 'bg-accent-indigo text-white border-accent-indigo shadow-lg shadow-indigo-500/20 scale-105'
                              : 'bg-white dark:bg-bg-dark-secondary border-slate-200 dark:border-slate-700 hover:border-accent-indigo'
                          }`}
                        >
                          {time}
                          {booked && <div className="text-[8px] uppercase mt-1">Ocupado</div>}
                        </button>
                      );
                    })}
                  </div>
                  
                  {selectedTime && (
                    <div className="mt-8 flex justify-center">
                      <button 
                        onClick={createReservation}
                        className="bg-accent-indigo text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all"
                      >
                        Confirmar Reserva para el {selectedDate}
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Step 2: Calendar & Info */}
            <div className="lg:col-span-4 space-y-6">
              <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              
              <div className="bg-gradient-to-br from-accent-indigo to-accent-violet p-6 rounded-3xl text-white shadow-xl">
                <h3 className="font-bold text-xl mb-2">Tus Próximas Reservas</h3>
                <div className="space-y-4 mt-4">
                  {reservations.filter(r => r.profile_id === currentUser?.id && r.status === 'confirmed').length === 0 ? (
                    <p className="text-sm opacity-80 italic">No tenés reservas pendientes.</p>
                  ) : (
                    reservations
                      .filter(r => r.profile_id === currentUser?.id && r.status === 'confirmed')
                      .slice(0, 3)
                      .map(res => (
                        <div key={res.id} className="bg-white/10 p-3 rounded-xl border border-white/20">
                          <div className="flex justify-between items-center">
                            <p className="font-bold">{res.space_name}</p>
                            <button 
                              onClick={() => cancelReservation(res.id)}
                              className="text-[10px] bg-rose-500/50 hover:bg-rose-500 px-2 py-1 rounded transition-colors"
                            >
                              CANCELAR
                            </button>
                          </div>
                          <p className="text-xs opacity-80">{res.date} • {res.start_time}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Reglas del Consorcio</h4>
                <ul className="text-sm space-y-3 text-slate-500">
                  <li className="flex gap-2"><span>✅</span> Cancelar con al menos 2hs de antelación.</li>
                  <li className="flex gap-2"><span>✅</span> El espacio debe quedar limpio y ordenado.</li>
                  <li className="flex gap-2"><span>✅</span> Reportar cualquier daño a la administración.</li>
                  <li className="flex gap-2"><span>✅</span> Máximo 2 reservas activas por unidad.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* App Footer */}
      <footer className="text-center py-12 border-t border-slate-100 dark:border-slate-800">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
          ReservaPro v1.0 • Impulsando comunidades conectadas
        </p>
      </footer>
    </div>
  );
};

export default App;
