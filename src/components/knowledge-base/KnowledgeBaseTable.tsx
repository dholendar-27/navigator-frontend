import {
    FolderClosed,
    FileText,
    Link2,
    MoreVertical,
    Trash2,
    Pencil,
    Eye,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type KBType = "folder" | "file" | "url";

interface KnowledgeBaseEntry {
    id: string;
    name: string;
    type: KBType;
    folder: string;
    owner: string;
    createdDate: string;
}

interface KnowledgeBaseTableProps {
    entries: KnowledgeBaseEntry[];
    onDelete: (id: string) => void;
    onView: (entry: KnowledgeBaseEntry) => void;
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
}: KnowledgeBaseTableProps) {
    return (
        <div
            className="overflow-hidden rounded-2xl border border-zinc-100 bg-white"
            data-testid="kb-table"
        >
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_56px] gap-2 border-b border-zinc-100 bg-zinc-50/60 px-5 py-3 text-sm text-zinc-600">
                <div>Knowledge Base Name</div>
                <div>Folder</div>
                <div>Owner</div>
                <div />
            </div>

            {entries.map((kb) => (
                <div
                    key={kb.id}
                    data-testid={`kb-row-${kb.id}`}
                    className="grid grid-cols-[2fr_1fr_1fr_56px] items-center gap-2 border-b border-zinc-50 px-5 py-4 hover:bg-zinc-50/60"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100">
                            <TypeIcon type={kb.type} />
                        </div>

                        <div>
                            <div className="text-sm font-medium text-zinc-900">
                                {kb.name}
                            </div>
                            <div className="text-xs text-zinc-500">
                                {kb.createdDate}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Badge
                            variant="secondary"
                            className="rounded-full bg-zinc-100 text-zinc-700"
                        >
                            {kb.folder || "Root"}
                        </Badge>
                    </div>

                    <div className="text-sm text-zinc-700">{kb.owner}</div>

                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    data-testid={`kb-row-menu-${kb.id}`}
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

                                <DropdownMenuItem onClick={() => toast(`Edit ${kb.name}`)}>
                                    <Pencil className="h-4 w-4 text-zinc-600" />
                                    Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    data-testid={`kb-delete-${kb.id}`}
                                    onClick={() => onDelete(kb.id)}
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
    );
}