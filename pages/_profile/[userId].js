import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';


export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();


    useEffect(() => {
        const fetchUser = async () => {
            // Get the token from the cookie
            const token = Cookies.get('token');
            console.log(token)

            try {
                const res = await axios.get('http://localhost:5001/api/user/get-cuser', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                setUser(res.data);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status < 500) {
                    setErrorMessage('An error occurred. Please try again');
                    console.log(error);
                }
            }
        };

        fetchUser();
    }, []);


    const handleClockOut = async () => {
        console.log('clock out clicked')
        const token = Cookies.get('token');
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_TIMEKEEPR_API}user/clock-out`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            alert(res.data.message); // You can handle the response as you wish, e.g., show a notification
        } catch (error) {
            console.error(error);
            alert('An error occurred while clocking out. Please try again.');
        }
    }

    const handleLogOut = () => {
        Cookies.remove('token');
        router.push('/login');
    }



    if (!user) {
        return <div>Loading</div>;
    }

    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <Image src={user.image} alt="User Profile Image" width={70} height={70} className="rounded-full object-cover mb-4" />
                    <h1 className="text-2xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h1>
                    <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                    <p className="text-sm text-gray-500 mb-4">{user.phone}</p>
                    <p className="text-sm text-gray-500 mb-4">Status: {user.status}</p>
                    <div className="w-full flex flex-col space-y-4">
                        <button className="bg-blue-500 hover:bg-blue-700 w-full rounded-lg text-white font-medium py-2">Request Break</button>
                        <button onClick={handleClockOut} className="bg-red-500 hover:bg-red-700 w-full rounded-lg text-white font-medium py-2">Clock Out</button>
                        <button className="bg-yellow-500 hover:bg-yellow-700 w-full rounded-lg text-white font-medium py-2">Analytics</button>
                        <button onClick={handleLogOut} className="bg-gray-500 hover:bg-gray-700 w-full rounded-lg text-white font-medium py-2">Logout</button>
                    </div>

                </div>
            </div>
        </main>
    );
}

