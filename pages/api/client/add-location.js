// pages/api/addLocationMod.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { organizationLocation, clockInTime, radius, companyId } = req.body;
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}client/add-location-mod`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({ organizationLocation, clockInTime, radius, companyId })
        });

        if (!response.ok) {
            throw new Error('Failed to add location modification');
        }

        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred. Please try again' });
    }
}
