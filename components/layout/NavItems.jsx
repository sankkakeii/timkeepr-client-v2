import React from "react";
import { Cog, KanbanSquare, Network, Orbit, Users2, ListChecks, Boxes } from "lucide-react";


// Sidebar Navigation Items for Admin
export const adminNavItems = [
  {
    label: "Dashboard",
    href: "/_admin/dashboard",
    icon: <KanbanSquare className="h-6 w-6 text-yellow-400"/>,
  },
  {
    label: "Teams",
    href: "/_admin/teams",
    icon: <Network className="h-6 w-6 text-green-400"/>,
  },
  {
    label: "Team Tasks",
    href: "/_admin/tasks",
    icon: <ListChecks className="h-6 w-6 text-red-400"/>,
  },
  {
    label: "Team Members",
    href: "/_admin/members",
    icon: <Users2 className="h-6 w-6 text-purple-400"/>,
  },
  {
    label: "My Users",
    href: "/_admin/my-users",
    icon: <Boxes className="h-6 w-6 text-blue-400"/>,
  },
  {
    label: "Settings",
    href: "/_admin/settings",
    icon: <Cog className="h-6 w-6 text-orange-800"/>,
  },
];

// Sidebar Navigation Items for Superuser
export const superAdminNavItems = [
  {
    label: "Dashboard",
    href: "/_admin/dashboard",
    icon: <KanbanSquare className="h-6 w-6 text-yellow-400"/>,
  },
  {
    label: "Teams",
    href: "/_admin/teams",
    icon: <Network className="h-6 w-6 text-green-400"/>,
  },
  {
    label: "Team Tasks",
    href: "/_admin/tasks",
    icon: <ListChecks className="h-6 w-6 text-red-400"/>,
  },
  {
    label: "Team Members",
    href: "/_admin/members",
    icon: <Users2 className="h-6 w-6 text-purple-400"/>,
  },
  {
    label: "My Users",
    href: "/_admin/my-users",
    icon: <Boxes className="h-6 w-6 text-blue-400"/>,
  },
  {
    label: "All Users",
    href: "/_admin/su/all-users",
    icon: <Orbit className="h-6 w-6"/>,
  },
  {
    label: "Settings",
    href: "/_admin/settings",
    icon: <Cog className="h-6 w-6 text-orange-800"/>,
  },
];
