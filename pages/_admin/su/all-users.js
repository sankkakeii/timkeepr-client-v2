import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/AuthUserContext';
import Layout from '@/components/layout/Layout';
import { useTeam } from '@/context/TeamContext';
import UserTable from '@/components/Modular/DataTables/UserTable/UserTable';

export default function AllUsers() {
    const { authUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const { activeTeam } = useTeam(); // Access the active team from the context
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            setLoading(false);
        }
    }, [authUser, authLoading]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Spinner />
        </div>;
    }

    return (
        <>
            <SEO
                title="All Users"
                description="all users page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />
            <div>
                <h1 className="text-3xl py-5 font-bold">All Users</h1>
            </div>
            {activeTeam && (
                <div>

                </div>
            )}
        </>
    );
}

AllUsers.layout = Layout;