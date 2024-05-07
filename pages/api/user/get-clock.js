// pages/api/getOrganizationClock.js

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}user/get-clock`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch clock data');
        }

        const data = await response.json();
        const clockInTime = data.clockInTime;

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred. Please try again' });
    }
}
