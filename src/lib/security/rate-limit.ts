type Bucket = { timestamps: number[] };

const WINDOW_MS = 60_000;
const ipBuckets = new Map<string, Bucket>();
const keyBuckets = new Map<string, Bucket>();

function pruneAndCheck(
  store: Map<string, Bucket>,
  identifier: string,
  maxPerMinute: number,
): boolean {
  const now = Date.now();
  const bucket = store.get(identifier) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  if (bucket.timestamps.length >= maxPerMinute) {
    store.set(identifier, bucket);
    return false;
  }

  bucket.timestamps.push(now);
  store.set(identifier, bucket);
  return true;
}

/** 60 requests / minute per IP (plugin API). */
export function checkIpRateLimit(clientIp: string): boolean {
  return pruneAndCheck(ipBuckets, clientIp || "unknown", 60);
}

/** 10 requests / minute per API key hash prefix. */
export function checkApiKeyRateLimit(apiKey: string): boolean {
  const id = apiKey.length >= 8 ? apiKey.slice(0, 16) : apiKey;
  return pruneAndCheck(keyBuckets, id, 10);
}
