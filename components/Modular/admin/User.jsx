import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthUserContext"
import { useRouter } from "next/router"


export function UserNav() {
    const { authUser, signOut } = useAuth();

    const router = useRouter();

    const handleSettingsClick = () => {
        router.push(`/_admin/settings`);
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
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-primary">
                        <AvatarImage src={authUser?.data?.profileImage|| '/avatars/01.png'} alt="user profile image" />
                        <AvatarFallback>NS</AvatarFallback>
                    </Avatar>
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
                    <DropdownMenuItem onClick={handleSettingsClick}>
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutClick}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
