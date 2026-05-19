import { Users, Plus } from "lucide-react";
import type { JSX } from "react";
import UnifiedEmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    onAddClick?: () => void;
}

export default function EmptyState({ onAddClick }: EmptyStateProps): JSX.Element {
    return (
        <UnifiedEmptyState
            title="No Employees Found"
            description="Get started by adding employees to manage roles and track interactions."
            icon={<Users className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />}
            testId="employees-empty-state"
        >
            {onAddClick && (
                <Button
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs animate-fade-in"
                    onClick={onAddClick}
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Employee
                </Button>
            )}
        </UnifiedEmptyState>
    );
}