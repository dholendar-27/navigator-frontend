import { FolderClosed } from "lucide-react";
import React from "react";

const KnowledgeBaseEmptyState: React.FC = () => {
    return (
        <div
            className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50/50 px-6 py-12 text-center"
            data-testid="kb-empty-state"
        >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-200/60">
                <FolderClosed className="h-8 w-8 text-zinc-500" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-zinc-900">
                No Data Found
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
                No documents have been added yet.
            </p>
        </div>
    );
};

export default KnowledgeBaseEmptyState;