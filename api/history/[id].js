import { redis } from '../../lib/redis.js';

const HASH_KEY = 'prsi:history';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'missing id' });
      return;
    }

    if (req.method === 'DELETE') {
      await redis.hdel(HASH_KEY, id);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error('history delete api error', err);
    res.status(500).json({ error: 'server error' });
  }
}
