'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getReminderById, deleteReminder, updateReminder, getReminderLogs, addReminderLog } from '@/lib/db';
import { useToast } from '@/components/Toast';
import { Reminder, ReminderLog } from '@/lib/types';
import { getNextOccurrence } from '@/lib/recurrence';
import ConfettiCelebration from '@/components/ConfettiCelebration';
import { DynamicIcon } from '@/components/DynamicIcon';
import Link from 'next/link';
import { 
  CheckCircle2, XCircle, Clock, CalendarDays, 
  AlertCircle, AlertTriangle, Info, Repeat, 
  BarChart2, Edit2, Trash2, ClipboardList, Activity
} from 'lucide-react';

export default function RecordatorioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const reminderId = parseInt(params.id as string);

  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await getReminderById(reminderId);
        setReminder(r || null);

        if (r) {
          const l = await getReminderLogs(reminderId);
          setLogs(l);
        }
      } catch (error) {
        console.error('Error cargando recordatorio:', error);
        showToast('Error cargando recordatorio', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [reminderId, showToast]);

  const handleMarkAsDone = async () => {
    try {
      if (!reminder) return;

      setCelebrating(true);
      await addReminderLog({
        reminderId,
        status: 'completed',
        completedAt: Date.now(),
      });

      // Update nextOccurrence
      const newNext = getNextOccurrence(reminder);
      if (newNext !== reminder.nextOccurrence && reminder.id) {
        await updateReminder(reminder.id, { nextOccurrence: newNext });
      }

      const l = await getReminderLogs(reminderId);
      setLogs(l);

      showToast('¡Recordatorio cumplido!', 'success');

      setTimeout(() => {
        router.push('/lista');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      showToast('Error marcando como cumplido', 'error');
    }
  };

  const handleMarkAsSkipped = async () => {
    try {
      if (!reminder) return;

      await addReminderLog({
        reminderId,
        status: 'skipped',
        completedAt: Date.now(),
      });

      // Update nextOccurrence
      const newNext = getNextOccurrence(reminder);
      if (newNext !== reminder.nextOccurrence && reminder.id) {
        await updateReminder(reminder.id, { nextOccurrence: newNext });
      }

      const l = await getReminderLogs(reminderId);
      setLogs(l);

      showToast('Recordatorio saltado', 'info');

      setTimeout(() => {
        router.push('/lista');
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      showToast('Error saltando recordatorio', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReminder(reminderId);
      showToast('Recordatorio eliminado', 'success');
      router.push('/lista');
    } catch (error) {
      console.error('Error:', error);
      showToast('Error eliminando recordatorio', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Activity className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!reminder) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-slate-600 dark:text-slate-400">Recordatorio no encontrado</p>
        <Link href="/lista">
          <motion.button whileHover={{ scale: 1.05 }} className="btn btn-primary mt-4">
            Volver a la lista
          </motion.button>
        </Link>
      </div>
    );
  }

  const nextOccurrence = new Date(reminder.nextOccurrence);

  // Check if reminder is considered completed for its CURRENT cycle
  // For 'none', it's completed if there's any log
  // For recurring, if nextOccurrence is in the future (> Date.now() + some buffer), we hide the buttons. Let's use a simple condition:
  const isCompletedForCycle = reminder.recurrence === 'none' 
    ? logs.length > 0 
    : reminder.nextOccurrence > Date.now();

  return (
    <>
      {celebrating && <ConfettiCelebration />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 pb-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-pastel p-6 text-center space-y-4 flex flex-col items-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 rounded-full bg-black/5 dark:bg-white/5"
          >
            <DynamicIcon name={reminder.emoji} className="w-16 h-16 text-slate-700 dark:text-slate-300" />
          </motion.div>

          <h1 className="text-3xl font-display font-bold">{reminder.title}</h1>

          {reminder.description && (
            <p className="text-slate-600 dark:text-slate-400">{reminder.description}</p>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-3 md:grid-cols-2"
        >
          <div className="card-pastel p-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
              <CalendarDays className="w-4 h-4" />
              <span>Próxima vez</span>
            </div>
            <p className="font-bold text-lg">{nextOccurrence.toLocaleDateString('es-ES')}</p>
            <p className="text-sm">{nextOccurrence.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <div className="card-pastel p-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Prioridad</span>
            </div>
            <p className="font-bold flex items-center gap-2 text-lg">
              {reminder.priority === 'high' ? (
                <><AlertCircle className="text-red-500 w-5 h-5" /> Alta</>
              ) : reminder.priority === 'medium' ? (
                <><AlertTriangle className="text-yellow-500 w-5 h-5" /> Media</>
              ) : (
                <><Info className="text-blue-500 w-5 h-5" /> Normal</>
              )}
            </p>
          </div>

          <div className="card-pastel p-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
              <Repeat className="w-4 h-4" />
              <span>Recurrencia</span>
            </div>
            <p className="font-bold text-lg">
              {reminder.recurrence === 'none'
                ? 'Sin repetición'
                : reminder.recurrence === 'daily'
                ? 'Cada día'
                : reminder.recurrence === 'monthly'
                ? 'Cada mes'
                : reminder.recurrence === 'yearly'
                ? 'Cada año'
                : reminder.recurrence === 'quarterly'
                ? 'Cada 3 meses'
                : reminder.recurrence === 'custom'
                ? `Cada ${reminder.customRecurrence?.value} ${reminder.customRecurrence?.unit}`
                : 'Personalizado'}
            </p>
          </div>

          <div className="card-pastel p-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
              <BarChart2 className="w-4 h-4" />
              <span>Completados</span>
            </div>
            <p className="font-bold text-lg">{logs.filter((l) => l.status === 'completed').length}</p>
          </div>
        </motion.div>

        {/* Historial */}
        {logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Historial
            </h2>

            <div className="card-pastel p-4 max-h-40 overflow-y-auto">
              <div className="space-y-3">
                {logs
                  .sort((a, b) => b.completedAt - a.completedAt)
                  .slice(0, 10)
                  .map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-center justify-between text-sm border-b border-black/5 dark:border-white/5 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-slate-600 dark:text-slate-400">
                        {new Date(log.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>
                        {log.status === 'completed'
                          ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                          : log.status === 'skipped'
                          ? <XCircle className="w-5 h-5 text-yellow-500" />
                          : <Clock className="w-5 h-5 text-blue-500" />}
                      </span>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 pt-4"
        >
          {!isCompletedForCycle && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAsDone}
                className="btn bg-green-200/80 dark:bg-green-900/50 text-green-900 dark:text-green-100 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Lo Cumplí
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAsSkipped}
                className="btn bg-yellow-200/80 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                No lo cumplí
              </motion.button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/editar/${reminderId}`)}
            className={`btn btn-secondary flex items-center justify-center gap-2 ${isCompletedForCycle ? 'col-span-1' : ''}`}
          >
            <Edit2 className="w-5 h-5" />
            Editar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className={`btn btn-danger flex items-center justify-center gap-2 ${isCompletedForCycle ? 'col-span-1' : ''}`}
          >
            <Trash2 className="w-5 h-5" />
            Eliminar
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}
