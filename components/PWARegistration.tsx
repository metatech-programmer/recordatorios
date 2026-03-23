"use client";
import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/vapid';

export default function PWARegistration() {
  useEffect(() => {
    // Register SW on client mount
    registerServiceWorker().catch(() => {});
  }, []);

  return null;
}
