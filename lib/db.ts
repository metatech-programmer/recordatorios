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

export async function addReminder(reminder: Omit<Reminder, 'id'>) {
  // Limpiar propiedades undefined
  const cleanReminder = Object.fromEntries(
    Object.entries(reminder).filter(([, value]) => value !== undefined)
  );
  return db.reminders.add(cleanReminder as any);
}

export async function updateReminder(id: number, reminder: Partial<Reminder>) {
  return db.reminders.update(id, reminder);
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
  await Promise.all([
    db.reminders.clear(),
    db.reminderLogs.clear(),
    db.pushSubscriptions.clear(),
  ]);
}
