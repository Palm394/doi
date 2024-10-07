import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import LogoutButton from "@/components/LogoutButton";
import { PageRoute } from "@/config/page";

export default function Sidebar() {
    return (
        <div className="w-64 p-6 bg-white flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold mb-6">FIRE</h1>
                <SidebarLink />
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

function SidebarLink() {
    return (
        <div>
            <SidebarLinkButton to={PageRoute.DASHBOARD}>Dashboard</SidebarLinkButton>
            <SidebarLinkButton to={PageRoute.ACCOUNT}>Account</SidebarLinkButton>
        </div>
    );
}

function SidebarLinkButton({ to, children }: { to: string; children: React.ReactNode }) {
    const { pathname } = useLocation();
    return (
        <Link to={to}>
            <Button variant={pathname === to ? "default" : "ghost"} className="w-full justify-start mb-2">
                {children}
            </Button>
        </Link>
    );
}