import React, { useState, useEffect } from 'react';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/context/AuthUserContext';

const WelcomeSection = ({ onNext }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="welcome-section flex flex-col items-center justify-center"
    >
        <Image
            src="/images/welcome.png"
            width={300}
            height={300}
            alt="Team Image"
            className="rounded-full"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            Welcome to Sameframe!
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8 text-center">
            Get your ideas off the ground in weeks!.
        </p>
        <div className="button-section flex flex-col gap-4">
            <Button onClick={onNext} className="w-full md:w-auto">
                Next
            </Button>
        </div>
    </motion.div>
);

const ProfileSection = ({ onNext }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="welcome-section flex flex-col items-center justify-center"
    >
        <Image
            src="/images/profile.png"
            width={150}
            height={150}
            alt="Team Image"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            Explore Your Profile!
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8 text-center">
            Check out all the amazing features we have for you.
        </p>
        <div className="button-section flex flex-col gap-4">
            <Button onClick={onNext} className="w-full md:w-auto">
                Next
            </Button>
        </div>
    </motion.div>
);

const CongratulationsSection = ({ onGoToProfile }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="congratulations-section flex flex-col items-center justify-center"
    >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            Congratulations!
        </h1>
        <Image
            src="/images/celebration.png"
            width={300}
            height={300}
            alt="Celebration Image"
            className="mb-8 rounded-full"
        />
        <p className="text-lg md:text-2xl text-gray-600 mb-8 text-center">
            You are ready to explore. Welcome to the community!
        </p>
        <Button onClick={onGoToProfile}>
            <span>Go to Profile</span>
        </Button>
    </motion.div>
);

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [showCongratulations, setShowCongratulations] = useState(false);
    const { authUser } = useAuth();

    useEffect(() => {
        if (step === 3 && !showCongratulations) {
            setShowCongratulations(true);
        }
    }, [step, showCongratulations]);

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            console.log('Onboarding completed!');
        }
    };

    const handleGoToProfile = () => {
        window.location.href = `/_profile/${authUser.uid}`;
    };

    return (
        <>
            <SEO
                title="Welcome - Onboarding page"
                description="Onboarding page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />
            <div className="min-h-screen flex flex-col items-center justify-center">
                {step === 1 && <WelcomeSection onNext={handleNext} />}

                {step === 2 && <ProfileSection onNext={handleNext} />}

                {step === 3 && showCongratulations && (
                    <CongratulationsSection onGoToProfile={handleGoToProfile} />
                )}
            </div>
        </>
    );
};

export default Onboarding;