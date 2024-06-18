import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/AuthUserContext';
import Layout from '@/components/layout/Layout';
import { useTeam } from '@/context/TeamContext';
import { NewMemberDialog } from '@/components/Modular/admin/Dialogs/CreateDialogs/NewMemberDialog';
import MembersTable from '@/components/Modular/DataTables/MembersTable/MembersTable';

export default function Members() {
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
        return <div className="flex justify-center items-center h-80">
            <Spinner />
        </div>;
    }

    return (
        <>
            <SEO
                title="Members"
                description="members page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />

            <h1 className="text-3xl py-5 font-bold">Members</h1>

            {activeTeam ? (
                <div>
                    <NewMemberDialog />
                    <MembersTable activeTeam={activeTeam} />
                </div>
            ) : (
                <p className="text-red-400">
                    Create or select a team to interact with this section.
                </p>
            )}
        </>
    );
}


Members.layout = Layout;
