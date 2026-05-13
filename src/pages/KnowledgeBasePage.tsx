import { useMemo, useState } from "react";
import {
    FolderPlus,
    FilePlus2,
    Type,
    Globe,
    RefreshCw,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FilterDropdown from "@/components/FilterDropdown";
import { MOCK_KB } from "@/data/mockKnowledgeBase";
import KnowledgeBaseEmptyState from "@/components/knowledge-base/KnowledgeBaseEmptyState";
import KnowledgeBaseTable from "@/components/knowledge-base/KnowledgeBaseTable";
import CreateFolderDrawer from "@/components/knowledge-base/CreateFolderDrawer";
import AddFilesDrawer from "@/components/knowledge-base/AddFilesDrawer";
import AddTextDrawer from "@/components/knowledge-base/AddTextDrawer";
import AddUrlDrawer from "@/components/knowledge-base/AddUrlDrawer";
import KnowledgeBaseDetailDrawer from "@/components/knowledge-base/KnowledgeBaseDetailDrawer";
import type { KBEntry, KBType, AddUrlPayload, AddTextPayload, AddFilesPayload, CreateFolderPayload } from "@/types/knowledge-base";

/** ---------------- Types ---------------- */

interface Filters {
    type: "" | KBType;
    creator: string;
}

/** ---------------- Component ---------------- */

export default function KnowledgeBasePage() {
    const [entries, setEntries] = useState<KBEntry[]>([]);
    const [search, setSearch] = useState<string>("");
    const [filters, setFilters] = useState<Filters>({
        type: "",
        creator: "",
    });

    const [folderOpen, setFolderOpen] = useState<boolean>(false);
    const [filesOpen, setFilesOpen] = useState<boolean>(false);
    const [textOpen, setTextOpen] = useState<boolean>(false);
    const [urlOpen, setUrlOpen] = useState<boolean>(false);
    const [detailOpen, setDetailOpen] = useState<boolean>(false);
    const [selectedEntry, setSelectedEntry] = useState<KBEntry | null>(null);

    const isEmpty = entries.length === 0;

    const folders = useMemo(
        () => entries.filter((e) => e.type === "folder"),
        [entries]
    );

    const filtered = useMemo(() => {
        return entries.filter((e) => {
            if (
                search &&
                !e.name.toLowerCase().includes(search.toLowerCase())
            ) {
                return false;
            }
            if (filters.type && e.type !== filters.type) return false;
            if (filters.creator && e.owner !== filters.creator) return false;
            return true;
        });
    }, [entries, search, filters]);

    const addEntry = (entry: Omit<KBEntry, "id" | "createdDate" | "owner">) => {
        const id = `KB${Date.now()}`;

        setEntries((prev) => [
            {
                id,
                createdDate: "28 April 2026",
                owner: "William Jones",
                ...entry,
            },
            ...prev,
        ]);
    };

    const handleCreateFolder = (payload: CreateFolderPayload) => {
        addEntry({ name: payload.name, folder: payload.folder, type: "folder" });
        toast.success("Folder created");
        setFolderOpen(false);
    };

    const handleAddFiles = (payload: AddFilesPayload) => {
        payload.files.forEach((f) =>
            addEntry({
                name: f,
                folder: payload.folder,
                type: "file",
            })
        );

        toast.success(
            `${payload.files.length} file${payload.files.length > 1 ? "s" : ""} added`
        );
        setFilesOpen(false);
    };

    const handleAddText = (payload: AddTextPayload) => {
        addEntry({ name: payload.title, folder: payload.folder, type: "file" });
        toast.success("Text saved");
        setTextOpen(false);
    };

    const handleAddUrl = (payload: AddUrlPayload) => {
        addEntry({
            name: payload.title || payload.url,
            folder: payload.folder,
            type: "url",
        });
        toast.success("URL saved");
        setUrlOpen(false);
    };

    const handleDelete = (id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        toast.success("Deleted");
    };

    const handleClearAll = () => {
        setEntries([]);
        toast("Knowledge base cleared");
    };

    const handleRestoreDemo = () => {
        setEntries(MOCK_KB as KBEntry[]);
        toast("Mock data restored");
    };

    return (
        <div className="px-8 py-6" data-testid="knowledge-base-page">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                    Knowledge Base
                </h1>

                <div className="flex items-center gap-2">
                    {isEmpty ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRestoreDemo}
                            className="text-xs text-zinc-500 hover:text-zinc-900"
                            data-testid="kb-restore-demo-btn"
                        >
                            Restore demo data
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="text-xs text-zinc-500 hover:text-zinc-900"
                            data-testid="kb-clear-all-btn"
                        >
                            Clear all
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="gap-2 rounded-lg border-zinc-200 text-zinc-700"
                        data-testid="kb-refresh-btn"
                        onClick={() => toast("Refreshed")}
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                    variant="outline"
                    onClick={() => setFolderOpen(true)}
                    className="gap-2 rounded-lg border-zinc-200 px-5 text-zinc-700 hover:bg-zinc-50"
                    data-testid="create-folder-btn"
                >
                    <FolderPlus className="h-4 w-4" />
                    Create Folder
                </Button>

                <Button
                    variant="outline"
                    onClick={() => setFilesOpen(true)}
                    className="gap-2 rounded-lg border-zinc-200 px-5 text-zinc-700 hover:bg-zinc-50"
                    data-testid="add-files-btn"
                >
                    <FilePlus2 className="h-4 w-4" />
                    Add Files
                </Button>

                <Button
                    variant="outline"
                    onClick={() => setTextOpen(true)}
                    className="gap-2 rounded-lg border-zinc-200 px-5 text-zinc-700 hover:bg-zinc-50"
                    data-testid="add-text-btn"
                >
                    <Type className="h-4 w-4" />
                    Add Text
                </Button>

                <Button
                    variant="outline"
                    onClick={() => setUrlOpen(true)}
                    className="gap-2 rounded-lg border-zinc-200 px-5 text-zinc-700 hover:bg-zinc-50"
                    data-testid="add-url-btn"
                >
                    <Globe className="h-4 w-4" />
                    Add URL
                </Button>
            </div>

            {/* Search */}
            <div className="relative mt-5">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Knowledge Base..."
                    className="h-12 rounded-xl border-zinc-200 bg-white pl-11 text-sm placeholder:text-zinc-400"
                    data-testid="kb-search-input"
                />
            </div>

            {/* Filters */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
                <FilterDropdown
                    label="Type"
                    value={filters.type}
                    options={["folder", "file", "url"]}
                    onChange={(v) =>
                        setFilters((f) => ({ ...f, type: v as KBType | "" }))
                    }
                    testId="kb-filter-type"
                />

                <FilterDropdown
                    label="Creator"
                    value={filters.creator}
                    options={[
                        "William Jones",
                        "Emma Johnson",
                        "Oliver Roberts",
                    ]}
                    onChange={(v) =>
                        setFilters((f) => ({ ...f, creator: v }))
                    }
                    testId="kb-filter-creator"
                />
            </div>

            {/* Body */}
            <div className="mt-5">
                {isEmpty ? (
                    <KnowledgeBaseEmptyState />
                ) : (
                    <KnowledgeBaseTable
                        entries={filtered}
                        onDelete={handleDelete}
                        onView={(entry) => {
                            setSelectedEntry(entry);
                            setDetailOpen(true);
                        }}
                    />
                )}
            </div>

            {/* Drawers */}
            <KnowledgeBaseDetailDrawer
                open={detailOpen}
                onOpenChange={setDetailOpen}
                entry={selectedEntry}
            />

            <CreateFolderDrawer
                open={folderOpen}
                onOpenChange={setFolderOpen}
                onSubmit={handleCreateFolder}
                folders={folders}
            />

            <AddFilesDrawer
                open={filesOpen}
                onOpenChange={setFilesOpen}
                onSubmit={handleAddFiles}
                folders={folders}
            />

            <AddTextDrawer
                open={textOpen}
                onOpenChange={setTextOpen}
                onSubmit={handleAddText}
                folders={folders}
            />

            <AddUrlDrawer
                open={urlOpen}
                onOpenChange={setUrlOpen}
                onSubmit={handleAddUrl}
                folders={folders}
            />
        </div>
    );
}