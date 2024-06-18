import React, { useState, useEffect } from 'react';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/context/AuthUserContext';
import { useToast } from '@/components/ui/use-toast';
import { TeamLogic } from '@/lib/business_logic/team_logic/team-logic';
import { Spinner } from '@/components/ui/spinner';

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
            Welcome to Your App!
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8 text-center">
            Step 1 Paragraph - Get started by creating your first team.
        </p>
        <div className="button-section flex flex-col gap-4">
            <Button onClick={onNext} className="w-full md:w-auto">
                Next
            </Button>
        </div>
    </motion.div>
);



const CreateTeamSection = ({ onCreateTeam, onSkip }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [owner, setOwner] = useState('');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);

    const { authUser } = useAuth();
    const { toast } = useToast();
    const teamLogic = TeamLogic();

    const formVariants = {
        hidden: { opacity: 0, x: 300 },
        visible: { opacity: 1, x: 0 },
        transition: { duration: 100, ease: 'easeInOut' },
    };


    const handleCreateTeam = async () => {
        try {
            setLoading(true);
            setIsFormVisible(true);

            // Check if the required fields are not empty
            if (!teamName || !owner || !department) {
                toast({ title: 'Attention!', description: 'Please fill in all fields' });
                return;
            }

            // New logic for creating a team without the dialog
            const result = await teamLogic.createTeam(authUser, teamName, owner, department);
            if (result.type === 'success') {
                toast({ title: 'success', description: result.message });
                // Additional actions after successful team creation
                onSkip();
            } else {
                toast({ title: 'error', description: result.message });
                // Handle error appropriately
            }
        } catch (error) {
            console.error('Error creating team:', error);
            toast({ title: 'error', description: `Error creating team: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="create-team-section flex flex-col items-center justify-center">
            <div className="team-main flex gap-4 w-full">
                <div className="team-onboarding flex flex-col items-center justify-center px-10">
                    <Image
                        src="/images/teamwork.png"
                        width={300}
                        height={300}
                        alt="Team Image"
                        className="rounded-full"
                    />
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
                        Create Your Team
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-600 mb-8 text-center">
                        Step 2 Paragraph - Customize as needed
                    </p>
                    <div className="button-section flex flex-col gap-4">
                        <Button onClick={handleCreateTeam} className="w-full md:w-auto">
                            Create Team
                        </Button>
                        <Button variant="skip" onClick={onSkip}>
                            <span>Skip</span>
                        </Button>
                    </div>
                </div>

                <motion.div
                    className={`team-form flex flex-col justify-center px-10 bg-green-100 bg-opacity-10 rounded shadow ${!isFormVisible ? 'hidden' : ''
                        }`}
                    variants={formVariants}
                    initial="hidden"
                    animate={isFormVisible ? 'visible' : 'hidden'}
                >
                    {isFormVisible && (
                        <>
                            <Image
                                src="/vercel.svg"
                                width={30}
                                height={30}
                                alt="Team Image"
                                className="py-3"
                            />
                            <h1 className="text-4xl font-bold mb-6 text-center">
                                Create Your Team
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 text-center">
                                Create Your First Team Here
                            </p>
                            <div className="space-y-4 py-2 pb-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Team name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Pick Team Name"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="owner">Owner</Label>
                                    <Input
                                        id="owner"
                                        placeholder="Owner Name"
                                        value={owner}
                                        onChange={(e) => setOwner(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        placeholder="Department Name"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="button-section flex flex-col gap-4">
                                <Button type="submit" disabled={loading} onClick={handleCreateTeam} className="w-full md:w-auto">
                                    {loading ? (
                                        <Spinner />
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

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
            Welcome to the community!
        </p>
        <Button onClick={onGoToProfile}>
            <span>Go to Dashboard</span>
        </Button>
    </motion.div>
);

function Onboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showCongratulations, setShowCongratulations] = useState(false);

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

    const handleCreateTeam = () => {
        setLoading(true);
    };

    const handleGoToProfile = () => {
        window.location.href = '/_admin/dashboard';
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

                {step === 2 && (
                    <CreateTeamSection onCreateTeam={handleCreateTeam} onSkip={handleNext} />
                )}

                {step === 3 && showCongratulations && (
                    <CongratulationsSection onGoToProfile={handleGoToProfile} />
                )}
            </div>
        </>
    );
}

export default Onboarding;