// pages/api/clockInUser.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, userPosition } = req.body;
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}user/clock-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({ email, userPosition })
        });

        if (!response.ok) {
            throw new Error('Failed to clock in user');
        }

        const data = await response.json();
        const message = data.message;

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred. Please try again' });
    }
}
