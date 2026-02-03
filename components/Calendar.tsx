
import React, { useState } from 'react';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isSelected = selectedDate === dateStr;
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <button
        key={d}
        onClick={() => onDateSelect(dateStr)}
        className={`p-2 rounded-lg text-center transition-all ${
          isSelected 
            ? 'bg-accent-indigo text-white font-bold shadow-lg scale-105' 
            : isToday 
              ? 'border border-accent-indigo text-accent-indigo'
              : 'hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-bg-dark-secondary p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">&larr;</button>
        <h3 className="font-bold text-lg">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">&rarr;</button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase p-2">{day}</div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default Calendar;
