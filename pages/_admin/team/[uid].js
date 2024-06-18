import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/AuthUserContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function TeamInfo() {
    const { authUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Get the team id from the route parameter
    const { teamId } = router.query;

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

    // For demonstration purposes, let's create a dummy team object
    const team = {
        createdBy: "demo-id",
        department: "Fashion",
        name: "Dummy Team",
        owner: "John Doe",
        members: [],
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return (
        <>
            <SEO
                title={team.name}
                description={`Team info page for ${team.name}`}
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/teams/${teamId}`,
                }}
            />
            <div className="flex flex-col flex-grow mx-10">
                <div className="flex flex-col flex-grow">
                    <div>
                        <h1 className="text-3xl py-5 font-bold">Team Information</h1>
                        <Card>
                            <CardHeader className="grid items-start gap-4 space-y-0">
                                <Avatar src={team.owner.photoURL} alt={team.owner.displayName} size="large" />
                                <div className="space-y-1">
                                    <CardTitle>{team.name}</CardTitle>
                                    <CardDescription>{team.department}</CardDescription>
                                    <Badge variant={team.status === 'active' ? 'green' : 'red'}>{team.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <table className="w-full text-sm text-muted-foreground">
                                    <tbody>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">Owner</td>
                                            <td className="py-2 pl-4">{team.owner.displayName}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">Members</td>
                                            <td className="py-2 pl-4">{team.members.length}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">Created at</td>
                                            <td className="py-2 pl-4">{new Date(team.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">Updated at</td>
                                            <td className="py-2 pl-4">{new Date(team.updatedAt).toLocaleDateString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

TeamInfo.layout = Layout;
