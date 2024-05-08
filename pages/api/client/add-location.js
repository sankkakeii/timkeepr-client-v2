export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { organizationLocation, clockInTime, radius, companyId, token } = req.body;
    try {
        const response = await fetch(`https://timekeepr-api-v2.onrender.com/api/client/add-location-mod`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ organizationLocation, clockInTime, radius, companyId })
        });

        if (!response.ok) {
            throw new Error('Failed to add location data/modification');
        }

        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred. Please try again' });
    }
}
