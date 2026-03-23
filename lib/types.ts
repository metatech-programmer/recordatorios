export type RecurrenceType = 
  | 'none' 
  | 'every-3h' 
  | 'every-5h' 
  | 'every-8h' 
  | 'daily' 
  | 'monthly' 
  | 'quarterly' 
  | 'yearly' 
  | 'custom';

export type Priority = 'high' | 'medium' | 'normal';

export type CustomRecurrenceUnit = 'hours' | 'days' | 'weeks' | 'months' | 'years';

export type ReminderStatus = 'pending' | 'completed' | 'skipped';

export interface Reminder {
  id?: number;
  title: string;
  description?: string;
  startDate: number; // timestamp
  startTime: string; // HH:mm
  recurrence: RecurrenceType;
  customRecurrence?: {
    value: number;
    unit: CustomRecurrenceUnit;
  };
  priority: Priority;
  emoji: string;
  color: string; // pastel color
  createdAt: number;
  nextOccurrence: number; // próximo timestamp para mostrar
  disabled?: boolean; // marcado cuando el recordatorio ya finalizó y no acepta acciones
  timezone?: string; // IANA timezone identifier captured at creation
  recurrenceEnd?: number; // optional timestamp (ms) to stop repeating
}

export interface ReminderLog {
  id?: number;
  reminderId: number;
  status: ReminderStatus;
  completedAt: number;
  response?: string; // para guardar la respuesta del usuario
}

export interface AppSettings {
  id?: number;
  darkMode: boolean;
  notificationsEnabled: boolean;
  accentColor: string;
  lastBackup?: number;
}

export interface PushSubscription {
  id?: number;
  endpoint: string;
  auth: string;
  p256dh: string;
  subscribedAt: number;
}
