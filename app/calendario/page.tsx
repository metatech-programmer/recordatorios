'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getReminders } from '@/lib/db';
import { MONTHS, WEEKDAYS } from '@/lib/constants';
import { Reminder } from '@/lib/types';
import Link from 'next/link';
import ReminderCard from '@/components/ReminderCard';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DynamicIcon } from '@/components/DynamicIcon';

export default function CalendarioPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const data = await getReminders();
        setReminders(data);
      } catch (error) {
        console.error('Error cargando recordatorios:', error);
      }
    };

    loadReminders();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getRemindersByDay = (day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    const dayStart = date.getTime();
    const dayEnd = dayStart + 86400000;

    return reminders.filter(
      (r) => r.nextOccurrence >= dayStart && r.nextOccurrence < dayEnd
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
    setSelectedDay(null);
  };

  const selectedReminders = selectedDay ? getRemindersByDay(selectedDay) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Navegación mes */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={previousMonth}
          className="p-2 hover:bg-pastel-lavender/30 rounded-lg text-slate-700 dark:text-slate-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <h2 className="text-2xl font-display font-bold">
          {MONTHS[month]} {year}
        </h2>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className="p-2 hover:bg-pastel-lavender/30 rounded-lg text-slate-700 dark:text-slate-300"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Calendario */}
      <div className="card-pastel p-4">
        {/* Encabezado días */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-slate-600 dark:text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Grid de días */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayReminders = day ? getRemindersByDay(day) : [];
            const isSelected = day === selectedDay;
            const isToday =
              day &&
              new Date(year, month, day).toDateString() === new Date().toDateString();

            return (
              <motion.button
                key={index}
                whileHover={day ? { scale: 1.05 } : {}}
                whileTap={day ? { scale: 0.95 } : {}}
                onClick={() => day && setSelectedDay(isSelected ? null : day)}
                disabled={!day}
                className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center text-xs relative transition-all ${
                  !day
                    ? ''
                    : isSelected
                    ? 'bg-pastel-lavender dark:bg-pastel-lilac/40 font-bold'
                    : isToday
                    ? 'bg-pastel-peach/50 dark:bg-pastel-peach/20 ring-2 ring-pastel-peach'
                    : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="font-semibold">{day}</span>
                {dayReminders.length > 0 && (
                  <span className="text-xs opacity-75">
                    {dayReminders.length > 3 ? '...' : '•'.repeat(dayReminders.length)}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recordatorios del día seleccionado */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-pastel-lilac" />
            Recordatorios - {selectedDay} de {MONTHS[month]}
          </h2>

          {selectedReminders.length === 0 ? (
            <div className="card-pastel text-center py-8 text-slate-500">
              Sin recordatorios para este día
            </div>
          ) : (
            selectedReminders.map((reminder, index) => (
              <Link key={reminder.id} href={`/recordatorio/${reminder.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-pastel cursor-pointer"
                >
                  <div className="flex gap-3 items-start">
                    <span className="text-slate-700 dark:text-slate-300">
                      <DynamicIcon name={reminder.emoji} className="w-5 h-5" />
                    </span>
                    <div className="flex-1">
                      <p className="font-bold">{reminder.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(reminder.nextOccurrence).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
