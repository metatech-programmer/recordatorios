'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Reminder } from '@/lib/types';
import { PRIORITY_COLORS } from '@/lib/constants';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Repeat } from 'lucide-react';

interface ReminderCardProps {
  reminder: Reminder;
  index?: number;
  showPriority?: boolean;
}

export default function ReminderCard({ reminder, index = 0, showPriority = true }: ReminderCardProps) {
  const nextOccurrence = new Date(reminder.nextOccurrence);
  const isToday =
    nextOccurrence.toDateString() === new Date().toDateString();
  const isTomorrow =
    nextOccurrence.toDateString() ===
    new Date(Date.now() + 86400000).toDateString();

  const getTimeString = () => {
    if (isToday) return 'Hoy, ' + nextOccurrence.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (isTomorrow) return 'Mañana, ' + nextOccurrence.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return nextOccurrence.toLocaleDateString('es-ES');
  };

  const priorityColor = PRIORITY_COLORS[reminder.priority];

  return (
    <Link href={`/recordatorio/${reminder.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 100,
          delay: index * 0.05,
        }}
        whileHover={{ scale: 1.02, translateY: -4 }}
        whileTap={{ scale: 0.98 }}
        className="card-pastel cursor-pointer"
      >
        <div className="flex gap-4 items-start">
          {/* Indicador de prioridad */}
          <div
            className="w-1 h-12 rounded-full flex-shrink-0"
            style={{ backgroundColor: priorityColor }}
          />

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300">
                <DynamicIcon name={reminder.emoji} className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {reminder.title}
              </h3>
            </div>

            {reminder.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                {reminder.description}
              </p>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              {getTimeString()}
            </p>
          </div>

          {/* Recurrencia */}
          {reminder.recurrence !== 'none' && (
            <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-pastel-mint/50 dark:bg-pastel-mint/20 text-slate-700 dark:text-slate-300 rounded-lg whitespace-nowrap">
              <Repeat className="w-4 h-4" />
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
