import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Analytics() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [clockInData, setClockInData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('time-token');
        setToken(token);
        
        const fetchUser = async () => {
            try {
                const res = await fetch(`../api/user/fetch-cuser`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error('An error occurred. Please try again');
                }

                const data = await res.json();

                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchClockInData = async () => {
            const email = user.email;
            const token = localStorage.getItem('time-token');

            try {
                const res = await fetch(`../api/user/get-clockin-data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email }),
                });

                if (!res.ok) {
                    throw new Error('An error occurred. Please try again');
                }

                const data = await res.json();

                console.log(data)
                setClockInData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
        fetchClockInData();
    }, []);

    const handleLogOut = () => {
        Cookies.remove('token');
        router.push('/');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-xl">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Analytics</h1>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Day</th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Clocked In</th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Clock In Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">Monday</td>
                                <td className="py-2 px-4 border-b border-gray-200">Yes</td>
                                <td className="py-2 px-4 border-b border-gray-200">08:00 AM</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">Tuesday</td>
                                <td className="py-2 px-4 border-b border-gray-200">Yes</td>
                                <td className="py-2 px-4 border-b border-gray-200">08:05 AM</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">Wednesday</td>
                                <td className="py-2 px-4 border-b border-gray-200">No</td>
                                <td className="py-2 px-4 border-b border-gray-200">-</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">Thursday</td>
                                <td className="py-2 px-4 border-b border-gray-200">Yes</td>
                                <td className="py-2 px-4 border-b border-gray-200">08:10 AM</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">Friday</td>
                                <td className="py-2 px-4 border-b border-gray-200">Yes</td>
                                <td className="py-2 px-4 border-b border-gray-200">08:00 AM</td>
                            </tr>
                        </tbody>
                    </table>
                    <button onClick={handleLogOut} className="bg-gray-500 hover:bg-gray-700 w-full rounded-lg text-white font-medium py-2 mt-4">Logout</button>
                </div>
            </div>
        </main>
    )
};
