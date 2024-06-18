
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [currentTime, setCurrentTime] = useState(null);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        const interval = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <nav className="absolute w-full z-20 bg-white border-gray-200 dark:bg-gray-900">
            {/* // <nav className="fixed w-full z-20 bg-white border-gray-200 dark:bg-gray-900"> */}
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="" className="flex items-center">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Timekeepr</span>
                </a>
                <ul className="font-medium flex flex-col md:p-0 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <li className="p-2 text-green-500 hover:bg-green-700 rounded-md hover:shadow-lg hover:text-white">
                        <Link href="/_profile/profile" className="block py-2 pl-3 pr-4 bg-green-700 rounded  hover:text-white  md:p-0" aria-current="page">Profile</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

