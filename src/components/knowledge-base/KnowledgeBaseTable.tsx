import { useMemo, useState } from "react";
import {
    FolderClosed,
    FileText,
    Link2,
    MoreVertical,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { KBEntry, KBType } from "@/types/knowledge-base";

interface KnowledgeBaseTableProps {
    entries: KBEntry[];
    onDelete: (id: string) => void;
    onView: (entry: KBEntry) => void;
    isInsideFolder?: boolean;
}

function TypeIcon({ type }: { type: KBType }) {
    if (type === "folder")
        return <FolderClosed className="h-5 w-5 text-blue-500" />;
    if (type === "url")
        return <Link2 className="h-5 w-5 text-violet-500" />;
    return <FileText className="h-5 w-5 text-zinc-500" />;
}

export default function KnowledgeBaseTable({
    entries,
    onDelete,
    onView,
    isInsideFolder = false,
}: KnowledgeBaseTableProps) {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const [rowsPerPage, setRowsPerPage] = useState<number>(50);
    const [page, setPage] = useState<number>(1);

    const total = entries.length;
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
    const startIdx = (page - 1) * rowsPerPage;
    const endIdx = Math.min(startIdx + rowsPerPage, total);

    const pageRows = useMemo(
        () => entries.slice(startIdx, endIdx),
        [entries, startIdx, endIdx]
    );

    return (
        <div
            className="overflow-hidden rounded-2xl border border-zinc-100 bg-white flex flex-col h-full"
            data-testid="kb-table"
        >
            <div className="bg-zinc-50/80 border-b border-zinc-100 px-4 py-2 flex items-center justify-between md:hidden text-xs text-zinc-600 font-medium shrink-0">
                <span>Swipe left/right to view more columns</span>
                <span className="flex items-center gap-1 font-semibold text-blue-600">Scroll <ChevronRight className="h-3.5 w-3.5" /></span>
            </div>
            <div className="w-full overflow-x-auto flex-1 flex flex-col min-h-0">
                <div className="min-w-[700px] flex-1 flex flex-col min-h-0">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_56px] md:grid-cols-[2fr_1fr_1fr_56px] gap-2 border-b border-zinc-100 bg-zinc-50/60 px-5 py-3 text-sm text-zinc-600 shrink-0">
                        <div>Knowledge Base Name</div>
                        <div className="hidden md:block">{isInsideFolder ? "Creator" : "Folder"}</div>
                        <div className="hidden md:block">{isInsideFolder ? "Last Updated On" : "Owner"}</div>
                        <div />
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto hover-scrollbar min-h-0 divide-y divide-zinc-50">
                        {pageRows.map((kb) => (
                            <div
                                key={kb.id}
                                data-testid={`kb-row-${kb.id}`}
                                onClick={() => onView(kb)}
                                className="grid grid-cols-[1fr_56px] md:grid-cols-[2fr_1fr_1fr_56px] items-center gap-2 px-5 py-4 hover:bg-zinc-50/60 cursor-pointer"
                            >
                                {/* Column 1: Name & Icon */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                                        <TypeIcon type={kb.type} />
                                    </div>

                                    <div className="truncate">
                                        <div className="truncate text-sm font-medium text-zinc-900">
                                            {kb.name}
                                        </div>
                                        <div className="text-xs text-zinc-500 truncate">
                                            {isInsideFolder ? kb.folder : kb.createdDate}
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Creator (inside folder) or Folder Badge (outside folder) */}
                                <div className="hidden md:block truncate">
                                    {isInsideFolder ? (
                                        <span className="text-sm text-zinc-700 truncate">{kb.owner}</span>
                                    ) : (
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full bg-zinc-100 text-zinc-700 font-medium truncate"
                                        >
                                            {kb.folder || "-"}
                                        </Badge>
                                    )}
                                </div>

                                {/* Column 3: Last Updated Date (inside folder) or Owner name (outside folder) */}
                                <div className="hidden md:block text-sm text-zinc-700 truncate">
                                    {isInsideFolder ? kb.createdDate : kb.owner}
                                </div>

                                {/* Column 4: Dropdown actions */}
                                <div className="flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                data-testid={`kb-row-menu-${kb.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                                aria-label="Row actions"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuItem onClick={() => onView(kb)}>
                                                <Eye className="h-4 w-4 text-zinc-600" />
                                                View Details
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 cursor-pointer"
                                                data-testid={`kb-delete-${kb.id}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmDeleteId(kb.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pagination controls footer */}
            <div className="flex items-center justify-end gap-6 px-5 py-3 text-sm text-zinc-600 shrink-0 border-t border-zinc-100 bg-white">
                <div className="flex items-center gap-2">
                    <span>Rows per Page</span>

                    <Select
                        value={String(rowsPerPage)}
                        onValueChange={(v: string) => {
                            setRowsPerPage(Number(v));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger
                            className="h-8 w-[72px] rounded-md border-zinc-200"
                            data-testid="kb-rows-per-page-select"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {[10, 25, 50, 100].map((n) => (
                                <SelectItem
                                    key={n}
                                    value={String(n)}
                                >
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div data-testid="kb-pagination-range">
                    {total === 0
                        ? "0"
                        : `${startIdx + 1}-${endIdx}`}{" "}
                    of {total}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="rounded-md p-1.5 hover:bg-zinc-100 disabled:opacity-40"
                        onClick={() =>
                            setPage((p) =>
                                Math.max(1, p - 1)
                            )
                        }
                        disabled={page === 1}
                        data-testid="kb-prev-page-btn"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from(
                        {
                            length: Math.min(
                                totalPages,
                                4
                            ),
                        },
                        (_, i) => i + 1
                    ).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPage(p)}
                            data-testid={`kb-page-${p}`}
                            className={cn(
                                "h-8 w-8 rounded-md text-sm",
                                page === p
                                    ? "bg-zinc-900 text-white"
                                    : "text-zinc-700 hover:bg-zinc-100"
                            )}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        type="button"
                        className="rounded-md p-1.5 hover:bg-zinc-100 disabled:opacity-40"
                        onClick={() =>
                            setPage((p) =>
                                Math.min(
                                    totalPages,
                                    p + 1
                                )
                            )
                        }
                        disabled={
                            page === totalPages
                        }
                        data-testid="kb-next-page-btn"
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-zinc-200">
                        <span className="text-zinc-500 text-xs font-medium tracking-wide uppercase">Go to</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={page}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                                    setPage(val);
                                }
                            }}
                            className="h-8 w-14 rounded-md border border-zinc-200 bg-white px-2 text-center text-sm text-zinc-700 font-medium focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                            aria-label="Go to page"
                        />
                    </div>
                </div>
            </div>

            <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                <DialogContent className="bg-white rounded-2xl max-w-md border border-zinc-100 shadow-xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-900 font-semibold text-lg">Delete Document</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-sm mt-2">
                            Are you sure you want to delete this document? This action cannot be undone and will permanently remove it from the knowledge base.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 gap-2">
                        <Button variant="outline" onClick={() => setConfirmDeleteId(null)} className="rounded-lg">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            onClick={() => {
                                if (confirmDeleteId) {
                                    onDelete(confirmDeleteId);
                                    setConfirmDeleteId(null);
                                }
                            }}
                        >
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}