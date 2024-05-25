import { useState, useEffect } from 'react';
import Spinner from '../components/spinner';

export default function Register() {
    const [orgType, setOrgType] = useState('');
    const [orgName, setOrgName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('time-token', token);
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orgType, orgName, email, password }),
            });

            if (res.status === 401) {
                setError('Unauthorized access. Please check your credentials');
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (data.auth) {
                setToken(data.token);
                window.location.href = '/clock-in';
            } else {
                setError('Something went wrong. Please try again');
                setLoading(false);
            }
        } catch (error) {
            setError('An error occurred. Please try again');
            setLoading(false);
        }
    };

    return (
        <main className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <div className="text-gray-600 text-center mb-6">
                        <h1 className="text-xl font-semibold">Create your account</h1>
                        <p>Sign up to access your account</p>
                    </div>
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="orgType" className="block mb-2 text-sm font-medium text-gray-700">Organization Type</label>
                            <select id="orgType" name="orgType" className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" required value={orgType} onChange={e => setOrgType(e.target.value)}>
                                <option value="">Select type</option>
                                <option value="Non-Profit">Non-Profit</option>
                                <option value="For-Profit">For-Profit</option>
                                <option value="Government">Government</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="orgName" className="block mb-2 text-sm font-medium text-gray-700">Organization Name</label>
                            <input type="text" name="orgName" id="orgName" className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" placeholder="Your Organization" required value={orgName} onChange={e => setOrgName(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Your email</label>
                            <input type="email" name="email" id="email" className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" placeholder="name@company.com" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                            <input type="password" name="password" id="password" className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                            <input type="password" name="confirmPassword" id="confirmPassword" className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" placeholder="••••••••" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <button type="submit" className="bg-green-500 hover:bg-green-700 w-full rounded-lg text-white font-medium py-2">
                            {loading ? <Spinner /> : 'Sign up'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
