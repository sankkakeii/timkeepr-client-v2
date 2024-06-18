// MainNavbar component for the main navigation bar
import React from 'react';
import TeamDropdown from '../Modular/admin/TeamDropdown';
import { ModeToggle } from '../ui/toggle-mode';
import { UserNav } from '../Modular/admin/User';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Main navigation bar component for the application.
 * @param {Object} props - The component properties.
 * @param {function} props.toggleSidebar - Function to toggle the sidebar visibility.
 * @param {boolean} props.isSidebarOpen - Flag indicating whether the sidebar is open.
 */
export const MainNavbar = ({ toggleSidebar, isSidebarOpen }) => {
// Toggle the sidebar visibility
function handleToggleSidebar() {
    toggleSidebar(isSidebarOpen);
}

    return (
        <main className="h-20 w-full px-10 flex items-center bg-green-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0">
            <div className="flex items-center justify-between w-full">
                <div className="flex gap-3">
                    <TeamDropdown />
                </div>
                <div className="flex gap-3">
                    <div className="flex gap-3 items-center md:hidden"> {/* Show only on small screens */}
                        <Button
                            variant="outline" size="icon"
                            onClick={handleToggleSidebar}
                            aria-label="Toggle Sidebar"
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>
                    <ModeToggle />
                    <UserNav />
                </div>
            </div>
        </main>
    );
};