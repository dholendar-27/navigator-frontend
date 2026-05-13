import {
    PanelLeft,
    Bell,
    Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import type { JSX } from "react";

type TopBarProps = {
    onToggleSidebar: () => void;
};

export default function TopBar({
    onToggleSidebar,
}: TopBarProps): JSX.Element {
    return (
        <header
            className="flex h-[68px] w-full items-center justify-between border-b border-zinc-200 bg-white px-5"
            data-testid="topbar"
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                data-testid="toggle-sidebar-btn"
                aria-label="Toggle sidebar"
            >
                <PanelLeft className="h-5 w-5 text-zinc-700" />
            </Button>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button
                    type="button"
                    className="relative rounded-full p-2 hover:bg-zinc-100"
                    data-testid="notification-btn"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5 text-zinc-700" />

                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
                </button>

                {/* Settings */}
                <button
                    type="button"
                    className="rounded-full p-2 hover:bg-zinc-100"
                    data-testid="settings-btn"
                    aria-label="Settings"
                >
                    <Settings className="h-5 w-5 text-zinc-700" />
                </button>

                {/* User Profile */}
                <div
                    className="ml-1 flex items-center gap-2.5"
                    data-testid="user-profile"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                            alt="William Jones"
                        />

                        <AvatarFallback>
                            WJ
                        </AvatarFallback>
                    </Avatar>

                    <span className="text-sm font-medium text-zinc-900">
                        William Jones
                    </span>
                </div>
            </div>
        </header>
    );
}