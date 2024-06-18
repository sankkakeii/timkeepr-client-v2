import React, { useEffect, useState } from 'react';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/AuthUserContext';
import Layout from '@/components/layout/Layout';
import TeamTable from '@/components/Modular/DataTables/TeamTable/TeamTable';
import { Button } from '@/components/ui/button';
import { TeamDialog } from '@/components/Modular/admin/Dialogs/TeamDialog';


export default function Teams() {
    const { authUser, loading: authLoading } = useAuth();
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
                title="Teams"
                description="Teams overview page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />
            <div>
                <h1 className="text-3xl py-5 font-bold">Teams</h1>
                <Button>
                    <TeamDialog type={'create'} authUser={authUser} />
                </Button>
                <TeamTable />
            </div>
        </>
    );
}


Teams.layout = Layout;