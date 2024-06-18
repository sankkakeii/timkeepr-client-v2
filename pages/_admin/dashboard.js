import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/AuthUserContext';
import Layout from '@/components/layout/Layout';
import { DashboardContent } from '@/components/Modular/DemoDashboard/DashboardContent';


export default function Dashboard() {
    const { authUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            setLoading(false);
        }
    }, [authUser, authLoading]);

    if (loading) {
        return <div className="flex justify-center items-center h-80">
            <Spinner />
        </div>;
    }

    return (
        <>
            <SEO
                title="Dashboard"
                description="dashboard overview page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />
            <div>
                <h1 className="text-3xl py-5 font-bold">Dashboard</h1>
                <DashboardContent />
            </div>
        </>
    );
}


Dashboard.layout = Layout;