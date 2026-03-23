'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { addReminder } from '@/lib/db';
import { useToast } from '@/components/Toast';
import ConfettiCelebration from '@/components/ConfettiCelebration';
import { ICON_OPTIONS, ACCENT_COLORS, RECURRENCE_OPTIONS, PRIORITY_COLORS } from '@/lib/constants';
import { Reminder, RecurrenceType, Priority, CustomRecurrenceUnit } from '@/lib/types';
import * as LucideIcons from 'lucide-react';
import { getNextOccurrence } from '@/lib/recurrence';

export default function CrearPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [celebrating, setCelebrating] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    recurrence: 'none' as RecurrenceType,
    customRecurrenceValue: 1,
    customRecurrenceUnit: 'days' as CustomRecurrenceUnit,
    priority: 'normal' as Priority,
    emoji: 'Activity',
    recurrenceEnd: '',
  });

  const [showCustomRecurrence, setShowCustomRecurrence] = useState(false);

  const calculateNextOccurrence = () => {
    const date = new Date(`${form.startDate}T${form.startTime}`);
    return date.getTime();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast('Por favor ingresa un título', 'warning');
      return;
    }

    try {
      const nextOccurrence = calculateNextOccurrence();

      const reminder: Omit<Reminder, 'id'> = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        startDate: new Date(form.startDate).getTime(),
        startTime: form.startTime,
        recurrence: form.recurrence,
        customRecurrence:
          form.recurrence === 'custom'
            ? {
                value: form.customRecurrenceValue,
                unit: form.customRecurrenceUnit,
              }
            : undefined,
        priority: form.priority,
        emoji: form.emoji,
        color: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)].hex,
        createdAt: Date.now(),
        nextOccurrence,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        recurrenceEnd: form.recurrence === 'none' || !form.recurrenceEnd ? undefined : new Date(form.recurrenceEnd).getTime(),
      };

      await addReminder(reminder);

      setCelebrating(true);
      showToast('¡Recordatorio creado!', 'success');

      setTimeout(() => {
        router.push('/lista');
      }, 1500);
    } catch (error) {
      console.error('Error creando recordatorio:', error);
      showToast('Error al crear recordatorio', 'error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15 } },
  };

  return (
    <>
      {celebrating && <ConfettiCelebration />}

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Título */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold mb-2">Título *</label>
          <input
            type="text"
            placeholder="ej: Estudiar React"
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={100}
          />
        </motion.div>

        {/* Descripción */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold mb-2">Descripción</label>
          <textarea
            placeholder="Detalles adicionales..."
            className="input-field resize-none"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={500}
          />
        </motion.div>

        {/* Ícono */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold mb-2">Ícono</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 justify-center">
            {ICON_OPTIONS.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName] || LucideIcons.Activity;
              return (
                <motion.button
                  key={iconName}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setForm({ ...form, emoji: iconName })}
                  className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                    form.emoji === iconName
                      ? 'bg-pastel-lavender dark:bg-pastel-lilac/40 scale-110 shadow-sm'
                      : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Fecha y Hora */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Fecha</label>
            <input
              type="date"
              className="input-field"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Hora</label>
            <input
              type="time"
              className="input-field"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
        </motion.div>

        {/* Prioridad */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold mb-2">Prioridad</label>
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'medium', 'high'] as const).map((priority) => (
              <motion.button
                key={priority}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setForm({ ...form, priority })}
                className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                  form.priority === priority
                    ? 'scale-105 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                style={{
                  backgroundColor:
                    form.priority === priority
                      ? PRIORITY_COLORS[priority]
                      : `${PRIORITY_COLORS[priority]}80`,
                  color: '#333',
                }}
              >
                {priority === 'high'
                  ? '🔴 Alta'
                  : priority === 'medium'
                  ? '🟡 Media'
                  : '🔵 Normal'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recurrencia */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold mb-2">Recurrencia</label>
          <select
            className="input-field"
            value={form.recurrence}
            onChange={(e) => {
              setForm({ ...form, recurrence: e.target.value as any });
              setShowCustomRecurrence(e.target.value === 'custom');
            }}
          >
            {RECURRENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Recurrencia Personalizada */}
        {showCustomRecurrence && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-pastel-mint/20 dark:bg-pastel-mint/10"
          >
            <div>
              <label className="block text-sm font-semibold mb-2">Cada</label>
              <input
                type="number"
                min="1"
                max="999"
                className="input-field"
                value={form.customRecurrenceValue}
                onChange={(e) =>
                  setForm({ ...form, customRecurrenceValue: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Unidad</label>
              <select
                className="input-field"
                value={form.customRecurrenceUnit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customRecurrenceUnit: e.target.value as any,
                  })
                }
              >
                <option value="hours">Horas</option>
                <option value="days">Días</option>
                <option value="weeks">Semanas</option>
                <option value="months">Meses</option>
                <option value="years">Años</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Fecha límite de recurrencia */}
        {form.recurrence !== 'none' && (
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2">Repetir hasta (opcional)</label>
            <input
              type="date"
              className="input-field"
              value={form.recurrenceEnd}
              onChange={(e) => setForm({ ...form, recurrenceEnd: e.target.value })}
            />
            <p className="text-xs text-slate-500 mt-1">Dejar vacío para repetir indefinidamente.</p>
          </motion.div>
        )}

        {/* Botones */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
          >
            ✨ Guardar
          </motion.button>
        </motion.div>
      </motion.form>
    </>
  );
}
