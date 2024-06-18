import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SubscriptionDetails = () => {
    // Dummy data for the current plan
    const currentPlan = {
        name: "Gold Plan",
        duration: "1 Month",
        nextBilling: "December 1, 2023",
    };

    return (
        <main className="">
                <section className="subscription-details border rounded-md p-6 lg:w-1/2 md:w-1/2 w-full">
                    <h1 className="text-2xl font-bold my-8">Subscription Details</h1>
                    <Card className="flex flex-col bg-none">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{currentPlan.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 mb-2">Current Plan: {currentPlan.name}</p>
                            <p className="text-gray-500 mb-2">Duration: {currentPlan.duration}</p>
                            <p className="text-gray-500 mb-2">Next Billing Period: {currentPlan.nextBilling}</p>
                        </CardContent>
                        <div className="flex justify-between p-4">
                            <Link href="/plan-details">
                                <p className="text-blue-500 hover:underline">Plan Details</p>
                            </Link>
                            <Button onClick={() => handleUpgrade(currentPlan)}>Upgrade Plan</Button>
                        </div>
                    </Card>
                </section>
        </main>
    );
};

// Function to handle the upgrade button click
const handleUpgrade = (currentPlan) => {
    // Dummy logic for upgrading plan
    console.log(`Upgrade plan logic for ${currentPlan.name} goes here`);
};

export default SubscriptionDetails;
