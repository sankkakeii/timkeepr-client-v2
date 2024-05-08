// pages/api/viewUsers.js

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Get the token
        const token = req.headers.authorization.replace('Bearer ', '');

        console.log(token);

        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}client/view-users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        if(response.status === 200) {
            const users = await response.json();
            return res.status(200).json(users);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching users' });
    }
}
