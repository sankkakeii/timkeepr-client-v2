// pages/api/login.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    console.log(email, password);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-cors-api-key': 'temp_38be81f48417df120d85ea6174df96f7'
            },
            body: JSON.stringify({ email, password }),
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
