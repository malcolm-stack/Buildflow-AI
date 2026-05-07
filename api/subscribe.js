// File: api/subscribe.js
// Drop this file into your repo at: api/subscribe.js
// Vercel automatically turns files in /api into serverless functions

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_a587b7e4-e752-4c48-bd7d-f74c0c895fea/subscriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Beehiiv API error:', data);
      return res.status(response.status).json({ error: 'Subscription failed' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
