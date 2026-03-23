
import { Reminder } from './types';

export function getNextOccurrence(reminder: Reminder): number {
  if (reminder.recurrence === 'none') {
    return reminder.nextOccurrence; // Doesn't change
  }

  // Base the new calculation on the CURRENT date, not past due dates
  // This avoids infinite loops of catching up if a reminder is very overdue
  const baseDate = new Date(Math.max(reminder.nextOccurrence, Date.now()));
  
  switch (reminder.recurrence) {
    case 'every-3h':
      baseDate.setHours(baseDate.getHours() + 3);
      break;
    case 'every-5h':
      baseDate.setHours(baseDate.getHours() + 5);
      break;
    case 'every-8h':
      baseDate.setHours(baseDate.getHours() + 8);
      break;
    case 'daily':
      baseDate.setDate(baseDate.getDate() + 1);
      break;
    case 'monthly':
      baseDate.setMonth(baseDate.getMonth() + 1);
      break;
    case 'quarterly':
      baseDate.setMonth(baseDate.getMonth() + 3);
      break;
    case 'yearly':
      baseDate.setFullYear(baseDate.getFullYear() + 1);
      break;
    case 'custom':
      if (reminder.customRecurrence) {
        const val = reminder.customRecurrence.value;
        switch (reminder.customRecurrence.unit) {
          case 'hours':
            baseDate.setHours(baseDate.getHours() + val);
            break;
          case 'days':
            baseDate.setDate(baseDate.getDate() + val);
            break;
          case 'weeks':
            baseDate.setDate(baseDate.getDate() + val * 7);
            break;
          case 'months':
            baseDate.setMonth(baseDate.getMonth() + val);
            break;
          case 'years':
            baseDate.setFullYear(baseDate.getFullYear() + val);
            break;
        }
      }
      break;
  }
  
  return baseDate.getTime();
}
