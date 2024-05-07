import { useState, useEffect } from 'react';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('time-token');
                const res = await fetch('../api/client/view-users', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await res.json();
                setUsers(data);
            } catch (error) {
                setErrorMessage('An error occurred. Please try again');
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-fit">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <div className="text-gray-600 text-center mb-6">
                        <h1 className="text-xl font-semibold">View Users</h1>
                    </div>
                    <div className="w-full overflow-auto">
                        <table className="w-full text-left border-collapse table-auto">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 font-bold uppercase text-xs text-gray-700 bg-gray-200">First Name</th>
                                    <th className="py-2 px-4 font-bold uppercase text-xs text-gray-700 bg-gray-200">Last Name</th>
                                    <th className="py-2 px-4 font-bold uppercase text-xs text-gray-700 bg-gray-200">Email</th>
                                    <th className="py-2 px-4 font-bold uppercase text-xs text-gray-700 bg-gray-200">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => (
                                    <tr className="hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200" key={i}>
                                        <td className="py-5 px-5 border-b border-gray-200">{user.firstName}</td>
                                        <td className="py-5 px-5 border-b border-gray-200">{user.lastName}</td>
                                        <td className="py-5 px-5 border-b border-gray-200">{user.email}</td>
                                        <td className="py-5 px-5 border-b border-gray-200">{user.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>
            </div>
        </main>
    );
}

