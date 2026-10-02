import { Redis } from '@upstash/redis';

// Vercel's Redis (Upstash) marketplace integration sets env vars under a
// couple of different names depending on how/when it was connected. Try the
// current names first, then the legacy KV_* names for backward compatibility.
const url =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.error(
    'prsi: no Redis env vars found. Add a Redis (Upstash) store to this ' +
    'Vercel project under Storage, and make sure it is connected to this ' +
    'project (Settings -> Environment Variables should then show ' +
    'UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).'
  );
}

export const redis = new Redis({ url: url || '', token: token || '' });
