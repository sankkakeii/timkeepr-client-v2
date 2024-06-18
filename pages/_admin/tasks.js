import React, { useEffect, useState } from 'react';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/AuthUserContext';
import Layout from '@/components/layout/Layout';
import { useTeam } from '@/context/TeamContext';
import TaskTable from '@/components/Modular/DataTables/TaskTable/TaskTable';
import { TaskDialog } from '@/components/Modular/admin/Dialogs/TaskDialog';
import { Button } from '@/components/ui/button';

export default function Tasks() {
    const { authUser, loading: authLoading } = useAuth();
    const { activeTeam } = useTeam();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            setLoading(false);
        }
    }, [authUser, authLoading]);

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
                title="Tasks"
                description="tasks page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />

            <h1 className="text-3xl py-5 font-bold">Tasks</h1>
            {activeTeam ? (
                <div>
                    <Button>
                        <TaskDialog type={'create'} activeTeam={activeTeam} />
                    </Button>
                    <TaskTable activeTeam={activeTeam} />
                </div>
            ) : (
                <p className="text-red-400">
                    Create or select a team to interact with this section.
                </p>
            )}
        </>
    );
}

Tasks.layout = Layout;
