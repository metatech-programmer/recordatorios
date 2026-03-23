'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllReminderLogs, getReminderById } from '@/lib/db';
import { ReminderLog, Reminder } from '@/lib/types';
import EmptyState from '@/components/EmptyState';
import { Activity, BarChart2, CheckCircle2, XCircle, CalendarDays } from 'lucide-react';
import { DynamicIcon } from '@/components/DynamicIcon';

type FilterStatus = 'all' | 'completed' | 'skipped' | 'pending';

export default function RegistroPage() {
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [reminders, setReminders] = useState<Map<number, Reminder | null>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const allLogs = await getAllReminderLogs();
        setLogs(allLogs);

        // Cargar datos de recordatorios
        const reminderMap = new Map<number, Reminder | null>();
        const uniqueReminderIds = [...new Set(allLogs.map((l) => l.reminderId))];

        for (const id of uniqueReminderIds) {
          const reminder = await getReminderById(id);
          reminderMap.set(id, reminder || null);
        }

        setReminders(reminderMap);
      } catch (error) {
        console.error('Error cargando registro:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  let filtered = logs;

  if (filter === 'completed') {
    filtered = logs.filter((l) => l.status === 'completed');
  } else if (filter === 'skipped') {
    filtered = logs.filter((l) => l.status === 'skipped');
  } else if (filter === 'pending') {
    filtered = logs.filter((l) => l.status === 'pending');
  }

  // Ordenar por fecha descendente
  const sorted = [...filtered].sort((a, b) => b.completedAt - a.completedAt);

  const grouped = sorted.reduce(
    (acc, log) => {
      const date = new Date(log.completedAt).toLocaleDateString('es-ES');
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, ReminderLog[]>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Activity className="w-8 h-8 text-pastel-lilac" />
        </motion.div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={<BarChart2 className="w-16 h-16 text-slate-400" />}
        title="Sin historial"
        description="Conforme completes recordatorios, aparecerán aquí."
        action={{ label: 'Crear Recordatorio', href: '/crear' }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'completed', 'skipped', 'pending'] as const).map((f) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-pastel-lavender dark:bg-pastel-lilac/40'
                : 'glass-pastel'
            }`}
          >
            {f === 'all'
              ? ( <span className="flex items-center gap-1"><BarChart2 className="w-4 h-4" /> Todos ({logs.length})</span> )
              : f === 'completed'
              ? ( <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Cumplidos ({logs.filter((l) => l.status === 'completed').length})</span> )
              : f === 'skipped'
              ? ( <span className="flex items-center gap-1"><XCircle className="w-4 h-4" /> Saltados ({logs.filter((l) => l.status === 'skipped').length})</span> )
              : ( <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> Pendientes ({logs.filter((l) => l.status === 'pending').length})</span> )}
          </motion.button>
        ))}
      </div>

      {/* Historial agrupado por fecha */}
      <motion.div className="space-y-4">
        {Object.entries(grouped).map(([date, dateLogs], dateIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dateIndex * 0.05 }}
          >
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
              <CalendarDays className="w-4 h-4" /> {date}
            </h3>

            <div className="space-y-2">
              {dateLogs.map((log, logIndex) => {
                const reminder = reminders.get(log.reminderId);
                const StatusIcon =
                  log.status === 'completed'
                    ? CheckCircle2
                    : log.status === 'skipped'
                    ? XCircle
                    : Activity;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: logIndex * 0.03 }}
                    className="card-pastel p-3"
                  >
                    <div className="flex gap-3 items-start items-center">
                      <span className="text-2xl text-slate-700 dark:text-slate-300">
                        <DynamicIcon name={reminder?.emoji || 'Activity'} className="w-8 h-8" />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">
                            {reminder?.title || 'Recordatorio'}
                          </p>
                          <span className={`${log.status === 'completed' ? 'text-pastel-mint' : log.status === 'skipped' ? 'text-red-400' : 'text-yellow-400'}`}>
                            <StatusIcon className="w-5 h-5" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {new Date(log.completedAt).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
