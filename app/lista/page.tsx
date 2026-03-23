'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getReminders } from '@/lib/db';
import ReminderCard from '@/components/ReminderCard';
import EmptyState from '@/components/EmptyState';
import { Reminder } from '@/lib/types';

type SortBy = 'upcoming' | 'priority' | 'title';

export default function ListaPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('upcoming');
  const [filter, setFilter] = useState<'all' | 'today' | 'overdue'>('all');

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const data = await getReminders();
        setReminders(data);
      } catch (error) {
        console.error('Error cargando recordatorios:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReminders();

    // Recargar cada 60 segundos
    const interval = setInterval(loadReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const now = Date.now();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(today);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const todayCount = reminders.filter((r) => {
    const reminderDate = new Date(r.nextOccurrence);
    reminderDate.setHours(0, 0, 0, 0);
    return reminderDate.getTime() === today.getTime();
  }).length;

  const overdueCount = reminders.filter((r) => r.nextOccurrence < now).length;

  let filtered = reminders;

  if (filter === 'today') {
    filtered = reminders.filter((r) => {
      const reminderDate = new Date(r.nextOccurrence);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() === today.getTime();
    });
  } else if (filter === 'overdue') {
    filtered = reminders.filter((r) => r.nextOccurrence < now);
  }

  // Ordenar
  let sorted = [...filtered];
  if (sortBy === 'upcoming') {
    sorted.sort((a, b) => a.nextOccurrence - b.nextOccurrence);
  } else if (sortBy === 'priority') {
    const priorityOrder = { high: 0, medium: 1, normal: 2 };
    sorted.sort(
      (a, b) =>
        priorityOrder[a.priority] - priorityOrder[b.priority] ||
        a.nextOccurrence - b.nextOccurrence
    );
  } else if (sortBy === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          🦎
        </motion.div>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="Sin recordatorios"
        description={
          reminders.length === 0
            ? 'Aún no tienes ningún recordatorio. ¡Crea uno para comenzar!'
            : `No hay recordatorios ${filter === 'today' ? 'para hoy' : filter === 'overdue' ? 'vencidos' : ''}. ¡Relájate!`
        }
        action={{ label: 'Crear Recordatorio', href: '/crear' }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Controles */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'today', 'overdue'] as const).map((f) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-pastel-lavender dark:bg-pastel-lilac/40 text-slate-900 dark:text-slate-50'
                : 'glass-pastel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'
            }`}
          >
            {f === 'all'
              ? `📋 Todos (${reminders.length})`
              : f === 'today'
              ? `📅 Hoy (${todayCount})`
              : `⚠️ Vencidos (${overdueCount})`}
          </motion.button>
        ))}
      </div>

      {/* Ordenamiento */}
      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="input-field text-sm"
        >
          <option value="upcoming">⏰ Próximos</option>
          <option value="priority">🔴 Prioridad</option>
          <option value="title">🔤 Título</option>
        </select>
      </div>

      {/* Lista */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        className="space-y-3"
      >
        {sorted.map((reminder, index) => (
          <ReminderCard key={reminder.id} reminder={reminder} index={index} />
        ))}
      </motion.div>

      {/* FAB para crear */}
      <Link href="/crear">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-pastel-lavender to-pastel-lilac text-white text-2xl font-bold shadow-xl flex items-center justify-center"
        >
          +
        </motion.button>
      </Link>
    </motion.div>
  );
}
