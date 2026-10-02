import { redis } from '../lib/redis.js';

const KEY = 'prsi:state';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const state = await redis.get(KEY);
      res.status(200).json({ state: state || null });
      return;
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      if (!body || !Array.isArray(body.players)) {
        res.status(400).json({ error: 'invalid body' });
        return;
      }
      await redis.set(KEY, body);
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === 'DELETE') {
      await redis.del(KEY);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error('state api error', err);
    res.status(500).json({ error: 'server error' });
  }
}
