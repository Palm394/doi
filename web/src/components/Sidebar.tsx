import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import LogoutButton from "./LogoutButton";

export default function Sidebar() {
    return (
        <div className="w-64 p-6 bg-white flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold mb-6">FIRE</h1>
                <Button className="w-full justify-start mb-2">
                    Dashboard
                </Button>
                <Button
                    className="w-full justify-start mb-2"
                    variant={"ghost"}
                >
                    Accounts
                </Button>
                <Button
                    className="w-full justify-start mb-2"
                    variant={"ghost"}
                >
                    Transactions
                </Button>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/63848208?v=4" alt="User avatar" />
                        <AvatarFallback>F</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="start">
                    <DropdownMenuItem>
                        <LogoutButton />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}