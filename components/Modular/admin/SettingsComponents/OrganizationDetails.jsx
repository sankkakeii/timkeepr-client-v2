import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthUserContext';
import { useState } from 'react';
import { useOrganization } from '@/context/OrganizationContext';
import { NewRoleDialog } from '@/components/Modular/admin/Dialogs/RolesAndPermissions/NewRoleDialog';
import { AddPermissionsDialog } from '@/components/Modular/admin/Dialogs/RolesAndPermissions/AddPermissions';
import { RefreshCcwIcon } from 'lucide-react';
import { RemoveRolesAndPermissionsDialog } from '@/components/Modular/admin/Dialogs/RolesAndPermissions/RemoveRolesAndPermissionsDialog';


const OrganizationDetails = () => {
    const { authUser } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { activeOrganization, refreshOrganizationData } = useOrganization();


    const handleOrganizationDataRefresh = async () => {
        try {
            setIsRefreshing(true);
            console.log('Refreshing organization data...');
            let refreshedOrg = await refreshOrganizationData(authUser.uid);


            setIsRefreshing(prevState => {
                return prevState;
            });

            console.log('Organization data refreshed successfully:');
            setIsRefreshing(false);

        } catch (error) {
            setIsRefreshing(false);
            console.error('Error refreshing user organizations:', error);

        }
    };


    return (
        <main className="">
            <section className="subscription-details border rounded-md p-6 lg:w-1/2 md:w-1/2 w-full mb-8">
                <h1 className="text-2xl font-bold my-8">Organization Details</h1>
                <p className="text-gray-500 mb-2">Organization Name: {activeOrganization.name}</p>
                <p className="text-gray-500 mb-2">Owner: {activeOrganization.owner}</p>
                <p className="text-gray-500 mb-2">Department: {activeOrganization.department}</p>

                <div className="flex items-center gap-3">
                    <Button onClick={() => console.log('Edit Details')}>Edit Details</Button>

                    <Button className="bg-blue-400 hover:bg-blue-500" onClick={() => handleOrganizationDataRefresh()}><RefreshCcwIcon
                        className={`mr-2 h-5 w-5 text-white ${isRefreshing ? 'spin' : ''}`}
                    />Refresh Organization</Button>
                </div>
            </section>

            {/* Roles and Permissions Section */}
            <section className="roles-permissions border rounded-md p-6 lg:w-1/2 md:w-1/2 w-full">
                <div className="flex flex-col gap-2 mb-4 w-fit">
                <h2 className="text-xl font-bold">Roles and Permissions</h2>
                <NewRoleDialog />
                </div>

                {/* Display Permissions for Each Role */}
                {Object.keys(activeOrganization.roles || {}).map((roleKey) => (
                    <div key={roleKey} className="mb-6 p-4 border rounded-md">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold mb-4">{activeOrganization.roles[roleKey].label}</h3>
                            {authUser.data.role.key === 'superuser' || authUser.data.role.key === 'admin' ? (
                                <div className="flex gap-2 w-full items-center mb-3 py-3 rounded">
                                    <AddPermissionsDialog roleKey={roleKey} />
                                    <RemoveRolesAndPermissionsDialog label={'Remove Role'} option={'role'} roleKey={roleKey} activeOrganizationId={activeOrganization.id} />
                                </div>
                            ) : null}
                        </div>
                        <div className="flex justify-between">
                            <div>
                                {/* Display permissions checkboxes for each role */}
                                {(activeOrganization.roles[roleKey].permissions || []).map((permission) => (
                                    <div key={permission} className="flex items-center mb-2">
                                        <div className="flex items-center w-full gap-2">
                                            <RemoveRolesAndPermissionsDialog label={'Remove Permission'} option={'permission'} roleKey={roleKey} permission={permission} activeOrganizationId={activeOrganization.id} />
                                            <input
                                            type="checkbox"
                                            onChange={() => console.log('changed')}
                                            checked={false} // Add logic when you have time
                                            className=""
                                        />
                                            <label>{permission}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );


};

export default OrganizationDetails;
