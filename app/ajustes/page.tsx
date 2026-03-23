'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSettings, updateSettings, deleteAllData } from '@/lib/db';
import { requestNotificationPermission, subscribeToPush, sendPushSubscriptionToServer } from '@/lib/vapid';
import { useToast } from '@/components/Toast';
import { AppSettings } from '@/lib/types';
import { Settings, Moon, Sun, BellRing, Database, Trash2 } from 'lucide-react';

export default function AjustesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await getSettings();
        setSettings(s);

        // Verificar soporte de notificaciones
        const supported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
        setNotificationsSupported(supported);

        if (supported) {
          const perm = Notification.permission === 'granted';
          setNotificationsEnabled(perm);
        }

        // Aplicar tema oscuro
        if (s?.darkMode && typeof window !== 'undefined') {
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('Error cargando ajustes:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleToggleDarkMode = async () => {
    const newValue = !settings?.darkMode;
    await updateSettings({ darkMode: newValue });
    setSettings((s) => s ? { ...s, darkMode: newValue } : null);

    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    showToast(
      newValue ? 'Modo oscuro activado' : 'Modo claro activado',
      'success'
    );
  };

  const handleToggleNotifications = async () => {
    if (!notificationsSupported) {
      showToast('Tu navegador no soporta notificaciones', 'error');
      return;
    }

    try {
      if (!notificationsEnabled) {
        const granted = await requestNotificationPermission();
        if (!granted) {
          showToast('Permiso de notificaciones denegado', 'warning');
          return;
        }

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
          throw new Error('VAPID public key no configurada en las variables de entorno.');
        }

        const subscription = await subscribeToPush(vapidKey);

        if (subscription) {
          await sendPushSubscriptionToServer(subscription.toJSON());
          setNotificationsEnabled(true);
          showToast('Notificaciones activadas', 'success');
        }
      } else {
        setNotificationsEnabled(false);
        showToast('Notificaciones desactivadas', 'success');
      }
    } catch (error) {
      console.error('Error con notificaciones:', error);
      showToast('Error configurando notificaciones', 'error');
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllData();
      showToast('Todos los datos eliminados', 'success');
      setShowDeleteConfirm(false);
      router.push('/');
    } catch (error) {
      console.error('Error eliminando datos:', error);
      showToast('Error eliminando datos', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Settings className="w-8 h-8 text-pastel-lilac" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-8">
      {/* Tema */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-pastel p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-pastel-lilac dark:text-pastel-lavender">
              <Moon className="w-6 h-6" />
            </span>
            <div>
              <p className="font-bold">Modo Oscuro</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cambia entre tema claro y oscuro
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleDarkMode}
            className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${
              settings?.darkMode
                ? 'bg-pastel-lilac'
                : 'bg-pastel-mint'
            }`}
          >
            <motion.div
              animate={{ x: settings?.darkMode ? 24 : 0 }}
              className="w-6 h-6 bg-white rounded-full flex-shrink-0"
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Notificaciones */}
      {notificationsSupported && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-pastel p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-pastel-lilac dark:text-pastel-lavender">
                <BellRing className="w-6 h-6" />
              </span>
              <div>
                <p className="font-bold">Notificaciones Push</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Recibe alertas incluso cuando la app esté cerrada
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleNotifications}
              className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${
                notificationsEnabled
                  ? 'bg-pastel-lavender'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <motion.div
                animate={{ x: notificationsEnabled ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full flex-shrink-0"
              />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-pastel p-4"
      >
        <h3 className="font-bold flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-pastel-lilac dark:text-pastel-lavender" />
          Información
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Versión:</span> 1.0.0
          </p>
          <p>
            <span className="font-semibold">Almacenamiento:</span> IndexedDB (Local)
          </p>
          <p>
            <span className="font-semibold">Sincronización:</span> 100% Privada
          </p>
          <p className="text-xs text-slate-500 mt-3">
            Todos tus datos se guardan únicamente en tu dispositivo. Nunca se envían a servidores remotos.
          </p>
        </div>
      </motion.div>

      {/* Peligro - Eliminar todos los datos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-pastel p-4 border-2 border-red-300 dark:border-red-900/50"
      >
        <h3 className="font-bold flex items-center gap-2 text-red-700 dark:text-red-300 mb-3">
          <Trash2 className="w-5 h-5" />
          Peligro
        </h3>

        {!showDeleteConfirm ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-danger w-full"
          >
            🗑️ Eliminar Todos Mis Datos
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              ⚠️ Esta acción no se puede deshacer. ¿Estás seguro?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeleteAll}
                className="btn btn-danger"
              >
                Eliminar
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
