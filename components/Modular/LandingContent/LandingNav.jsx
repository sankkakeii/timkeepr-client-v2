import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/toggle-mode';
import { useAuth } from '@/context/AuthUserContext';
import globalConfig from '@/globalConfig';

export default function Nav() {
    const {authUser} = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.mobile-nav')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);

    const handleButtonClick = (event) => {
        event.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    let buttonText, buttonLink;

    if (authUser) {
        if (authUser.data.role.key === 'admin' || authUser.data.role.key === 'superuser') {
            buttonText = 'Go to Dashboard';
            buttonLink = '/_admin/dashboard';
        } else if (authUser.data.role.key === 'user') {
            buttonText = 'Profile';
            buttonLink = `/_profile/${authUser.uid}`;
        }
    } else {
        buttonText = 'Sign In';
        buttonLink = '/auth/sign-in';
    }

    return (
        <main>
            {/* Original (desktop) navigation */}
            <div className={`lg:flex lg:gap-4 lg:justify-center lg:items-center hidden sm:block`}>
                <div className="lg:w-full">
                    <div className="flex gap-80 h-16 p-5 px-16 w-full from-white via-white dark:from-black dark:via-black">
                        <Link href={'/'} className="flex gap-2 justify-center items-center text-foreground">
                            <Image src="/vercel.svg" alt="Sameframe Logo" width={30} height={30} priority />
                            <p className="font-semibold">{globalConfig.site.title}</p>
                        </Link>
                        <div></div>
                        <div className="flex gap-4 justify-center items-center font-semibold">
                            <nav className="">
                                <ul className="flex gap-4 items-center">
                                    <li className="cursor-pointer hover:text-primary hover:underline"><a href="/templates">Templates</a></li>
                                    <li className="cursor-pointer hover:text-primary hover:underline"><a href="/docs">Documentation</a></li>
                                    <li className="cursor-pointer hover:text-primary hover:underline"><a href="/blog">Blog</a></li>
                                    <Button>
                                        <Link href={buttonLink}>{buttonText}</Link>
                                    </Button>
                                </ul>
                            </nav>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile navigation */}
            <div className={`lg:hidden fixed top-0 left-0 w-full ${menuOpen ? 'z-50' : 'z-0'}`}>
                <div className="fixed top-0 left-0 w-full h-16 p-5 px-6 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-50 mobile-nav">
                    <div className="flex items-center justify-between">
                        <Link href={'/'} className="flex gap-2 items-center text-foreground">
                            <Image src="/vercel.svg" alt="Sameframe Logo" width={30} height={30} priority />
                            <p className="font-semibold">{globalConfig.site.title}</p>
                        </Link>
                        <div className="lg:hidden flex gap-3">
                            <button onClick={handleButtonClick} className="text-2xl text-foreground focus:outline-none">
                                &#9776;
                            </button>
                            <ModeToggle />
                        </div>
                    </div>
                    <nav
                        className={`lg:flex lg:items-center lg:justify-center w-full absolute left-0 top-full  bg-gray-50 dark:bg-black p-4 transition-transform duration-300 transform ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px]'}
                        `}
                    >
                        <ul className="flex flex-col gap-4 lg:flex-row lg:gap-4 items-center">
                            <li className="cursor-pointer hover:text-primary hover:underline"><a href="/templates">Templates</a></li>
                            <li className="cursor-pointer hover:text-primary hover:underline"><a href="/docs">Documentation</a></li>
                            <Button>
                                <Link href={buttonLink}>{buttonText}</Link>
                            </Button>
                        </ul>
                    </nav>
                </div>
            </div>
        </main>
    );
}
