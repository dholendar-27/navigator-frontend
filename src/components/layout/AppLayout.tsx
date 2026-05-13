import { useState, type JSX } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout(): JSX.Element {
    const [sidebarOpen, setSidebarOpen] =
        useState<boolean>(true);

    return (
        <div
            className="flex h-screen w-full bg-[#fafafa] text-zinc-900"
            data-testid="app-layout"
        >
            <Sidebar open={sidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar
                    onToggleSidebar={() =>
                        setSidebarOpen((prev) => !prev)
                    }
                />

                <main
                    className="flex-1 overflow-y-auto"
                    data-testid="main-content"
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}