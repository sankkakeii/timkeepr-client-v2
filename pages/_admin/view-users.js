import { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [clockInData, setClockInData] = useState(null);
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

    const fetchClockInData = async (email) => {
        try {
            const token = localStorage.getItem('time-token');
            const res = await fetch('../api/client/get-clock-in-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch clock-in data');
            }

            const data = await res.json();
            setClockInData(data.clockInData.find(user => user.email === email).userStatus);
        } catch (error) {
            setErrorMessage('An error occurred while fetching clock-in data. Please try again');
            console.error(error);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchClockInData(user.email);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setClockInData(null);
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-fit max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <div className="text-gray-600 text-center mb-6">
                        <h1 className="text-xl font-semibold">View Users</h1>
                    </div>
                    <div className="w-full max-h-96 overflow-auto">
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
                                    <tr
                                        className="hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200"
                                        key={i}
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <td className="py-5 px-5 border-b border-gray-200">{user.firstName}</td>
                                        <td className="py-5 px-5 border-b border-gray-200">{user.lastName}</td>
                                        <td className="py-5 px-5 border-b border-gray-200">{user.email}</td>
                                        <td className="py-5 px-5 border-b border-gray-200">{user.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                </div>
            </div>
            <Modal
                isOpen={!!selectedUser}
                onRequestClose={closeModal}
                contentLabel="User Clock-In Data"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                overlayClassName="modal-overlay"
            >
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">Clock-In Data for {selectedUser?.firstName} {selectedUser?.lastName}</h2>
                    <button onClick={closeModal} className="mb-4 bg-red-500 text-white py-1 px-4 rounded-full">Close</button>
                    <div className="max-h-64 overflow-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Date</th>
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
                    </div>
                </div>
            </Modal>
        </main>
    );
}

Modal.setAppElement('#__next');
