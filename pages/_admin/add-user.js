import { useState } from 'react';
import Spinner from '../../components/spinner';

export default function AddUser() {
    const [formState, setFormState] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value
        });
    };


    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Get the token
        const token = localStorage.getItem('time-token');
        let companyId = localStorage.getItem('companyId');

        const data = formState;
        data.companyId = companyId;
        data.token = token;

        try {
            // Pass the token in the Authorization header
            const response = await fetch(`../api/client/add-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error('Failed to add user');
            }

            console.log('User added successfully');
            setLoading(false);

        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status < 500) {
                setErrorMessage('An error occurred. Please try again');
                console.log(error);
                setLoading(false);
            }
        }
    };


    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
                <div className="flex flex-col items-center justify-center p-6 bg-white sm:rounded-3xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <div className="text-gray-600 text-center mb-6">
                        <h1 className="text-xl font-semibold">Add a new user</h1>
                        <p>Enter the details below</p>
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <form className="w-full" onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange} className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" placeholder="name@company.com" required="" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                            <input type="text" name="firstName" id="firstName" onChange={handleInputChange} className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" required="" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                            <input type="text" name="lastName" id="lastName" onChange={handleInputChange} className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" required="" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="phone" id="phone" onChange={handleInputChange} className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" required="" />
                        </div>

                        {/* <button type="submit" className="bg-green-500 hover:bg-green-700 w-full rounded-lg text-white font-medium py-2">Add User</button> */}
                        <button type="submit" className={`bg-green-500 hover:bg-green-700 w-full rounded-lg text-white font-medium py-2 ${loading ? 'pointer-events-none disabled' : ''}`}>
                            {loading ? <Spinner /> : "Add User"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
