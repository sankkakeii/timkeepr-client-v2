import React from 'react';
import Link from 'next/link';
import globalConfig from '@/globalConfig';

const Footer = () => {
    const companyName = globalConfig.site.title;
    const currentYear = new Date().getFullYear(); // Get the current year

    return (
        <footer className="fixed bottom-0 w-full">
            <div className="p-5 md:flex md:items-center md:justify-between">
                <span className="text-sm sm:text-center text-primaryLight mb-2 md:mb-0 md:mr-4">
                    © {currentYear} {/* Use the current year */}
                    <Link href={'/'}>
                        <span className="hover:underline"> {companyName}</span>
                    </Link>
                    . All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
                    <li>
                        <Link href="#">
                            <span className="mr-2 md:mr-4 hover:underline text-primaryLight">
                                About
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="#">
                            <span className="mr-2 md:mr-4 hover:underline text-primaryLight">
                                Privacy Policy
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="#">
                            <span className="mr-2 md:mr-4 hover:underline text-primaryLight">
                                Licensing
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="#">
                            <span className="hover:underline text-primaryLight">
                                Contact
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
