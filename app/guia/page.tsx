'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Rocket, ClipboardList, BellRing, Activity, Palette, Repeat, Save, Smartphone, BookOpen } from 'lucide-react';

export default function GuiaPage() {
  const sections = [
    {
      title: 'Primeros Pasos',
      icon: Rocket,
      content: [
        'Bienvenido a Recordatorios. Tu compañera lagartija está aquí para ayudarte.',
        'Haz clic en Nuevo para crear tu primer recordatorio.',
        'Selecciona una fecha, hora, ícono y nivel de prioridad.',
        'Elige si deseas que se repita automáticamente.',
        '¡Guarda y celebra!',
      ],
    },
    {
      title: 'Cómo usar cada vista',
      icon: ClipboardList,
      content: [
        'Lista: Ve todos tus recordatorios próximos, ordenados como prefieras.',
        'Calendario: Visualiza en qué días tienes recordatorios.',
        'Registro: Historial de todos los recordatorios cumplidos, saltados o pendientes.',
      ],
    },
    {
      title: 'Notificaciones Push',
      icon: BellRing,
      content: [
        'Las notificaciones te alertarán sin abrir la app.',
        'Actívalas en Ajustes → Notificaciones Push.',
        'La primera vez pedirá permiso - ¡acepta!',
        'Puedes responder "Cumplido" o "No cumplido" directamente desde la notificación.',
      ],
    },
    {
      title: 'La Lagartija',
      icon: Activity,
      content: [
        'Tu mascota lagartija tiene varios estados:',
        'Feliz: Celebra cuando cumples recordatorios.',
        'Dormida: Se duerme si no interactúas por 2 minutos.',
        'Preocupada: Te advierte si hay recordatorios vencidos.',
        'Curiosa: Se asoma cuando cambias de vista.',
        '¡Haz clic en ella para un extra de diversión!',
      ],
    },
    {
      title: 'Personalizando',
      icon: Palette,
      content: [
        'Tema: Alterna entre modo claro y oscuro en Ajustes.',
        'Iconos: Elige entre múltiples opciones listos para tus recordatorios.',
        'Colores: Usa 8 colores pastel diferentes.',
        'Prioridades: Alta (rojo), Media (amarillo), Normal (azul).',
      ],
    },
    {
      title: 'Recurrencias',
      icon: Repeat,
      content: [
        'Sin repetición: Recordatorio único.',
        'Cada 3/5/8 horas: Para tareas frecuentes.',
        'Cada día / mes / 3 meses / año: Recurrencias comunes.',
        'Personalizado: Define tu propio intervalo.',
      ],
    },
    {
      title: 'Tus datos',
      icon: Save,
      content: [
        '100% privado: Todo guardado localmente en tu dispositivo.',
        'Nunca se envía a servidores remotos.',
        'Acceso offline: Funciona sin internet.',
        'Respaldo local: Descarga o exporta cuando quieras (próximamente).',
      ],
    },
    {
      title: 'Instalar como App',
      icon: Smartphone,
      content: [
        'Android: Toca el menú → "Instalar app".',
        'iOS: Toca Compartir → "Agregar a pantalla de inicio".',
        'Desktop: Haz clic en el ícono en la barra de dirección.',
        'Una vez instalada, funciona como una app nativa.',
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h1 className="text-3xl font-display font-bold flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-pastel-lilac" />
          Guía de Uso
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Todo lo que necesitas saber para maximizar tu productividad
        </p>
      </motion.div>

      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-pastel p-4 space-y-3"
          >
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Icon className="w-5 h-5 text-pastel-lilac" />
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: sections.length * 0.05 }}
        className="card-pastel p-4 text-center space-y-3"
      >
        <p className="font-semibold">¿Listo para comenzar?</p>
        <Link href="/crear">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary flex items-center gap-2 mx-auto"
          >
            <Rocket className="w-4 h-4" />
            Crear Mi Primer Recordatorio
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
