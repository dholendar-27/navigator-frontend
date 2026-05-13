import React, { useState } from "react";
import { Settings, MoreVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Integration = {
    id: string | number;
    name: string;
    description: string;
    icon: React.ReactNode;
    defaultEnabled?: boolean;
};

type IntegrationCardProps = {
    integration: Integration;
};

const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration }) => {
    const { id, name, description, icon, defaultEnabled = false } = integration;
    const [enabled, setEnabled] = useState<boolean>(defaultEnabled);

    return (
        <div
            data-testid={`integration-card-${id}`}
            className="group relative flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)]"
        >
            {/* Top row: icon + 3-dot menu */}
            <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50">
                    {icon}
                </div>


            </div>

            {/* Title + description */}
            <div className="mt-5">
                <h3
                    data-testid={`integration-name-${id}`}
                    className="text-base font-semibold tracking-tight text-neutral-900"
                >
                    {name}
                </h3>
                <p
                    data-testid={`integration-description-${id}`}
                    className="mt-1.5 text-sm leading-relaxed text-neutral-500"
                >
                    {description}
                </p>
            </div>

            {/* Divider */}
            <div className="mt-6 border-t border-neutral-100" />

            {/* Footer: settings + status + toggle */}
            <div className="mt-4 flex items-center justify-between">
                <button
                    type="button"
                    aria-label={`Settings for ${name}`}
                    data-testid={`integration-settings-${id}`}
                    className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                >
                    <Settings className="h-[18px] w-[18px]" />
                </button>

                <div className="flex items-center gap-2.5">
                    <span
                        data-testid={`integration-status-label-${id}`}
                        className={`text-sm font-medium transition-colors ${enabled ? "text-neutral-900" : "text-neutral-400"
                            }`}
                    >
                        {enabled ? "Enable" : "Disable"}
                    </span>

                    <Switch
                        checked={enabled}
                        onCheckedChange={setEnabled}
                        data-testid={`integration-toggle-${id}`}
                        className="data-[state=checked]:bg-blue-600"
                    />
                </div>
            </div>
        </div>
    );
};

export default IntegrationCard;