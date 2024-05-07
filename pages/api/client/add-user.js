
// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ error: 'Method Not Allowed' });
//     }

//     const { email, firstName, lastName, phone, companyId } = req.body;
//     let password = 'password';
//     const token = req.headers.authorization.replace('Bearer ', '');

//     const data = {
//         email,
//         firstName,
//         lastName,
//         phone,
//         password,
//         companyId
//     }

//     try {
//         console.log('Request data:', data); // Log request data
//         const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}client/add-user`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(data),
//         });

//         if (!response.ok) {
//             console.error('Response not okay:', response.status); // Log response status
//             const responseData = await response.json(); // Store response data
//             console.error('Response data:', responseData); // Log response data
//             throw new Error('Failed to add user');
//         }

//         const responseData = await response.json();
//         console.log('Response data:', responseData); // Log response data

//         return res.status(200).json(responseData);
//     } catch (error) {
//         console.error('Error occurred:', error); // Log error
//         return res.status(500).json({ error: 'An error occurred. Please try again' });
//     }
// }



















export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, firstName, lastName, phone, companyId, token } = req.body;
    let password = 'password';
    // const token = req.headers.authorization.replace('Bearer ', '');

    const data = {
        email,
        firstName,
        lastName,
        phone,
        password,
        companyId
    }

    console.log(token)
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzkwMjhhZmMxNTkyYTE4NDA2ZWJmZSIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNzE1MDk4OTk2fQ.1jEADzGRUdmcT2_G8YMi87hV27SpehRcflwAIKElCnc

    try {
        console.log('Request data:', data); // Log request data
        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}client/add-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        // Log response status and text
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        // Handle non-JSON responses
        if (!response.ok) {
            console.error('Response not okay:', response.status); // Log response status
            console.error('Response data:', responseText); // Log response data
            return res.status(500).json({ error: 'Failed to add user' });
        }

        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (error) {
            console.error('Error parsing JSON:', error); // Log JSON parsing error
            return res.status(500).json({ error: 'Error parsing server response' });
        }
        
        console.log('Response data:', responseData); // Log parsed response data

        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error occurred:', error); // Log error
        return res.status(500).json({ error: 'An error occurred. Please try again' });
    }
}
