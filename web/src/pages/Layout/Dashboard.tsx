import Sidebar from "@/components/Sidebar"
import { Outlet } from "react-router-dom"

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100 flex-wrap">
            <Sidebar />
            <div className="px-16 py-8 flex-1">
                <Outlet />
            </div>
        </div>
    )
}