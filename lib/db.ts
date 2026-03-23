import Dexie, { Table } from 'dexie';
import { Reminder, ReminderLog, AppSettings, PushSubscription } from './types';

export class RecordatoriosDB extends Dexie {
  reminders!: Table<Reminder>;
  reminderLogs!: Table<ReminderLog>;
  settings!: Table<AppSettings>;
  pushSubscriptions!: Table<PushSubscription>;

  constructor() {
    super('recordatorios-db');
    this.version(1).stores({
      reminders: '++id, nextOccurrence, createdAt',
      reminderLogs: '++id, reminderId, completedAt',
      settings: 'id',
      pushSubscriptions: '++id, endpoint',
    });
  }
}

export const db = new RecordatoriosDB();

// Funciones helper para la DB

export async function getReminders() {
  return db.reminders.toArray();
}

export async function getReminderById(id: number) {
  return db.reminders.get(id);
}

function scheduleLocalSync(reminder: any, id: number) {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && reminder.nextOccurrence) {
    navigator.serviceWorker.ready.then((sw) => {
      sw.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        reminderId: id,
        nextOccurrence: reminder.nextOccurrence,
        title: reminder.title,
        body: reminder.description || '',
      });
    }).catch(console.error);
  }
}

export async function addReminder(reminder: Omit<Reminder, 'id'>) {
  // Limpiar propiedades undefined
  const cleanReminder = Object.fromEntries(
    Object.entries(reminder).filter(([, value]) => value !== undefined)
  );
  const id = await db.reminders.add(cleanReminder as any) as number;
  scheduleLocalSync(cleanReminder, id);
  return id;
}

export async function updateReminder(id: number, reminder: Partial<Reminder>) {
  const result = await db.reminders.update(id, reminder);
  const updated = await getReminderById(id);
  if (updated) {
    scheduleLocalSync(updated, id);
  }
  return result;
}

export async function deleteReminder(id: number) {
  return db.reminders.delete(id);
}

export async function getReminderLogs(reminderId: number) {
  return db.reminderLogs.where('reminderId').equals(reminderId).toArray();
}

export async function addReminderLog(log: Omit<ReminderLog, 'id'>) {
  return db.reminderLogs.add(log as any);
}

export async function getSettings() {
  const settings = await db.settings.toArray();
  return settings[0] || null;
}

export async function updateSettings(settings: Partial<AppSettings>) {
  const existing = await db.settings.toArray();
  const currentSettings = existing.length > 0 ? existing[0] : {
    id: 1,
    darkMode: false,
    notificationsEnabled: true,
    accentColor: 'lavender' as const,
  };

  const cleanSettings = Object.fromEntries(
    Object.entries(settings).filter(([, value]) => value !== undefined)
  );

  return db.settings.put({
    ...currentSettings,
    ...cleanSettings,
    id: currentSettings.id || 1
  });
}

export async function getPushSubscription() {
  const subs = await db.pushSubscriptions.toArray();
  return subs[0] || null;
}

export async function savePushSubscription(sub: Omit<PushSubscription, 'id'>) {
  return db.pushSubscriptions.add(sub as any);
}

export async function getAllReminderLogs() {
  return db.reminderLogs.toArray();
}

export async function deleteAllData() {
  try {
    // Limpiar tablas
    await Promise.all([
      db.reminders.clear(),
      db.reminderLogs.clear(),
      db.pushSubscriptions.clear(),
      db.settings.clear(),
    ]);

    // Borrar la base de datos completamente
    try {
      await db.delete();
    } catch (e) {
      console.warn('No se pudo eliminar la DB completamente:', e);
    }
  } catch (e) {
    console.warn('Error limpiando tablas de DB:', e);
  }

  // Operaciones en el cliente: ServiceWorker, Push, caches, storage, cookies
  if (typeof window !== 'undefined') {
    try {
      // Desregistrar service workers y cancelar suscripciones push
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          try {
            if (reg.pushManager) {
              const sub = await reg.pushManager.getSubscription();
              if (sub) {
                try {
                  // Informar al servidor (si está disponible) para que limpie la suscripción
                  try {
                    await fetch('/api/push/unsubscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(sub.toJSON()),
                    });
                  } catch (e) {
                    // No crítico si el servidor no responde
                  }

                  await sub.unsubscribe();
                } catch (e) {
                  console.warn('Error al desuscribir push:', e);
                }
              }
            }

            await reg.unregister();
          } catch (e) {
            console.warn('Error al desregistrar SW:', e);
          }
        }
      }

      // Limpiar caches
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((k) => caches.delete(k)));
      }

      // Limpiar storages
      try { localStorage.clear(); } catch (e) { console.warn('No se pudo limpiar localStorage', e); }
      try { sessionStorage.clear(); } catch (e) { console.warn('No se pudo limpiar sessionStorage', e); }

      // Limpiar cookies del dominio
      try {
        document.cookie.split(';').forEach((c) => {
          const name = c.split('=')[0].trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          }
        });
      } catch (e) {
        console.warn('No se pudieron borrar cookies:', e);
      }

      // Quitar tema oscuro de la raíz
      try { document.documentElement.classList.remove('dark'); } catch {}

      // Forzar recarga para recrear la app desde cero
      try { location.reload(); } catch {}
    } catch (e) {
      console.warn('Error durante limpieza cliente:', e);
    }
  }
}
