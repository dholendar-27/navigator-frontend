import { Users } from "lucide-react";
import type { JSX } from "react";
import UnifiedEmptyState from "@/components/ui/empty-state";

export default function EmptyState(): JSX.Element {
    return (
        <UnifiedEmptyState
            title="No Data Found"
            description="No employees have been added yet."
            icon={<Users className="h-8 w-8 text-zinc-400" />}
            testId="employees-empty-state"
        />
    );
}