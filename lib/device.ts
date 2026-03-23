const DEVICE_STORAGE_KEY = 'recordatorios:device_id';

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server-' + Date.now();

  try {
    const existing = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (existing) return existing;

    // Prefer secure crypto API
    const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? (crypto as any).randomUUID()
      : 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);

    localStorage.setItem(DEVICE_STORAGE_KEY, id);
    return id;
  } catch (e) {
    // fallback deterministic id
    const fallback = 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { localStorage.setItem(DEVICE_STORAGE_KEY, fallback); } catch {}
    return fallback;
  }
}

export function getDeviceId(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(DEVICE_STORAGE_KEY); } catch { return null; }
}

export function clearDeviceId() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(DEVICE_STORAGE_KEY); } catch {}
}
