import { redis } from '../lib/redis.js';

const HASH_KEY = 'prsi:history';

const SEED = [
  { id: 'import_01', label: 'Zápis 1', order: 1, players: [{ name: 'Dan', score: 33 }, { name: 'Riči', score: 31 }, { name: 'Noha', score: 32 }] },
  { id: 'import_02', label: 'Zápis 2', order: 2, players: [{ name: 'Dan', score: 22 }, { name: 'Noha', score: 38 }] },
  { id: 'import_03', label: 'Zápis 3', order: 3, players: [{ name: 'Dan', score: 55 }, { name: 'Noha', score: 52 }, { name: 'Riči', score: 50 }] },
  { id: 'import_04', label: 'Zápis 4', order: 4, players: [{ name: 'Dan', score: 44 }, { name: 'Noha', score: 42 }, { name: 'Riči', score: 25 }] },
  { id: 'import_05', label: 'Zápis 5', order: 5, players: [{ name: 'Dan', score: 28 }, { name: 'Noha', score: 16 }, { name: 'Riči', score: 16 }] },
  { id: 'import_06', label: 'Zápis 6', order: 6, players: [{ name: 'Dan', score: 24 }, { name: 'Noha', score: 28 }] },
  { id: 'import_07', label: 'Zápis 7', order: 7, players: [{ name: 'Dan', score: 39 }, { name: 'Noha', score: 43 }] },
  { id: 'import_08', label: 'Zápis 8', order: 8, players: [{ name: 'Dan', score: 37 }, { name: 'Noha', score: 31 }, { name: 'Riči', score: 46 }] },
  { id: 'import_09', label: 'Zápis 9', order: 9, players: [{ name: 'Dan', score: 50 }, { name: 'Noha', score: 70 }] },
  { id: 'import_10', label: 'Zápis 10', order: 10, players: [{ name: 'Dan', score: 112 }, { name: 'Noha', score: 115 }, { name: 'Riči', score: 117 }] },
  { id: 'import_11', label: 'Zápis 11', order: 11, players: [{ name: 'Dan', score: 69 }, { name: 'Noha', score: 40 }] },
  { id: 'import_12', label: 'Zápis 12', order: 12, players: [{ name: 'Dan', score: 18 }, { name: 'Noha', score: 23 }, { name: 'Riči', score: 28 }] },
  { id: 'import_13', label: 'Zápis 13', order: 13, players: [{ name: 'Dan', score: 11 }, { name: 'Noha', score: 6 }] },
  { id: 'import_14', label: 'Zápis 14', order: 14, players: [{ name: 'Dan', score: 17 }, { name: 'Noha', score: 11 }, { name: 'Riči', score: 23 }] },
  { id: 'import_15', label: 'Zápis 15', order: 15, players: [{ name: 'Dan', score: 23 }, { name: 'Noha', score: 13 }] },
  { id: 'import_16', label: 'Zápis 16', order: 16, players: [{ name: 'Noha', score: 68 }, { name: 'Dan', score: 70 }] },
  { id: 'import_17', label: 'Zápis 17', order: 17, players: [{ name: 'Dan', score: 176 }, { name: 'Noha', score: 215 }] },
  { id: 'import_18', label: 'Zápis 18', order: 18, players: [{ name: 'Dan', score: 29 }, { name: 'Noha', score: 34 }] },
  { id: 'import_19', label: 'Zápis 19', order: 19, players: [{ name: 'Dan', score: 25 }, { name: 'Noha', score: 26 }] },
  { id: 'import_20', label: 'Zápis 20', order: 20, players: [{ name: 'Dan', score: 17 }, { name: 'Noha', score: 19 }] }
];

function makeId() {
  return 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      let all = await redis.hgetall(HASH_KEY);
      if (!all || Object.keys(all).length === 0) {
        // first-ever load: seed with the imported history so it isn't empty
        const seedMap = {};
        SEED.forEach((rec) => { seedMap[rec.id] = rec; });
        await redis.hset(HASH_KEY, seedMap);
        all = seedMap;
      }
      const list = Object.keys(all).map((id) => {
        const rec = all[id];
        return { ...rec, id };
      }).sort((a, b) => (b.order || 0) - (a.order || 0));
      res.status(200).json({ history: list });
      return;
    }

    if (req.method === 'POST') {
      const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      if (!body || !Array.isArray(body.players)) {
        res.status(400).json({ error: 'invalid body' });
        return;
      }
      const id = makeId();
      const record = {
        label: body.label || null,
        startedAt: body.startedAt || null,
        endedAt: body.endedAt || new Date().toISOString(),
        order: Date.now(),
        players: body.players
      };
      await redis.hset(HASH_KEY, { [id]: record });
      res.status(200).json({ id, record: { ...record, id } });
      return;
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error('history api error', err);
    res.status(500).json({ error: 'server error' });
  }
}
