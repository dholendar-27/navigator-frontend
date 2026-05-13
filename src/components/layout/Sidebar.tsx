import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import {
    LayoutGrid,
    Users,
    ListTree,
    FileStack,
    Plug,
    CreditCard,
    Receipt,
    PenSquare,
    Search,
    AlertTriangle,
    ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { JSX } from "react";

type NavItemType = {
    to: string;
    label: string;
    icon: LucideIcon;
};

type ChatHistoryItem = {
    id: string;
    label: string;
};

type NavItemProps = NavItemType & {
    collapsed?: boolean;
};

type SidebarProps = {
    open: boolean;
};

const mainNav: NavItemType[] = [
    { to: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "employees", label: "Employees", icon: Users },
    { to: "category", label: "Category", icon: ListTree },
    { to: "knowledge-base", label: "Knowledge Base", icon: FileStack },
    { to: "integration", label: "Integration", icon: Plug },
    { to: "subscription", label: "Subscription", icon: CreditCard },
    { to: "billing", label: "Billing", icon: Receipt },
];

const chatNav: NavItemType[] = [
    { to: "chatnew", label: "New Chat", icon: PenSquare },
    { to: "chatsearch", label: "Search Chats", icon: Search },
];

const chatHistory: ChatHistoryItem[] = [
    { id: "h1", label: "Policy Update Information" },
    { id: "h2", label: "Policy Update Information" },
];

function NavItem({
    to,
    label,
    icon: Icon,
    collapsed = false,
}: NavItemProps) {
    const testId = `nav-${label.toLowerCase().replace(/\s+/g, "-")}`;

    if (collapsed) {
        return (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <NavLink
                            to={to}
                            data-testid={testId}
                            className={({ isActive }) =>
                                cn(
                                    "flex h-10 w-full items-center justify-center rounded-lg transition-colors",
                                    isActive
                                        ? "bg-zinc-100 text-zinc-900"
                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                )
                            }
                        >
                            <Icon className="h-4 w-4" />
                        </NavLink>
                    </TooltipTrigger>

                    <TooltipContent side="right">
                        {label}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <NavLink
            to={to}
            data-testid={testId}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )
            }
        >
            <div className="flex h-5 w-5 items-center justify-center shrink-0">
                <Icon className="h-4 w-4" />
            </div>
            <span>{label}</span>
        </NavLink>
    );
}

export default function Sidebar({
    open,
}: SidebarProps): JSX.Element {
    const collapsed = !open;

    if (collapsed) {
        return (
            <aside
                className="flex h-full w-[72px] flex-col items-center border-r border-zinc-200 bg-white"
                data-testid="sidebar-collapsed"
            >
                {/* Logo */}
                <div className="flex h-[68px] items-center justify-center">
                    <NavLink to="/dashboard" aria-label="Go to Dashboard">
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className="h-6 w-6"
                        />
                    </NavLink>
                </div>

                {/* Main Nav */}
                <nav className="flex flex-col gap-1 px-3 pb-2">
                    {mainNav.map((item) => (
                        <NavItem
                            key={item.to}
                            {...item}
                            collapsed
                        />
                    ))}
                </nav>
            </aside>
        );
    }

    return (
        <aside
            className="flex h-full w-[260px] flex-col border-r border-zinc-200 bg-white"
            data-testid="sidebar"
        >
            {/* Logo */}
            <NavLink to="/dashboard" className="flex items-center gap-2 px-5 py-5">
                <img
                    src="/logo.svg"
                    alt="Logo"
                    className="h-6 w-6"
                />

                <span className="text-xl font-semibold tracking-tight text-blue-600">
                    Navigator
                </span>
            </NavLink>

            {/* Main Nav */}
            <nav className="flex flex-col gap-1 px-3 pb-2">
                {mainNav.map((item) => (
                    <NavItem
                        key={item.to}
                        {...item}
                    />
                ))}
            </nav>

            <div className="my-3 border-t border-zinc-100" />

            {/* Chat Section */}
            <div className="px-5 pb-1 pt-1 text-sm font-medium text-zinc-500">
                Chat
            </div>

            <nav className="flex flex-col gap-1 px-3">
                {chatNav.map((item) => (
                    <NavItem
                        key={item.to}
                        {...item}
                    />
                ))}
            </nav>

            <div className="my-3 border-t border-zinc-100" />

            {/* Chat History */}
            <div className="px-5 pb-1 text-sm font-medium text-zinc-500">
                Chat History
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-1">
                {chatHistory.map((h) => (
                    <button
                        key={h.id}
                        type="button"
                        data-testid={`chat-history-${h.id}`}
                        className="rounded-md px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50"
                    >
                        {h.label}
                    </button>
                ))}
            </div>

            {/* Usage Card */}
            <div className="mx-3 mb-3 rounded-xl border border-zinc-200 bg-orange-50 p-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center shrink-0">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>

                    <div className="flex-1">
                        <div className="text-sm font-medium text-orange-600">
                            Approaching usage limits
                        </div>

                        <div className="mt-0.5 text-xs text-zinc-600">
                            Current Plan:{" "}
                            <span className="font-medium text-zinc-900">
                                Core
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mx-3 mb-3 mt-3 space-y-1.5 text-xs text-zinc-600">
                    <div className="flex items-center gap-2">
                        <div className="flex w-5 justify-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
                        </div>
                        Complex Tasks{" "}
                        <span className="font-medium text-zinc-900">
                            (84%)
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex w-5 justify-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                        </div>
                        Core Tasks{" "}
                        <span className="font-medium text-zinc-900">
                            (32%)
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex w-5 justify-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-violet-400" />
                        </div>
                        Pages{" "}
                        <span className="font-medium text-zinc-900">
                            (5)
                        </span>
                    </div>

                    <button
                        type="button"
                        className="mt-1 flex items-center gap-1 text-zinc-700 hover:text-zinc-900"
                        data-testid="view-plans-btn"
                    >
                        View Plans
                        <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Upgrade Button */}
            <div className="px-3 pb-4">
                <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    data-testid="upgrade-usage-btn"
                >
                    Upgrade for More Usage
                </Button>
            </div>
        </aside>
    );
}