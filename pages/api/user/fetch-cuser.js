// pages/api/getCurrentUser.js

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}user/get-cuser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred. Please try again' });
    }
}
