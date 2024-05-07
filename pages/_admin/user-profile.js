import Image from 'next/image';

export default function UserProfile() {
    const user = {
        email: 'johndoe@company.com', 
        firstName: 'John', 
        lastName: 'Doe', 
        phone: '123-456-7890',
        status: 'Clocked In',
        image: '/profile.jpg', // Update with your actual image path
        attendance: 95, // Attendance in percentage
        breakRequest: 'Pending', // Break request status
    };

    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <Image src={user.image} alt="User Profile Image"  width={70} height={70} className="rounded-full object-cover mb-4" />
                    <h1 className="text-2xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h1>
                    <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                    <p className="text-sm text-gray-500 mb-4">{user.phone}</p>
                    <p className="text-sm text-gray-500 mb-4">Status: {user.status}</p>
                    <p className="text-sm text-gray-500 mb-4">Attendance: {user.attendance}%</p>
                    <div className="w-full flex flex-col space-y-4">
                        <p className="text-sm text-gray-500 mb-4">Break Request: {user.breakRequest}</p>
                        <button className="bg-green-500 hover:bg-green-700 w-full rounded-lg text-white font-medium py-2">Accept Break Request</button>
                        <button className="bg-red-500 hover:bg-red-700 w-full rounded-lg text-white font-medium py-2">Reject Break Request</button>
                        <button className="bg-blue-500 hover:bg-blue-700 w-full rounded-lg text-white font-medium py-2">View Attendance Analytics</button>
                        <button className="bg-yellow-500 hover:bg-yellow-700 w-full rounded-lg text-white font-medium py-2">Settings</button>
                    </div>
                </div>
            </div>
        </main>
    )
}
