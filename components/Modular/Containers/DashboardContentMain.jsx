import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthUserContext';
import { ChevronLeftSquare } from 'lucide-react';

export default function DashboardContentMain({ children }) {
    const router = useRouter();
    const { authUser, authLoading } = useAuth();


    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/auth/sign-in');
        }
    }, [authUser, authLoading, router]);

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className={"transition-all duration-200 ease-in-out"}>
            <div className="flex items-center mx-10">
                <button
                    onClick={handleGoBack}
                    aria-label="Go back"
                    className={"uppercase flex items-center hover:text-textLight transition-transform duration-300 ease-in-out transform hover:-translate-x-1"}
                >
                    <div className="flex gap-2 justify-center items-center text-primary">
                    <ChevronLeftSquare />
                    <span className="font-bold">Go back</span>
                    </div>
                </button>
            </div>
            <div className="flex flex-col flex-grow mx-10">
                <div className="flex flex-col flex-grow">
                    <div>
                        {children}
                    </div>
                </div>
            </div>
            {/* {children} */}
        </div>
    )
}
