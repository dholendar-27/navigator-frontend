import { useState, useEffect, type JSX } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout(): JSX.Element {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const location = useLocation();

    // Responsive initial states and resize listeners
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Initialize
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Auto-close sidebar on mobile navigation
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, [location]);

    return (
        <div
            className="flex h-dvh w-full overflow-hidden bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 relative select-none"
            data-testid="app-layout"
        >
            {/* Sidebar mobile overlay backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-30 lg:hidden transition-opacity duration-300"
                />
            )}

            <Sidebar open={sidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden w-full min-w-0">
                <TopBar
                    onToggleSidebar={() =>
                        setSidebarOpen((prev) => !prev)
                    }
                />

                <main
                    className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar w-full flex flex-col min-h-0 min-w-0"
                    data-testid="main-content"
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}