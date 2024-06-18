import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthUserContext"
import { Settings } from "lucide-react"
import { useRouter } from "next/router"


export function UserSettings() {
    const { authUser, signOut } = useAuth();

    const router = useRouter();

    const handleSettingsClick = () => {
        console.log("Settings clicked");
    };

    const handleLogoutClick = async() => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };


    if (!authUser) {
        return (
            <Button variant="primary" href="/auth/sign-in">
                Log in
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <div className="h-8 w-8 flex justify-center items-center">
                        <Settings className="text-primary h-6 w-6" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{authUser?.data?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {authUser?.data?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Billing
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick}>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutClick}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
