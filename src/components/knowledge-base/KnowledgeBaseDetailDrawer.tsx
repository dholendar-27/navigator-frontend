import React from "react";
import { X, FolderClosed, FileText, Link2, Globe, Clock, User, Tag } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

type KBType = "folder" | "file" | "url";

interface KnowledgeBaseEntry {
    id: string;
    name: string;
    type: KBType;
    category: string;
    owner: string;
    createdDate: string;
}

interface KBDetailDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry: KnowledgeBaseEntry | null;
}

function Field({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <div className="text-xs font-medium text-zinc-500">{label}</div>
                <div className="mt-0.5 text-sm font-medium text-zinc-900">{value}</div>
            </div>
        </div>
    );
}

export default function KnowledgeBaseDetailDrawer({
    open,
    onOpenChange,
    entry,
}: KBDetailDrawerProps) {
    if (!entry) return null;

    const TypeIcon = entry.type === "folder" ? FolderClosed : entry.type === "url" ? Link2 : FileText;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                hideClose
                className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
                data-testid="kb-detail-drawer"
            >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-5">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <SheetTitle className="text-lg font-semibold text-zinc-900">
                        Item Details
                    </SheetTitle>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
                    {/* Hero Section */}
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                            <TypeIcon className={cn(
                                "h-8 w-8",
                                entry.type === "folder" ? "text-blue-500" : entry.type === "url" ? "text-violet-500" : "text-zinc-500"
                            )} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">{entry.name}</h2>
                            <Badge variant="secondary" className="mt-1 rounded-full bg-zinc-100 text-zinc-600">
                                {entry.id}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <Field icon={Tag} label="Category" value={entry.category} />
                        <Field icon={User} label="Owner" value={entry.owner} />
                        <Field icon={Clock} label="Created Date" value={entry.createdDate} />
                        {entry.type === "url" && (
                            <Field icon={Globe} label="Target URL" value="https://example.com/docs/policy" />
                        )}
                    </div>

                    <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Description</div>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                            This {entry.type} contains important information regarding {entry.category.toLowerCase()} processes and guidelines. 
                            Last reviewed by {entry.owner} on {entry.createdDate}.
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// Helper to keep imports clean
import { cn } from "@/lib/utils";
