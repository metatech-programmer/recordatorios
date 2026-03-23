'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Settings, SlidersHorizontal, Download } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showSettings?: boolean;
}

export default function Header({ title = 'Recordatorios', showSettings = true }: HeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    // Run expirations check on mount and when the app becomes visible
    let mounted = true;

    const runExpiry = async () => {
      try {
        const mod = await import('@/lib/expiry');
        if (!mounted) return;
        await mod.processExpirations();
      } catch (e) {
        console.error('Error ejecutando expiraciones:', e);
      }
    };

    runExpiry();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') runExpiry();
    };

    document.addEventListener('visibilitychange', onVisibility);

    // Periodic check every 5 minutes while app is open
    const interval = setInterval(runExpiry, 5 * 60 * 1000);

    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(interval);
    };
  }, []);

  const handleInstallClick = async () => {
    setSettingsOpen(false);
    if (!deferredPrompt) {
      alert("La app ya está instalada o tu navegador no lo soporta.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className="glass-pastel border-b border-white/30 dark:border-slate-700/30 sticky top-0 z-20"
    >
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-display font-bold text-gradient cursor-pointer hover:opacity-80 transition-opacity">{title}</h1>
        </Link>

        {showSettings && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 hover:bg-pastel-lavender/30 dark:hover:bg-pastel-lilac/20 rounded-lg transition-colors"
              aria-label="Configuración"
            >
              <Settings className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>

            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 card-pastel shadow-lg min-w-44 flex flex-col p-1 z-50"
              >
                <Link 
                  href="/ajustes" 
                  onClick={() => setSettingsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded transition-colors text-slate-700 dark:text-slate-300"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Ajustes
                </Link>
                <button
                  onClick={handleInstallClick}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded transition-colors text-slate-700 dark:text-slate-300"
                >
                  <Download className="w-4 h-4" /> Instalar App
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
