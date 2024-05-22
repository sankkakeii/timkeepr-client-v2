export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email } = req.body;
    console.log('here')
    console.log(email)
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}client/get-clock-in-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.status === 401) {
            return res.status(401).json({ error: 'Unauthorized access. Please check your credentials' });
        }

        const data = await response.json();

        if (response.status === 200) {
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
