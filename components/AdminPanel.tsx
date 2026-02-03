
import React, { useState } from 'react';
import { Profile, Reservation } from '../types';

interface AdminPanelProps {
  residents: Profile[];
  reservations: Reservation[];
  onAddResidents: (data: string) => void;
  onCancelReservation: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ residents, reservations, onAddResidents, onCancelReservation }) => {
  const [csvData, setCsvData] = useState('');

  const handleImport = () => {
    if (!csvData.trim()) return;
    onAddResidents(csvData);
    setCsvData('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onAddResidents(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>👥</span> Gestión de Residentes
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-slate-500">Importar residentes (Nombre, Email, Unidad) separado por comas o saltos de línea.</p>
            <textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Juan Perez, juan@email.com, 10A"
              className="w-full h-32 p-3 rounded-lg bg-slate-50 dark:bg-bg-dark-primary border border-slate-200 dark:border-slate-700 focus:ring-2 ring-accent-indigo outline-none transition-all"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleImport}
                className="flex-1 bg-accent-indigo text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                Agregar Manualmente
              </button>
              <label className="flex-1 bg-slate-200 dark:bg-slate-700 text-center py-2 rounded-lg font-semibold cursor-pointer hover:bg-opacity-80 transition-all">
                Subir CSV
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-xl font-bold mb-4">Lista de Residentes ({residents.length})</h3>
          <div className="overflow-y-auto max-h-64 divide-y divide-slate-100 dark:divide-slate-800">
            {residents.map((r) => (
              <div key={r.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{r.full_name}</p>
                  <p className="text-xs text-slate-500">{r.email} • Unidad {r.unit_number}</p>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Residente</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-bg-dark-secondary p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Últimas Reservas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 font-medium">Espacio</th>
                <th className="pb-3 font-medium">Residente</th>
                <th className="pb-3 font-medium">Fecha/Hora</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reservations.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">No hay reservas registradas.</td></tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res.id}>
                    <td className="py-4 font-semibold">{res.space_name}</td>
                    <td className="py-4">{res.user_name}</td>
                    <td className="py-4 text-sm">{res.date} • {res.start_time}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {res.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {res.status === 'confirmed' && (
                        <button 
                          onClick={() => onCancelReservation(res.id)}
                          className="text-rose-500 text-sm hover:underline"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
