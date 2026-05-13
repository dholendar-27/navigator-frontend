import { FolderClosed } from "lucide-react";
import React from "react";
import UnifiedEmptyState from "@/components/ui/empty-state";

const KnowledgeBaseEmptyState: React.FC = () => {
    return (
        <UnifiedEmptyState
            title="No Data Found"
            description="No documents have been added yet."
            icon={<FolderClosed className="h-8 w-8 text-zinc-500" />}
            testId="kb-empty-state"
        />
    );
};

export default KnowledgeBaseEmptyState;