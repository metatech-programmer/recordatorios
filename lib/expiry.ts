import { getReminders, getReminderLogs, addReminderLog, updateReminder } from './db';
import { getNextOccurrence } from './recurrence';

const ACTION_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

// Determine whether a given reminder has any log inside the action window
async function hasActionInWindow(reminderId: number, occurrenceStart: number) {
  const logs = await getReminderLogs(reminderId);
  return logs.some((l) => l.completedAt >= occurrenceStart && l.completedAt <= (occurrenceStart + ACTION_WINDOW_MS));
}

// Process expirations for all reminders: if occurrence + 30min passed with no action,
// mark as 'skipped' and advance recurrence or disable if non-recurring.
export async function processExpirations() {
  try {
    const now = Date.now();
    const reminders = await getReminders();

    for (const r of reminders) {
      if (!r.nextOccurrence) continue;

      const occurrenceStart = r.nextOccurrence;
      const windowEnd = occurrenceStart + ACTION_WINDOW_MS;

      // If still inside window or not yet occurred, skip
      if (now <= windowEnd) continue;

      // If there is an action in the window, skip
      const hasAction = await hasActionInWindow(r.id as number, occurrenceStart);
      if (hasAction) continue;

      // No action within window -> mark as skipped
      await addReminderLog({
        reminderId: r.id as number,
        status: 'skipped',
        completedAt: windowEnd,
      });

      if (r.recurrence === 'none') {
        // Disable the reminder so no further actions are allowed
        await updateReminder(r.id as number, { disabled: true });
      } else {
        // Advance to next occurrence
        const next = getNextOccurrence(r);
        if (next === -1) {
          // series ended -> disable
          await updateReminder(r.id as number, { disabled: true });
        } else {
          await updateReminder(r.id as number, { nextOccurrence: next });
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error procesando expiraciones:', error);
    return false;
  }
}

export default processExpirations;
