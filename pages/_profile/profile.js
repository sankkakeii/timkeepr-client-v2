import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const [token, setToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('time-token');
        setToken(token);

        const fetchUser = async () => {
            try {
                // const res = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}user/get-cuser`, {
                // });

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
                setEmail(data.email);
            } catch (error) {
                setErrorMessage(error.message);
                console.log(error);
            }
        };

        fetchUser();
    }, []);

    const handleClockOut = async () => {
        const body = {
            email: email,
        };
        console.log(body);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}user/clock-out`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error('An error occurred while clocking out. Please try again.');
            }

            const data = await res.json();
            alert(data.message); // You can handle the response as you wish, e.g., show a notification
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleLogOut = () => {
        Cookies.remove('token');
        router.push('/');
    };

    if (!user) {
        return <div>Loading</div>;
    }

    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <h1 className="text-2xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h1>
                    <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                    <p className="text-sm text-gray-500 mb-4">{user.phone}</p>
                    <p className="text-sm text-gray-500 mb-4">Status: {user.status}</p>
                    <div className="w-full flex flex-col space-y-4">
                        <button className="bg-blue-500 hover:bg-blue-700 w-full rounded-lg text-white font-medium py-2">Request Break</button>
                        <button onClick={handleClockOut} className="bg-red-500 hover:bg-red-700 w-full rounded-lg text-white font-medium py-2">Clock Out</button>
                        <Link href='/_profile/analytics'>
                            <button className="bg-yellow-500 hover:bg-yellow-700 w-full rounded-lg text-white font-medium py-2">Analytics</button>
                        </Link>
                        <button onClick={handleLogOut} className="bg-gray-500 hover:bg-gray-700 w-full rounded-lg text-white font-medium py-2">Logout</button>
                    </div>
                </div>
            </div>
        </main>
    );
}
