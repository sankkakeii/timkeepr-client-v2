import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Analytics() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [clockInData, setClockInData] = useState(null);
    const [latenessRatio, setLatenessRatio] = useState({ late: 0, onTime: 0 });

    const LATE_TIME = new Date();
    LATE_TIME.setHours(12, 24, 0, 0);

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

        fetchUser();
    }, []);

    const fetchClockInData = async () => {
        try {
            const res = await fetch('../api/user/get-clock-in-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: user.email }) // assuming the user object has an email property
            });

            if (!res.ok) {
                throw new Error('Failed to fetch clock-in data');
            }

            const data = await res.json();
            setClockInData(data.userStatus); // set the userStatus array directly
            console.log(data); // Log the response for debugging
            calculateLatenessRatio(data.userStatus); // Calculate lateness ratio
        } catch (error) {
            console.error('Error fetching clock-in data:', error);
        }
    };

    const calculateLatenessRatio = (data) => {
        let lateCount = 0;
        let onTimeCount = 0;

        data.forEach(entry => {
            if (entry.timestamps.length > 0) {
                const firstClockInTime = new Date(entry.timestamps[0].clockInTime);
                if (firstClockInTime > LATE_TIME) {
                    lateCount++;
                } else {
                    onTimeCount++;
                }
            }
        });

        const total = lateCount + onTimeCount;
        setLatenessRatio({
            late: (lateCount / total) * 100,
            onTime: (onTimeCount / total) * 100
        });
    };

    const handleLogOut = () => {
        Cookies.remove('token');
        router.push('/');
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    const data = {
        labels: ['Late', 'On Time'],
        datasets: [
            {
                label: 'Lateness Ratio',
                data: [latenessRatio.late, latenessRatio.onTime],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB']
            }
        ]
    };

    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-xl">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Analytics</h1>
                    <button onClick={fetchClockInData}>Refresh</button>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Day</th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Clocked In</th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Clock In Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clockInData ? (
                                clockInData.map((entry, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b border-gray-200">{formatDate(entry.date)}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{entry.clockedIn ? 'Yes' : 'No'}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{entry.timestamps.length > 0 ? formatTime(entry.timestamps[0].clockInTime) : '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="py-2 px-4 border-b border-gray-200" colSpan="3">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="w-full mt-6 flex flex-col gap-3 items-center justify-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Lateness Ratio</h2>
                        <div className="w-[200px] h-[200px]">
                            <Pie className="" data={data} />
                        </div>
                    </div>
                    <button onClick={handleLogOut} className="bg-gray-500 hover:bg-gray-700 w-full rounded-lg text-white font-medium py-2 mt-4">Logout</button>
                </div>
            </div>
        </main>
    );
}

