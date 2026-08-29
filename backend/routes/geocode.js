import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) {
      return res.status(400).json({ error: 'q query param required' });
    }

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '5');
    url.searchParams.set('addressdetails', '1');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let response;
    try {
      response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'LocalVibe/1.0 (event discovery app)',
          Accept: 'application/json',
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return res.status(502).json({ error: 'Geocoding service unavailable' });
    }

    const data = await response.json();
    const results = data.map((item) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      address: item.display_name,
    }));

    res.json(results);
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('GET / (geocode) timeout after 5s');
      return res.status(504).json({ error: 'Geocoding service timeout' });
    }
    console.error('GET / (geocode) error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
