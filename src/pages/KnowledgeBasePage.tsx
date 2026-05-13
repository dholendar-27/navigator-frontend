import { useMemo, useState, useEffect } from "react";
import {
    FolderPlus,
    FilePlus2,
    Type,
    Globe,
    RefreshCw,
    Search,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FilterDropdown from "@/components/FilterDropdown";
import KnowledgeBaseEmptyState from "@/components/knowledge-base/KnowledgeBaseEmptyState";
import KnowledgeBaseTable from "@/components/knowledge-base/KnowledgeBaseTable";
import CreateFolderDrawer from "@/components/knowledge-base/CreateFolderDrawer";
import AddFilesDrawer from "@/components/knowledge-base/AddFilesDrawer";
import AddTextDrawer from "@/components/knowledge-base/AddTextDrawer";
import AddUrlDrawer from "@/components/knowledge-base/AddUrlDrawer";
import AskAiDrawer from "@/components/knowledge-base/AskAiDrawer";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { listFolders, createFolder, deleteFolder, uploadFiles, deleteFiles, getFolder } from "@/lib/api";
import { cacheWebSocket } from "@/utils/cacheWebSocket";
import type { KBEntry, KBType, AddUrlPayload, AddTextPayload, CreateFolderPayload } from "@/types/knowledge-base";

/** ---------------- Types ---------------- */

interface Filters {
    type: "" | KBType;
    creator: string;
}

/** ---------------- Component ---------------- */

export default function KnowledgeBasePage() {
    const { getToken } = useKindeAuth();

    // Root level folder state
    const [entries, setEntries] = useState<KBEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // In-folder navigation states
    const [currentFolder, setCurrentFolder] = useState<KBEntry | null>(null);
    const [folderFiles, setFolderFiles] = useState<any[]>([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);

    // Search and filter states
    const [search, setSearch] = useState<string>("");
    const [filters, setFilters] = useState<Filters>({
        type: "",
        creator: "",
    });

    // Drawer controllers
    const [folderOpen, setFolderOpen] = useState<boolean>(false);
    const [filesOpen, setFilesOpen] = useState<boolean>(false);
    const [textOpen, setTextOpen] = useState<boolean>(false);
    const [urlOpen, setUrlOpen] = useState<boolean>(false);
    const [askAiOpen, setAskAiOpen] = useState<boolean>(false);
    const [selectedEntry, setSelectedEntry] = useState<KBEntry | null>(null);

    // Root folder fetch
    const fetchFolders = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            if (token) {
                const data = await listFolders(token);
                const mapped: KBEntry[] = data.map((f: any) => {
                    const formattedSize = f.total_size !== undefined 
                          ? `${(f.total_size / 1024).toFixed(1)} KB`
                    : "0.0 KB";
                const dateStr = f.created_at
                    ? new Date(f.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : "-";
                return {
                    id: f.id,
                    name: f.name,
                    type: "folder" as const,
                    folder: f.description || "Top-level",
                    owner: f.creator?.display_name || "Oliver Roberts",
                    createdDate: `${dateStr} • ${formattedSize}`,
                };
            });
            setEntries(mapped);
        }
        } catch (err: any) {
        console.error("Error fetching folders:", err);
        toast.error(err.message || "Failed to fetch folders");
    } finally {
        setIsLoading(false);
    }
};

// Sub-folder files fetch
const fetchFolderFiles = async (folderId: string) => {
    try {
        setIsLoadingFiles(true);
        const token = await getToken();
        if (token) {
            const data = await getFolder(folderId, token);
            setFolderFiles(data.files || []);
        }
    } catch (err: any) {
        console.error("Error fetching folder files:", err);
        toast.error(err.message || "Failed to load files");
    } finally {
        setIsLoadingFiles(false);
    }
};

// Load folders on page mount and listen to WebSocket invalidation events
useEffect(() => {
    fetchFolders();

    const handleFolderChange = () => {
        console.log("Folder/File changed by another user - refreshing...");
        fetchFolders();
        if (currentFolder) {
            fetchFolderFiles(currentFolder.id);
        }
    };

    cacheWebSocket.on("folder:created", handleFolderChange);
    cacheWebSocket.on("folder:updated", handleFolderChange);
    cacheWebSocket.on("folder:deleted", handleFolderChange);
    cacheWebSocket.on("file:created", handleFolderChange);
    cacheWebSocket.on("file:updated", handleFolderChange);
    cacheWebSocket.on("file:deleted", handleFolderChange);

    return () => {
        cacheWebSocket.off("folder:created", handleFolderChange);
        cacheWebSocket.off("folder:updated", handleFolderChange);
        cacheWebSocket.off("folder:deleted", handleFolderChange);
        cacheWebSocket.off("file:created", handleFolderChange);
        cacheWebSocket.off("file:updated", handleFolderChange);
        cacheWebSocket.off("file:deleted", handleFolderChange);
    };
}, [currentFolder]);

// Monitor currentFolder state to pull files automatically
useEffect(() => {
    if (currentFolder) {
        fetchFolderFiles(currentFolder.id);
    } else {
        setFolderFiles([]);
    }
}, [currentFolder]);

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

// Compute active table rows based on context
const currentTableEntries = useMemo(() => {
    if (!currentFolder) {
        return filtered;
    }
    return folderFiles
        .filter((file) =>
            file.original_filename?.toLowerCase().includes(search.toLowerCase())
        )
        .map((file: any) => ({
            id: file.id,
            name: file.original_filename,
            type: "file" as const,
            folder: `${(file.file_size / 1024).toFixed(1)} KB`,
            owner: file.uploader?.display_name || "Oliver Roberts",
            createdDate: file.created_at
                ? new Date(file.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
                : "-",
        }));
}, [currentFolder, filtered, folderFiles, search]);

const isEmpty = currentTableEntries.length === 0;

const handleCreateFolder = async (payload: CreateFolderPayload) => {
    try {
        const token = await getToken();
        if (!token) return;
        await createFolder({ name: payload.name, description: payload.folder }, token);
        toast.success("Folder created successfully");
        fetchFolders();
        setFolderOpen(false);
    } catch (error: any) {
        console.error("Create folder error:", error);
        toast.error(error.message || "Failed to create folder");
    }
};

const handleAddFiles = async (folderId: string, files: File[]) => {
    try {
        const token = await getToken();
        if (!token) return;
        toast.loading("Uploading files...", { id: "uploading-files" });
        await uploadFiles(folderId, files, token);
        toast.success("Files uploaded successfully", { id: "uploading-files" });

        // Reload context-specific data
        if (currentFolder) {
            fetchFolderFiles(currentFolder.id);
        } else {
            fetchFolders();
        }
        setFilesOpen(false);
    } catch (error: any) {
        console.error("Upload files error:", error);
        toast.error(error.message || "Failed to upload files", { id: "uploading-files" });
    }
};

const handleAddText = (payload: AddTextPayload) => {
    toast.info("Add text is currently mock-only. Content: " + payload.content.substring(0, 30) + "...");
    setTextOpen(false);
};

const handleAddUrl = (payload: AddUrlPayload) => {
    toast.info("Add URL is currently mock-only. URL: " + payload.url);
    setUrlOpen(false);
};

const handleDelete = async (id: string) => {
    try {
        const token = await getToken();
        if (!token) return;
        if (currentFolder) {
            // Delete file from S3 inside current folder
            toast.loading("Removing document...", { id: "deleting-doc" });
            await deleteFiles([id], token);
            toast.success("Document removed successfully", { id: "deleting-doc" });
            fetchFolderFiles(currentFolder.id);
        } else {
            // Delete root-level folder
            toast.loading("Deleting folder...", { id: "deleting-folder" });
            await deleteFolder(id, token);
            toast.success("Folder deleted successfully", { id: "deleting-folder" });
            fetchFolders();
        }
    } catch (error: any) {
        console.error("Delete error:", error);
        toast.error(error.message || "Failed to delete item");
    }
};

return (
    <div className="px-8 py-6 flex flex-col h-full overflow-hidden" data-testid="knowledge-base-page">
        {/* Breadcrumbs pathway */}
        <div className="flex-shrink-0 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500 mb-4 bg-zinc-50/80 px-3.5 py-2 rounded-xl border border-zinc-200/60 w-fit max-w-full shadow-sm">
            <button
                type="button"
                onClick={() => setCurrentFolder(null)}
                className="hover:text-blue-600 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus:underline"
                aria-label="Back to Knowledge Base root"
            >
                <span>Knowledge Base</span>
            </button>
            {currentFolder && (
                <>
                    <span className="text-zinc-400 font-normal">/</span>
                    <span className="text-zinc-900 font-bold truncate max-w-[200px] sm:max-w-xs bg-white px-2 py-0.5 rounded-md border border-zinc-200/80 shadow-2xs">
                        {currentFolder.name}
                    </span>
                </>
            )}
        </div>

        {/* Header */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                {currentFolder && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentFolder(null)}
                        className="h-10 w-10 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all shadow-sm shrink-0"
                        data-testid="kb-back-btn"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                )}
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 truncate">
                    {currentFolder ? currentFolder.name : "Knowledge Base"}
                </h1>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    className="gap-2 rounded-lg border-zinc-200 text-zinc-700 font-semibold"
                    data-testid="kb-refresh-btn"
                    onClick={() => {
                        if (currentFolder) {
                            fetchFolderFiles(currentFolder.id);
                        } else {
                            fetchFolders();
                        }
                        toast.success("Refreshed");
                    }}
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 mt-6 flex flex-wrap items-center gap-3">
            {/* Disable sub-folder creation */}
            {!currentFolder && (
                <Button
                    variant="outline"
                    onClick={() => setFolderOpen(true)}
                    className="gap-2 rounded-lg border-zinc-200 px-5 text-zinc-700 hover:bg-zinc-50 font-semibold"
                    data-testid="create-folder-btn"
                >
                    <FolderPlus className="h-4 w-4" />
                    Create Folder
                </Button>
            )}

            <Button
                variant="outline"
                onClick={() => setFilesOpen(true)}
                className="gap-2 rounded-lg border-zinc-200 px-5 text-zinc-700 hover:bg-zinc-50 font-semibold"
                data-testid="add-files-btn"
            >
                <FilePlus2 className="h-4 w-4" />
                Add Files
            </Button>

            <Button
                variant="outline"
                onClick={() => setTextOpen(true)}
                className="gap-2 rounded-lg border-zinc-200 px-5 text-zinc-700 hover:bg-zinc-50 font-semibold"
                data-testid="add-text-btn"
            >
                <Type className="h-4 w-4" />
                Add Text
            </Button>

            <Button
                variant="outline"
                onClick={() => setUrlOpen(true)}
                className="gap-2 rounded-lg border-zinc-200 px-5 text-zinc-700 hover:bg-zinc-50 font-semibold"
                data-testid="add-url-btn"
            >
                <Globe className="h-4 w-4" />
                Add URL
            </Button>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 flex items-center gap-2 mt-5">
            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search documents by filename or author..."
                    className="h-12 rounded-xl border-zinc-200 bg-white pl-11 text-sm placeholder:text-zinc-400 focus:ring-blue-500/20"
                    data-testid="kb-search-input"
                />
            </div>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 mt-4 flex flex-wrap items-center gap-2">
            <FilterDropdown
                label="Type"
                value={filters.type}
                options={["folder"]}
                onChange={(v) =>
                    setFilters((f) => ({ ...f, type: v as KBType | "" }))
                }
                testId="kb-filter-type"
            />

            <FilterDropdown
                label="Creator"
                value={filters.creator}
                options={["Oliver Roberts"]}
                onChange={(v) =>
                    setFilters((f) => ({ ...f, creator: v }))
                }
                testId="kb-filter-creator"
            />
        </div>

        {/* Body */}
        <div className="mt-5 flex-1 min-h-0 flex flex-col">
            {isLoading || isLoadingFiles ? (
                <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white flex flex-col flex-1 shadow-sm">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_56px] items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        <span className="normal-case text-sm tracking-normal text-zinc-600 font-medium">Name</span>
                        <span className="normal-case text-sm tracking-normal text-zinc-600 font-medium">Size</span>
                        <span className="normal-case text-sm tracking-normal text-zinc-600 font-medium">Owner</span>
                        <span className="normal-case text-sm tracking-normal text-zinc-600 font-medium">Created Date</span>
                        <span className="w-8" />
                    </div>
                    <div className="divide-y divide-zinc-100 flex-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_56px] items-center gap-2 px-5 py-3.5 h-[60px]">
                                <div className="flex items-center gap-3">
                                    <div className="h-5 w-5 rounded bg-zinc-100 animate-pulse shrink-0" />
                                    <div className="h-4 w-40 bg-zinc-100 rounded animate-pulse" />
                                </div>
                                <div className="h-4 w-16 bg-zinc-100 rounded animate-pulse" />
                                <div className="h-4 w-28 bg-zinc-100 rounded animate-pulse" />
                                <div className="h-4 w-24 bg-zinc-100 rounded animate-pulse" />
                                <div className="h-8 w-8 bg-zinc-100 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : isEmpty ? (
                <KnowledgeBaseEmptyState />
            ) : (
                <KnowledgeBaseTable
                    entries={currentTableEntries}
                    onDelete={handleDelete}
                    onView={(entry) => {
                        if (entry.type === "folder") {
                            setCurrentFolder(entry);
                        } else {
                            setSelectedEntry(entry);
                            // For files, show detail drawer if needed or let them view
                            toast.info(`Viewing file: ${entry.name}`);
                        }
                    }}
                    isInsideFolder={!!currentFolder}
                />
            )}
        </div>



        <AskAiDrawer
            open={askAiOpen}
            onOpenChange={setAskAiOpen}
            folderId={selectedEntry?.id}
        />

        <CreateFolderDrawer
            open={folderOpen}
            onOpenChange={setFolderOpen}
            onSubmit={handleCreateFolder}
        />

        <AddFilesDrawer
            open={filesOpen}
            onOpenChange={setFilesOpen}
            onSubmit={handleAddFiles}
            folders={currentFolder ? [currentFolder] : folders}
            isInsideFolder={!!currentFolder}
        />

        <AddTextDrawer
            open={textOpen}
            onOpenChange={setTextOpen}
            onSubmit={handleAddText}
            folders={currentFolder ? [currentFolder] : folders}
            isInsideFolder={!!currentFolder}
        />

        <AddUrlDrawer
            open={urlOpen}
            onOpenChange={setUrlOpen}
            onSubmit={handleAddUrl}
            folders={currentFolder ? [currentFolder] : folders}
            isInsideFolder={!!currentFolder}
        />
    </div>
);
}