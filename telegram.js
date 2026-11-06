const BOT_TOKEN = '8719779649:AAH2TqAFogjGwwQVS1ce0I5CMvZnhnNsHCQ';
const CHAT_ID   = '7344589159';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const message = body?.message;

  if (!message) {
    return res.status(400).json({ error: 'message required' });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
      }
    );
    const data = await response.json();
    if (data.ok) return res.status(200).json({ success: true });
    return res.status(400).json({ error: data.description });
  } catch (error) {
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
