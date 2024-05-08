// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ error: 'Method Not Allowed' });
//     }

//     const { email, firstName, lastName, phone, companyId, token } = req.body;
//     let password = 'password';

//     const data = {
//         email,
//         firstName,
//         lastName,
//         phone,
//         password,
//         companyId
//     }

//     try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}client/add-user`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(data),
//         });

//         // Log response status and text
//         console.log('Response status:', response.status);
//         const responseText = await response.json();
//         console.log('Response text:', responseText);

//         // Handle non-JSON responses
//         if (!response.ok) {
//             console.error('Response not okay:', response.status); // Log response status
//             console.error('Response data:', responseText); // Log response data
//             return res.status(500).json({ error: 'Failed to add user' });
//         }

//         let responseData;
//         try {
//             responseData = JSON.parse(responseText);
//         } catch (error) {
//             console.error('Error parsing JSON:', error); // Log JSON parsing error
//             return res.status(500).json({ error: 'Error parsing server response' });
//         }
//         console.log('Response data:', responseData); // Log parsed response data

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

    const data = {
        email,
        firstName,
        lastName,
        phone,
        password,
        companyId
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}client/add-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        const responseBody = await response.text();
        const responseData = responseBody ? JSON.parse(responseBody) : null;

        if (!response.ok) {
            const errorMessage = responseData && responseData.error ? responseData.error : 'Failed to add user. Server returned an error.';
            console.error('Server error:', errorMessage);
            return res.status(response.status).json({ error: errorMessage });
        }

        console.log('User added successfully:', responseData);
        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
}
