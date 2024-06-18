import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthUserContext";
import { Spinner } from '../ui/spinner';
import { MainNavbar } from './MainNavbar';
import { useTheme } from '../Theme-Provider';
import { Toaster } from '@/components/ui/toaster';
import DashboardContentMain from '../Modular/Containers/DashboardContentMain';

/**
 * Functional component for the layout.
 * Manages the main structure of the application layout, including sidebar, navbar, and content.
 * @param {Object} children - The components or content to be rendered within the layout.
 */
function Layout({ children }) {
  // State variables for managing sidebar visibility and transitions
  const [showSidebar, setShowSidebar] = useState(true);

  // Authentication and routing related hooks
  const { authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  // Theme related hook
  const { collapsed } = useTheme();

  // Effect hook to redirect unauthorized users to the sign-in page
  useEffect(() => {
    if (!authLoading) {
      if (!authUser || authUser.data.role.key === 'user') {
        router.push('/auth/sign-in');
      }
    }
  }, [authUser, authLoading, router]);

  // Effect hook to initialize sidebar state from local storage
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarOpen');
    setShowSidebar(storedState === 'true');

    const handleStorage = () => {
      const storedState = localStorage.getItem('sidebarOpen');
      setShowSidebar(storedState === 'true');
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Effect hook to update local storage when sidebar state changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', showSidebar);
  }, [showSidebar]);

/**
 * Function to handle toggling the sidebar visibility on smaller displays.
 */
const handleToggleSidebar = () => {
  setShowSidebar(!showSidebar);
};

  // Loading state, show spinner while checking authentication status
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>;
  }

  // Main layout structure
  return (
    <div className="min-h-screen p-0 m-0 md:grid relative">
      <div className={collapsed ? 'md:grid h-screen transition-all duration-700 ease-in-out grid-cols-sidebar-collapsed' : 'md:grid h-screen transition-all duration-700 ease-in-out grid-cols-sidebar'}>
        {authUser &&
          // Sidebar component with conditional rendering based on showSidebar state
          <div className={`z-30 ${!showSidebar ? 'hidden md:block' : ''}`}>
            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          </div>
        }
        {/* Main content area */}
        <div className="md:col-start-2 overflow-y-auto min-h-screen bg-light">
          {authUser && <MainNavbar toggleSidebar={handleToggleSidebar} isSidebarOpen={showSidebar} />}
          {authUser && <DashboardContentMain>
            {authUser && children}
          </DashboardContentMain>}
          {/* Toast notifications */}
          <Toaster />
        </div>
      </div>
    </div>
  );
}

// Exporting the Layout component as the default export
export default Layout;
