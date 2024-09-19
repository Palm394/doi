import { logout } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react"

export default function LogoutButton() {
    const navigate = useNavigate();
    async function handleLogout() {
        const response = await logout();
        if (!response) {
            console.log("failed logout");
        }
        navigate("/login");
    }

    return (
        <Button
            onClick={handleLogout}
            variant={"ghost"}
            className="w-full h-fit p-0 justify-start"
        >
            <LogOut className="mr-2 h-5 w-5" />
            Bye bye!
        </Button>
    );
}