import * as React from "react";
import { ChevronsUpDown, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
    id: string;
    name: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({
    options = [],
    selected = [],
    onChange,
    placeholder = "Select options",
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const filteredOptions = React.useMemo(() => {
        return options.filter((o) =>
            o.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    const handleToggle = (id: string) => {
        const index = selected.indexOf(id);
        if (index === -1) {
            onChange([...selected, id]);
        } else {
            onChange(selected.filter((item) => item !== id));
        }
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
    };

    const selectedOptions = React.useMemo(() => {
        return options.filter((o) => selected.includes(o.id));
    }, [options, selected]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "flex min-h-11 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1.5 items-center text-left">
                        {selectedOptions.length === 0 ? (
                            <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                                {placeholder}
                            </span>
                        ) : (
                            selectedOptions.map((o) => (
                                <Badge
                                    key={o.id}
                                    className="bg-blue-50 text-blue-600 border border-blue-150 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/40 rounded-md py-0.5 px-1.5 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggle(o.id);
                                    }}
                                >
                                    {o.name}
                                    <span
                                        className="hover:text-blue-850 p-0.5"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggle(o.id);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </span>
                                </Badge>
                            ))
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {selected.length > 0 && (
                            <span
                                onClick={handleClearAll}
                                className="text-zinc-400 hover:text-zinc-650 dark:text-zinc-500 dark:hover:text-zinc-300 p-0.5 cursor-pointer"
                                aria-label="Clear selection"
                            >
                                <X className="h-3.5 w-3.5" />
                            </span>
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50 text-zinc-500" />
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg"
                style={{ width: "var(--radix-popover-trigger-width)" }}
                align="start"
            >
                {/* Search */}
                <div className="relative flex items-center mb-2.5 px-1 py-1">
                    <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent pl-10 pr-3.5 text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-zinc-900 dark:text-zinc-100"
                    />
                </div>

                {/* Option list */}
                <div className="max-h-[200px] overflow-y-auto space-y-0.5 pr-1 select-none hover-scrollbar">
                    {filteredOptions.length === 0 ? (
                        <div className="text-xs text-center text-zinc-500 dark:text-zinc-400 py-3">
                            No options found
                        </div>
                    ) : (
                        filteredOptions.map((o) => {
                            const isChecked = selected.includes(o.id);
                            return (
                                <div
                                    key={o.id}
                                    onClick={() => handleToggle(o.id)}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 text-left text-zinc-800 dark:text-zinc-200 cursor-pointer",
                                        isChecked && "bg-zinc-50/50 dark:bg-zinc-900/50"
                                    )}
                                >
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => handleToggle(o.id)}
                                        tabIndex={-1}
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md"
                                    />
                                    <span className="truncate">{o.name}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
