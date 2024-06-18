import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthUserContext';
import { adminNavItems, superAdminNavItems } from './NavItems';
import { useOnClickOutside } from 'usehooks-ts';
import classNames from 'classnames';
import globalConfig from '@/globalConfig';
import Image from 'next/image';
import { useTheme } from '../Theme-Provider';
import { ChevronsLeft, ChevronsRight, PowerSquare } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Sidebar component for the application.
 * Manages the sidebar navigation, collapse/expand functionality, and user sign-out.
 * @param {Object} props - The component properties.
 * @param {boolean} props.showSidebar - Flag indicating whether the sidebar is visible.
 * @param {function} props.setShowSidebar - Function to toggle the sidebar visibility.
 */
const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const ref = useRef(null);
  const router = useRouter();
  const { authUser, signOut } = useAuth();
  const { collapsed, setCollapsed } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDoneCollapsing, setIsDoneCollapsing] = useState(false);
  const [navItems, setNavItems] = useState([]);

  // Effect to handle transitions when showing/hiding the sidebar
  useEffect(() => {
    if (showSidebar) {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [showSidebar]);

  // Effect to set navigation items based on user role
  useEffect(() => {
    const userRole = authUser?.data?.role;

    if (userRole) {
      setNavItems(userRole.key === 'superuser' ? superAdminNavItems : adminNavItems);
    } else {
      // Handle the case where authUser or authUser.data is undefined
      // You can set default nav items or take other appropriate action
    }
  }, [authUser]);

  // Function to handle user sign-out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  // Hook to close the sidebar when clicking outside of it
  useOnClickOutside(ref, () => {
    setShowSidebar(false);
  });

  // Effect to adjust body overflow based on sidebar visibility
  useEffect(() => {
    document.body.style.overflow = showSidebar ? 'hidden' : 'auto';
  }, [showSidebar]);

  // Effect to handle transitions when collapsing/expanding the sidebar
  useEffect(() => {
    if (collapsed) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
        setIsDoneCollapsing(true);
      }, 900);
    } else {
      setIsDoneCollapsing(false);
    }
  }, [collapsed]);

  // Calculate sidebar width and select collapse/expand icon
  const sidebarWidth = collapsed ? 'w-[65px]' : `w-[209px]`;
  const Icon = collapsed ? ChevronsRight : ChevronsLeft;


  return (
    <motion.div
      className={classNames(
        sidebarWidth,
        'flex flex-col justify-between min-h-screen transition-all duration-700 ease-in-out overflow-x-hidden bg-green-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0 border-r border-muted',
        { 'fixed top-0 left-0 z-20 shadow-sm': showSidebar, '-left-full': !showSidebar }
      )}
      ref={ref}
      initial={{ opacity: 0, x: '-100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-100%' }}
    >
      {/* Logo and Site Title */}
      <motion.div
        className={classNames('flex items-center px-5 gap-2 h-20 transition-transform duration-300 ease-in-out transform hover:scale-105', { 'ml-0 gap-0': collapsed })}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <button
          className="flex-shrink-0 max-w-[55px]"
          onClick={() => router.push('/_admin/dashboard')}
          aria-label="Home"
          title="Go to Dashboard"
        >
          <Image
            src={globalConfig.site.logo}
            alt="Logo"
            width={collapsed ? 32 : 32}
            height={collapsed ? 32 : 32}
            className={classNames({
              '': !collapsed,
              'flex items-center justify-center opacity-100 transition-opacity duration-200 ease-in-out': collapsed,
            })}
          />
        </button>
        <button
          onClick={() => router.push('/_admin/dashboard')}
          className={classNames('uppercase md:block text-md cursor-pointer font-sans transition-opacity duration-200 ease-in-out whitespace-nowrap', {
            'opacity-0': collapsed,
            'opacity-100 delay-300': !collapsed && !isTransitioning,
          })}
        >
          {globalConfig.site.title}
        </button>
      </motion.div>

      {/* Navigation Menu */}
      <motion.nav className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="py-2 flex flex-col gap-2 h-full">
          {navItems.map((item, index) => {
            const isActive = router.pathname === item.href;
            return (
              <Link key={index} href={item.href}>
                <motion.li
                  className={classNames('flex flex-nowrap items-center p-2 mx-3 rounded-lg', {
                    'justify-center': collapsed && isDoneCollapsing,
                    'gap-4': !collapsed && !isTransitioning,
                    'bg-secondary shadow-sm hover:shadow-lg hover:scale-105': isActive,
                    'bg-primary text-textLight shadow hover:shadow-sm hover:scale-105': isActive,
                    'hover:bg-primaryLight hover:text-textLight hover:shadow-sm hover:scale-105': !isActive,
                    'hover:bg-secondary hover:text-textLight hover:shadow-sm hover:scale-105': !isActive,
                  })}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <motion.span
                    className={classNames('transition-transform duration-700 ease-in-out flex-shrink-0 m-0 p-0 border-none align-middle transform hover:scale-105', {
                      'transform translate-x-0': !collapsed && !isTransitioning,
                      'transform translate-x-0': collapsed || isTransitioning,
                    })}
                  >
                    {item.icon}
                  </motion.span>
                  <motion.span
                    className={classNames('text-sm transition-all duration-700 delay-300 ease-in-out overflow-hidden whitespace-nowrap', {
                      'max-w-200 opacity-100': !collapsed && !isTransitioning,
                      'max-w-0 opacity-0': collapsed || isTransitioning,
                      hidden: collapsed,
                      'ease-in-out delay-900': !collapsed && !isTransitioning,
                    })}
                  >
                    {item.label}
                  </motion.span>
                </motion.li>
              </Link>
            );
          })}
        </ul>
      </motion.nav>

      {/* Collapse and Sign Out Buttons */}
      <motion.div className="border-t p-2 mx-3 dark:border-t-gray-600 border-t-gray-400">
        <motion.div className="flex flex-col gap-5 items-center">
          <motion.div className="flex flex-col gap-2">
            <motion.button
              className="grid place-content-center hover:bg-primary hover:text-white hover:shadow-md w-10 h-10 rounded p-2 transition-transform duration-300 ease-in-out transform hover:scale-105"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle Menu"
              title="Toggle Menu"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Icon className="w-6 h-6" />
            </motion.button>
            <div
              className="text-white bg-red-600 hover:bg-red-700 p-2 rounded transition-transform duration-300 ease-in-out transform hover:scale-105"
              onClick={handleSignOut}
              aria-label="Sign Out"
              title="Sign Out"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
            </div>

          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
