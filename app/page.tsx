'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { registerServiceWorker, requestNotificationPermission } from '@/lib/vapid';
import { 
  Smile, PlusCircle, ListTodo, Calendar, BarChart2, 
  Settings, BookOpen, Sparkles, BellRing, Smartphone, 
  WifiOff, Palette, Repeat, Activity 
} from 'lucide-react';

export default function Home() {
  useEffect(() => {
    // Registrar Service Worker
    registerServiceWorker();

    // Pedir permiso de notificaciones
    requestNotificationPermission().catch(console.error);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 15 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 py-8"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center space-y-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex justify-center"
        >
          <div className="bg-pastel-rose/20 p-6 rounded-full inline-block">
            <Activity className="w-16 h-16 text-pastel-lilac dark:text-pastel-lavender" />
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
          Recordatorios Inteligentes
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Tu compañera lagartija te ayudará a no olvidar nada. Recordatorios personalizados, notificaciones push, y todo completamente offline.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          { icon: PlusCircle, label: 'Nuevo', href: '/crear' },
          { icon: ListTodo, label: 'Mi Lista', href: '/lista' },
          { icon: Calendar, label: 'Calendario', href: '/calendario' },
          { icon: BarChart2, label: 'Registro', href: '/registro' },
          { icon: Settings, label: 'Ajustes', href: '/ajustes' },
          { icon: BookOpen, label: 'Guía', href: '/guia' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="card-pastel w-full aspect-square flex flex-col items-center justify-center gap-3 text-center text-slate-700 dark:text-slate-300"
              >
                <Icon className="w-8 h-8" />
                <span className="font-semibold text-sm">{action.label}</span>     
              </motion.button>
            </Link>
          );
        })}
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-3">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-pastel-lilac" /> 
          Características
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            { icon: BellRing, title: 'Notificaciones Push', desc: 'Recibe recordatorios incluso cuando cierres la app' },
            { icon: Smartphone, title: 'Instalable', desc: 'Funciona como una app nativa en tu dispositivo' },
            { icon: WifiOff, title: '100% Offline', desc: 'Sin internet? Sin problema, todo funciona sin conexión' },
            { icon: Palette, title: 'Cute & Pink', desc: 'Diseño pastel adorable con tu lagartija mascota' },
            { icon: Repeat, title: 'Recurrentes', desc: 'Crea recordatorios que se repitan automáticamente' },
            { icon: Activity, title: 'Mascota IA', desc: 'Una lagartija virtual que reacciona a tus acciones' },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card-pastel p-4"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 text-pastel-lilac dark:text-pastel-lavender">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{feature.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA Principal */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <Link href="/crear">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 30px rgba(232, 215, 241, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center mx-auto gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Crea Tu Primer Recordatorio
          </motion.button>
        </Link>

        <p className="text-xs text-slate-500">
          Gratis • Sin login • Sin datos en servidores • 100% privado
        </p>
      </motion.div>
    </motion.div>
  );
}
