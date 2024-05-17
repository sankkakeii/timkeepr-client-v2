// pages/api/login.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email } = req.body;
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}user/get-clock-in-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email }),
        });

        if (response.status === 401) {
            return res.status(401).json({ error: 'Unauthorized access. Please check your credentials' });
        }

        const data = await response.json();

        if (data.auth) {
            return res.status(200).json(data);
        } else {
            console.log('Something went wrong. Please try again');
            return res.status(400).json({ error: 'Something went wrong. Please try again' });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'An error occurred. Please try again' });
    }
}
