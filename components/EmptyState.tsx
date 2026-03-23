'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: string | React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className="flex flex-col items-center justify-center min-h-screen gap-6 px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-8xl"
      >
        {icon}
      </motion.div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm">{description}</p>
      </div>

      {action && (
        <Link href={action.href}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary mt-4"
          >
            {action.label}
          </motion.button>
        </Link>
      )}
    </motion.div>
  );
}
