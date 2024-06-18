/**
 * Handle API response and throw error if not okay
 * @param {Response} response - The response object from the API
 * @returns {Promise<Object>} - A promise that resolves to the JSON data from the response
 */
const handleApiResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
};

export default handleApiResponse;