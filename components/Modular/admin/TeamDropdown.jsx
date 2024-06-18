import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useAuth } from "@/context/AuthUserContext";
import { useToast } from "@/components/ui/use-toast";
import {
    CaretSortIcon,
    CheckIcon,
    PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    TeamLogic
} from "@/lib/business_logic/team_logic/team-logic";
import { useTeam } from "@/context/TeamContext";
import { RefreshCcwIcon } from "lucide-react";
import { TeamDialog } from "./Dialogs/TeamDialog";

// The TeamDropdown component provides a dropdown menu for selecting teams.

const TeamDropdown = ({ className }) => {
    // State variables for dropdown functionality.
    const [open, setOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [userTeams, setUserTeams] = useState([]);

    // Access authentication information from the AuthUserContext.
    const { authUser } = useAuth();

    const { toast } = useToast();
    const { setTeam: setActiveTeam, activeTeam } = useTeam();
    const teamLogic = TeamLogic();
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);


    // Function to fetch teams user was added to and teams the user created.
    const fetchTeams = async () => {
        try {
            // Check if authUser is available.
            if (!authUser) {
                console.error("Authentication error. AuthUser not available.");
                return;
            }

            // Fetch user teams and created teams using TeamLogic methods.
            const userTeamsResult = await teamLogic.fetchUserTeams(authUser.uid);
            const userCreatedTeamsResult = await teamLogic.fetchUserCreatedTeams(
                authUser.uid,
            );

            // If fetching is successful, update userTeams state and select a default team.
            if (
                userTeamsResult.type === "success" &&
                userCreatedTeamsResult.type === "success"
            ) {
                setUserTeams([...userTeamsResult.data, ...userCreatedTeamsResult.data]);

                setSelectedTeam((prevSelectedTeam) =>
                    activeTeam || prevSelectedTeam || userTeamsResult.data[0] || userCreatedTeamsResult.data[0]
                );
            } else {
                // Log and display an error toast message if fetching fails.
                console.error("Error fetching teams:", userTeamsResult.message || userCreatedTeamsResult.message);
                toast({
                    title: "error",
                    description:
                        userTeamsResult.message || userCreatedTeamsResult.message,
                });
            }
        } catch (error) {
            // Log and display an error toast message for unexpected errors.
            console.error("Unexpected error fetching teams:", error);
            toast({
                title: "error",
                description: `Unexpected error fetching teams: ${error.message}`,
            });
        } finally {

        }
    };


    const refreshTeams = async () => {
        try {
            setIsRefreshing(true);

            // Use the state updater function to log the updated value.
            setIsRefreshing(prevState => {
                return prevState;
            });

            // Now, await the fetchTeams function.
            await fetchTeams();
        } catch (error) {
            console.error("Unexpected error fetching teams:", error);
            toast({
                title: "error",
                description: `Unexpected error fetching teams: ${error.message}`,
            });
        } finally {
            // Set isRefreshing to false after fetchTeams, regardless of success or failure.
            setIsRefreshing(false);
        }
    };

    useEffect(() => {

        // Call the fetchTeams function.
        fetchTeams();
    }, [authUser, toast, activeTeam]);


    // Define a personalTeam object for the user's personal account.
    const personalTeam = {
        label: "Personal Account",
        teams: [
            {
                label: `${authUser?.data?.firstname + ' ' + authUser?.data?.lastname}` || "Guest",
                value: "personal",
            },
        ],
    };

    // Define updatedGroups with personalTeam and user-created teams.
    const updatedGroups = [
        personalTeam,
        {
            label: "Teams",
            teams: userTeams.flatMap((team) => ({
                label: team.teamName,
                value: team,
            })),
        },
    ];

    // Handle team selection and navigation.
    const handleSelectTeam = (team) => {
        if (team.value === "personal") {
            // Redirect to personal account settings page.
            router.push('/_admin/settings/');
        } else {
            // Set the selected team, close the dropdown, and update the active team.
            setSelectedTeam(team);
            setOpen(false);
            setActiveTeam(team);
        }
    };

    // Return the TeamDropdown UI using Radix components for dropdown functionality.
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a team"
                    className={cn("w-[200px] justify-between", className)}
                >
                    {/* Display the selected team's avatar, label, and a caret icon. */}
                    <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                            src={`https://avatar.vercel.sh/${selectedTeam?.value?.id}.png`}
                            alt={selectedTeam?.label}
                        />
                        <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {selectedTeam?.label || 'No team selected'}
                    <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            {/* PopoverContent for the team dropdown menu */}
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        {/* CommandInput for searching teams */}
                        <CommandInput placeholder="Search team..." />
                        {/* CommandEmpty for displaying when no teams are found */}
                        <CommandEmpty>No team found.</CommandEmpty>
                        {/* CommandGroup and CommandItem for each team group and team */}
                        {updatedGroups.map((group) => (
                            <CommandGroup key={group.label} heading={group.label}>
                                {group.teams.map((team) => (
                                    <CommandItem
                                        key={team.label}
                                        onSelect={() => handleSelectTeam(team)}
                                        className="text-sm"
                                    >
                                        {/* Display team avatar, label, and check icon for selected team */}
                                        <Avatar className="mr-2 h-5 w-5">
                                            <AvatarImage
                                                src={`https://avatar.vercel.sh/${team?.value?.id}.png`}
                                                alt={team?.label}
                                                className="grayscale"
                                            />
                                            <AvatarFallback>SC</AvatarFallback>
                                        </Avatar>
                                        {team?.label}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedTeam?.value?.id === team?.value?.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        {/* CommandGroup and CommandItem for team creation */}
                        <CommandGroup>
                            <CommandItem>
                                <PlusCircledIcon className="mr-2 h-5 w-5 text-primary" />
                                {/* TeamDialog component for creating a new team */}
                                    <TeamDialog type={'create'} authUser={authUser} />
                            </CommandItem>
                        </CommandGroup>
                        <CommandGroup>
                            <CommandItem>
                                <RefreshCcwIcon
                                    className={`mr-2 h-5 w-5 text-blue-400 ${isRefreshing ? 'spin' : ''}`}
                                />
                                <span className="cursor-pointer" onClick={refreshTeams}>Refresh Teams</span>
                            </CommandItem>
                        </CommandGroup>

                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default TeamDropdown;
