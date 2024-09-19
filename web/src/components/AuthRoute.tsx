import { verify } from "@/services/auth";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthRoute({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    useEffect(() => {
        async function check() {
            const isLogin = await verify();
            if (!isLogin) {
                navigate("/login");
            }
        }
        check();
    }, []);

    return <>{children}</>;
}