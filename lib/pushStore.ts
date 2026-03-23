import fs from 'fs';
import path from 'path';

export type PushSubscriptionRecord = {
  endpoint: string;
  keys?: { p256dh?: string; auth?: string };
  deviceId?: string;
  createdAt: number;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'push_subscriptions.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]));
  } catch (e) {
    // ignore - in some environments (edge) fs might not be writable
  }
}

export async function getSubscriptions(): Promise<PushSubscriptionRecord[]> {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(FILE, 'utf-8');
    return JSON.parse(raw) as PushSubscriptionRecord[];
  } catch (e) {
    return [];
  }
}

export async function addSubscription(sub: PushSubscriptionRecord) {
  try {
    const list = await getSubscriptions();
    const exists = list.find((s) => s.endpoint === sub.endpoint || (sub.deviceId && s.deviceId === sub.deviceId));
    if (!exists) {
      list.push({ ...sub, createdAt: Date.now() });
      ensureDataFile();
      fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
    } else {
      // update existing record with latest keys/deviceId
      const updated = list.map((s) => (s.endpoint === sub.endpoint || (sub.deviceId && s.deviceId === sub.deviceId)) ? { ...s, ...sub, createdAt: s.createdAt } : s);
      ensureDataFile();
      fs.writeFileSync(FILE, JSON.stringify(updated, null, 2));
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function removeSubscription(identifier: string) {
  try {
    const list = await getSubscriptions();
    let newList = list;
    // if identifier looks like an endpoint (starts with http) remove by endpoint else by deviceId
    if (identifier && identifier.startsWith && (identifier.startsWith('http://') || identifier.startsWith('https://'))) {
      newList = list.filter((s) => s.endpoint !== identifier);
    } else {
      newList = list.filter((s) => s.deviceId !== identifier && s.endpoint !== identifier);
    }
    ensureDataFile();
    fs.writeFileSync(FILE, JSON.stringify(newList, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export async function replaceSubscriptions(list: PushSubscriptionRecord[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}
