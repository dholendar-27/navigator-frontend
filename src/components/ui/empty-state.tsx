import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: ReactNode;
    className?: string;
    testId?: string;
}

export default function UnifiedEmptyState({
    title = "No Data Found",
    description = "No items have been added yet.",
    icon,
    className,
    testId = "empty-state",
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-1 min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-8 text-center my-2 shadow-sm transition-all",
                className
            )}
            data-testid={testId}
        >
            {icon && (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-zinc-800 shadow-md border border-zinc-100 dark:border-zinc-700 mb-5">
                    {icon}
                </div>
            )}

            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {title}
            </h3>

            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                {description}
            </p>
        </div>
    );
}
