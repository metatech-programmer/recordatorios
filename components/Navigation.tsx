'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ListTodo, Calendar, BarChart2 } from 'lucide-react';

const tabs = [
  { label: 'Lista', href: '/lista', icon: ListTodo },
  { label: 'Calendario', href: '/calendario', icon: Calendar },
  { label: 'Registro', href: '/registro', icon: BarChart2 },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-30 glass-pastel border-t border-white/30 dark:border-slate-700/30"
    >
      <div className="flex justify-around items-center h-20 max-w-2xl mx-auto w-full px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href.split('/')[1]);
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-pastel-lavender/60 dark:bg-pastel-lilac/30 text-slate-900 dark:text-slate-50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-pastel-lilac dark:text-pastel-lavender' : ''}`} />
                <span className="text-xs font-semibold">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="h-0.5 w-8 bg-pastel-lilac rounded-full"
                    transition={{ type: 'spring', damping: 20 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
