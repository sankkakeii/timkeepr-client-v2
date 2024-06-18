import React, { useEffect, useState } from 'react';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/AuthUserContext';
import Layout from '@/components/layout/Layout';
import { UpdateProfile } from '@/components/Modular/admin/SettingsComponents/UpdateProfile';
import { UpdateEmail } from '@/components/Modular/admin/SettingsComponents/UpdateEmail'
import { ResetPassword } from '@/components/Modular/admin/SettingsComponents/ResetPassword';
import SubscriptionDetails from '@/components/Modular/admin/SettingsComponents/SubscriptionDetails';
import OrganizationDetails from '@/components/Modular/admin/SettingsComponents/OrganizationDetails';

export default function Settings() {
    const { authUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (!authLoading) {
            setLoading(false);
        }
    }, [authUser, authLoading]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-80">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Settings"
                description="settings page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}`,
                }}
            />
            <h1 className="text-3xl py-5 font-bold">Settings</h1>
            <div className="flex justify-between items-center border-b border-muted">
                <div className="flex space-x-8">
                    <button
                        className={`text-md ${activeTab === 'profile' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-700'
                            } hover:text-green-400`}
                        onClick={() => handleTabChange('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`text-md ${activeTab === 'subscription' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-700'
                            } hover:text-green-400`}
                        onClick={() => handleTabChange('subscription')}
                    >
                        Subscription
                    </button>

                    <button
                        className={`text-md ${activeTab === 'organization' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-700'
                            } hover:text-green-400`}
                        onClick={() => handleTabChange('organization')}
                    >
                        Manage Permissions
                    </button>
                </div>
            </div>
            <div id="active-tab" className="mt-4">
                {/* Render different setting options based on the active tab */}
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'subscription' && <SubscriptionSettings />}
                {activeTab === 'organization' && <ManageOrganization />}
            </div>
        </>
    );
}

const ProfileSettings = () => {
    // Render profile settings here
    return (<div id="profile" className="pt-5 pb-10">
        <UpdateProfile />
        <UpdateEmail />
        <ResetPassword />
    </div>);
};

const SubscriptionSettings = () => {
    // Render subscription settings here
    return <div id="subscription" className="pt-5 pb-10">
        <SubscriptionDetails />
    </div>;
};

const ManageOrganization = () => {
    // Render subscription settings here
    return <div id="organization" className="pt-5 pb-10">
        <OrganizationDetails />
    </div>;
};



Settings.layout = Layout;
