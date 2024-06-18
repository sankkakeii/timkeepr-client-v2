import React, { useEffect, useState } from 'react';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/AuthUserContext';
import Layout from '@/components/layout/Layout';
import { useTeam } from '@/context/TeamContext';
import UserTable from '@/components/Modular/DataTables/UserTable/UserTable';
import { Button } from '@/components/ui/button';
import { UserDialog } from '@/components/Modular/admin/Dialogs/UserDialog';
import PendingUsersTable from '@/components/Modular/DataTables/PendingUsersTable/PendingUsersTable';

export default function MyUsers() {
    const { authUser, loading: authLoading } = useAuth();
    const { activeTeam } = useTeam(); // Access the active team from the context
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
                title="My Users"
                description="my users page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />

            <h1 className="text-3xl py-5 font-bold">My Users</h1>


            <div>
                <Button>
                    <UserDialog type={'create'} />
                </Button>
                <UserTable />
                <h1 className="text-3xl py-5 font-bold">Pending Users</h1>
                <PendingUsersTable />
            </div>
        </>
    );
}
MyUsers.layout = Layout;

