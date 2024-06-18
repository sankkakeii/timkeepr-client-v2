// import Navbar from '@/components/Modular/clockin/Navbar';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Spinner from '@/components/ui/spinner';

// const ClockIn = () => {
//     const [currentTime, setCurrentTime] = useState(null);
//     const [orgClockinTime, setOrgClockinTime] = useState(null);
//     const [userName, setUserName] = useState('');
//     const [userEmail, setUserEmail] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [responseMessage, setResponseMessage] = useState('');
//     const [token, setToken] = useState('');
//     const [clockInLoading, setClockInLoading] = useState(false);
//     const [clockOutLoading, setClockOutLoading] = useState(false);

//     useEffect(() => {
//         setCurrentTime(new Date().toLocaleTimeString());
//         const interval = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

//         const token = localStorage.getItem('time-token');
//         setToken(token);

//         const fetchCurrentUser = async () => {
//             try {
//                 const res = await axios.get(`api/user/fetch-cuser`, {
//                     withCredentials: true,
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     },
//                 });
//                 setUserName(`${res.data.firstName} ${res.data.lastName}`);
//                 setUserEmail(res.data.email);
//             } catch (error) {
//                 setErrorMessage('An error occurred. Please try again');
//                 console.log(error);
//             }
//         };

//         const fetchOrganizationClock = async () => {
//             try {
//                 const res = await axios.get(`api/user/get-clock`, {
//                     withCredentials: true,
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     },

//                 });
//                 setOrgClockinTime(res.data.clockInTime);
//             } catch (error) {
//                 setErrorMessage('An error occurred. Please try again');
//                 console.log(error);
//             }
//         };

//         fetchCurrentUser();
//         fetchOrganizationClock();
//         return () => {
//             clearInterval(interval);
//         };
//     }, []);

//     const clockIn = async () => {
//         setErrorMessage('');
//         setResponseMessage('');
//         setClockInLoading(true);

//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(async (position) => {
//                 const userLocation = [position.coords.latitude, position.coords.longitude];
//                 const body = {
//                     email: userEmail,
//                     userPosition: userLocation,
//                 };
//                 try {
//                     const res = await axios.post(`api/user/clock-in`, body, {
//                         headers: {
//                             'Content-Type': 'application/json',
//                             'Authorization': `Bearer ${token}`
//                         },
//                         withCredentials: true
//                     });
//                     if (!res.data) {
//                         console.error("Response data is not found");
//                         setErrorMessage('Response data is not found');
//                         return;
//                     }
//                     setResponseMessage(res.data.message);
//                 } catch (error) {
//                     setErrorMessage('An error occurred. Please try again');
//                     console.error(error);
//                 } finally {
//                     setClockInLoading(false);
//                 }
//             });
//         } else {
//             setErrorMessage("Geolocation is not supported by this browser.");
//             setClockInLoading(false);
//         }
//     };

//     const clockOut = async () => {
//         setErrorMessage('');
//         setResponseMessage('');
//         setClockOutLoading(true);

//         try {
//             const body = {
//                 email: userEmail,
//             };

//             const res = await axios.post(`api/user/clock-out`, body, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 withCredentials: true
//             });
//             if (!res.data) {
//                 console.error("Response data is not found");
//                 setErrorMessage('Response data is not found');
//                 return;
//             }
//             setResponseMessage(res.data.message);
//         } catch (error) {
//             setErrorMessage('An error occurred. Please try again');
//             console.error(error);
//         } finally {
//             setClockOutLoading(false);
//         }
//     };

//     return (
//         <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
//             <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
//                 <Navbar />
//                 <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
//                     <span className="text-xl font-semibold text-gray-600 mb-2">Good Day</span>
//                     <div className="text-3xl font-bold text-gray-800 mb-4">{userName}</div>
//                     {currentTime && <div className="text-xl font-semibold text-gray-600 mb-2">{`Current Time: ${currentTime}`}</div>}
//                     {orgClockinTime && <div className="text-xl font-semibold text-gray-600 mb-2">{`Clock In Time: ${orgClockinTime}`}</div>}
//                     {responseMessage && <div className="text-lg text-center font-semibold text-green-600 my-3">{responseMessage}</div>}
//                     {errorMessage && <p className="text-red-500 text-center my-3">{errorMessage}</p>}
//                     <div className="mt-5 w-1/2">
//                         <button onClick={clockIn} className={`bg-green-500 hover:bg-green-700 w-full rounded-lg text-white font-medium py-2`} disabled={clockInLoading}>
//                             {clockInLoading ? <Spinner /> : "Clock In"}
//                         </button>
//                         <button onClick={clockOut} className={`mt-3 bg-red-500 hover:bg-red-700 w-full rounded-lg text-white font-medium py-2`} disabled={clockOutLoading}>
//                             {clockOutLoading ? <Spinner /> : "Clock Out"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default ClockIn;













import Navbar from '@/components/Modular/clockin/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '@/components/ui/spinner';

const ClockIn = () => {
    const [currentTime, setCurrentTime] = useState(null);
    const [orgClockinTime, setOrgClockinTime] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [token, setToken] = useState('');
    const [clockInLoading, setClockInLoading] = useState(false);
    const [clockOutLoading, setClockOutLoading] = useState(false);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        const interval = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

        const token = localStorage.getItem('time-token');
        setToken(token);

        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get(`/api/user/fetch-cuser`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                setUserName(`${res.data.firstName} ${res.data.lastName}`);
                setUserEmail(res.data.email);
            } catch (error) {
                setErrorMessage('An error occurred. Please try again');
                console.log(error);
            }
        };

        const fetchOrganizationClock = async () => {
            try {
                const res = await axios.get(`/api/user/get-clock`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                setOrgClockinTime(res.data.clockInTime);
            } catch (error) {
                setErrorMessage('An error occurred. Please try again');
                console.log(error);
            }
        };

        fetchCurrentUser();
        fetchOrganizationClock();
        return () => {
            clearInterval(interval);
        };
    }, []);

    const clockIn = async () => {
        setErrorMessage('');
        setResponseMessage('');
        setClockInLoading(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const userLocation = [position.coords.latitude, position.coords.longitude];

                try {
                    const ipRes = await axios.get(`https://ipapi.co/json/`);
                    const ipLocation = [ipRes.data.latitude, ipRes.data.longitude];

                    const distance = calculateDistance(userLocation, ipLocation);

                    if (distance > 100) { // Consider 100 km as an anomaly threshold
                        setErrorMessage('Location mismatch detected. Please ensure your location settings are correct.');
                        setClockInLoading(false);
                        return;
                    }

                    const body = {
                        email: userEmail,
                        userPosition: userLocation,
                    };

                    const res = await axios.post(`/api/user/clock-in`, body, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true
                    });
                    if (!res.data) {
                        console.error("Response data is not found");
                        setErrorMessage('Response data is not found');
                        return;
                    }
                    setResponseMessage(res.data.message);
                } catch (error) {
                    setErrorMessage('An error occurred. Please try again');
                    console.error(error);
                } finally {
                    setClockInLoading(false);
                }
            });
        } else {
            setErrorMessage("Geolocation is not supported by this browser.");
            setClockInLoading(false);
        }
    };

    const clockOut = async () => {
        setErrorMessage('');
        setResponseMessage('');
        setClockOutLoading(true);

        try {
            const body = {
                email: userEmail,
            };

            const res = await axios.post(`/api/user/clock-out`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if (!res.data) {
                console.error("Response data is not found");
                setErrorMessage('Response data is not found');
                return;
            }
            setResponseMessage(res.data.message);
        } catch (error) {
            setErrorMessage('An error occurred. Please try again');
            console.error(error);
        } finally {
            setClockOutLoading(false);
        }
    };

    const calculateDistance = (loc1, loc2) => {
        const [lat1, lon1] = loc1;
        const [lat2, lon2] = loc2;

        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    };

    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
                    <span className="text-xl font-semibold text-gray-600 mb-2">Good Day</span>
                    <div className="text-3xl font-bold text-gray-800 mb-4">{userName}</div>
                    {currentTime && <div className="text-xl font-semibold text-gray-600 mb-2">{`Current Time: ${currentTime}`}</div>}
                    {orgClockinTime && <div className="text-xl font-semibold text-gray-600 mb-2">{`Clock In Time: ${orgClockinTime}`}</div>}
                    {responseMessage && <div className="text-lg text-center font-semibold text-green-600 my-3">{responseMessage}</div>}
                    {errorMessage && <p className="text-red-500 text-center my-3">{errorMessage}</p>}
                    <div className="mt-5 w-1/2">
                        <button onClick={clockIn} className={`bg-green-500 hover:bg-green-700 w-full rounded-lg text-white font-medium py-2`} disabled={clockInLoading}>
                            {clockInLoading ? <Spinner /> : "Clock In"}
                        </button>
                        <button onClick={clockOut} className={`mt-3 bg-red-500 hover:bg-red-700 w-full rounded-lg text-white font-medium py-2`} disabled={clockOutLoading}>
                            {clockOutLoading ? <Spinner /> : "Clock Out"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ClockIn;
