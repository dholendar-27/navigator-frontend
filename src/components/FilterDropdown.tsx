import {
    ChevronDown,
    Check,
    X,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { type JSX } from "react";
import { cn } from "@/lib/utils";

type FilterDropdownProps = {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    testId?: string;
};

export default function FilterDropdown({
    label,
    value,
    options,
    onChange,
    testId,
}: FilterDropdownProps): JSX.Element {
    return (
        <div className="group flex items-center gap-0 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 transition-colors">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        data-testid={testId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-700 outline-none"
                    >
                        <span className={cn("transition-colors", value ? "font-medium text-zinc-900" : "text-zinc-600")}>
                            {value || label}
                        </span>
                        {!value && <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />}
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="w-44"
                >
                    {options.map((opt) => (
                        <DropdownMenuItem
                            key={opt}
                            data-testid={testId ? `${testId}-option-${opt
                                .toLowerCase()
                                .replace(/\s+/g, "-")}` : undefined}
                            onClick={() => onChange(opt)}
                            className="flex items-center justify-between"
                        >
                            <span className="capitalize">
                                {opt}
                            </span>

                            {value === opt && (
                                <Check className="h-4 w-4 text-blue-600" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {value && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onChange("");
                    }}
                    className="flex items-center pr-2.5 py-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                    aria-label="Clear filter"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}