import React from 'react';
import { useRouter } from 'next/router';
import { ChevronLeftSquare } from 'lucide-react';

export default function BackContainer({ children }) {
    const router = useRouter();
    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className={"transition-all duration-200 ease-in-out py-5"}>
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
            {children}
        </div>
    )
}
