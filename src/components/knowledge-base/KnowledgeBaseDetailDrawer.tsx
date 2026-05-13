import { useEffect, useState, useRef } from "react";
import { X, FolderClosed, FileText, Loader2, Plus, Search, Minus } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { getFolder, uploadFiles, deleteFiles, updateFolder } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { KBEntry } from "@/types/knowledge-base";

interface KBDetailDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry: KBEntry | null;
    onRefreshParent?: () => void;
}

export default function KnowledgeBaseDetailDrawer({
    open,
    onOpenChange,
    entry,
    onRefreshParent,
}: KBDetailDrawerProps) {
    const { getToken } = useKindeAuth();
    
    // Core states
    const [files, setFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    
    // Mode toggle state: "view" or "edit"
    const [mode, setMode] = useState<"view" | "edit">("view");

    // Form states (Draft values during edit)
    const [nameDraft, setNameDraft] = useState<string>("");
    const [descDraft, setDescDraft] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Fetch the S3 files dynamically from the backend for the opened folder
    const fetchFolderFiles = async () => {
        if (!entry || entry.type !== "folder") return;
        try {
            setIsLoading(true);
            const token = await getToken();
            if (token) {
                const folderData = await getFolder(entry.id, token);
                setFiles(folderData.files || []);
                // Update draft values when opening folder/fetching fresh data
                setNameDraft(folderData.name || "");
                setDescDraft(folderData.description || "");
            }
        } catch (err: any) {
            console.error("Error fetching folder details:", err);
            toast.error(err.message || "Failed to load folder details");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset mode and fetch files on open/entry changes
    useEffect(() => {
        if (open && entry) {
            setMode("view");
            if (entry.type === "folder") {
                fetchFolderFiles();
            } else {
                setFiles([]);
                setNameDraft(entry.name || "");
                setDescDraft(entry.folder || "");
            }
        } else {
            setFiles([]);
        }
    }, [open, entry]);

    // Handle single file deletion (minus icon)
    const handleDeleteFile = async (fileId: string, filename: string) => {
        try {
            const token = await getToken();
            if (token) {
                await deleteFiles([fileId], token);
                toast.success(`Removed "${filename}" successfully`);
                fetchFolderFiles();
            }
        } catch (err: any) {
            console.error("Error deleting file:", err);
            toast.error(err.message || "Failed to delete file");
        }
    };

    // S3 File Upload Handler (instantly triggered via "+ Add" button)
    const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !entry) return;
        try {
            setIsLoading(true);
            const token = await getToken();
            if (token) {
                toast.loading("Uploading documents to folder...", { id: "drawer-upload" });
                await uploadFiles(entry.id, Array.from(e.target.files), token);
                toast.success("Documents added successfully", { id: "drawer-upload" });
                fetchFolderFiles();
            }
        } catch (err: any) {
            console.error("Error uploading files:", err);
            toast.error(err.message || "Failed to upload files", { id: "drawer-upload" });
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Save folder changes (PATCH to backend /folders/{folder_id})
    const handleSave = async () => {
        if (!entry) return;
        try {
            setIsLoading(true);
            const token = await getToken();
            if (token) {
                await updateFolder(entry.id, { name: nameDraft, description: descDraft }, token);
                toast.success("Folder updated successfully");
                setMode("view");
                if (onRefreshParent) onRefreshParent();
                fetchFolderFiles();
            }
        } catch (err: any) {
            console.error("Error saving folder:", err);
            toast.error(err.message || "Failed to save folder changes");
        } finally {
            setIsLoading(false);
        }
    };

    if (!entry) return null;

    // Filter files list locally with search query
    const filteredFiles = files.filter((f) =>
        f.original_filename?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                hideClose
                className="flex w-full flex-col gap-0 p-0 sm:max-w-[1100px] border-l border-zinc-200 bg-white"
                data-testid="kb-detail-drawer"
            >
                {/* Upper Top Bar */}
                <div className="flex items-center gap-3 border-b border-zinc-100 px-8 py-5">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <SheetTitle className="text-xl font-semibold text-zinc-900 tracking-tight">
                        Knowledge Base
                    </SheetTitle>
                </div>

                {/* 2-Column Responsive Body */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-y-auto min-h-0 bg-white">
                    
                    {/* Left Column: Form Details (4 Cols) */}
                    <div className="md:col-span-4 p-8 border-r border-zinc-100 space-y-6 flex flex-col justify-between">
                        <div className="space-y-6">
                            {/* Folder Name */}
                            <div className="space-y-2">
                                <Label className="text-[13px] font-semibold text-zinc-500 tracking-wide uppercase">
                                    Folder Name
                                </Label>
                                <Input
                                    value={nameDraft}
                                    onChange={(e) => setNameDraft(e.target.value)}
                                    disabled={mode === "view"}
                                    placeholder="Enter folder name"
                                    className={cn(
                                        "h-11 rounded-xl border-zinc-200 font-medium text-zinc-950 focus:border-zinc-400 focus:ring-0 focus-visible:ring-0 transition-all",
                                        mode === "view" && "bg-zinc-50/50 border-zinc-100 text-zinc-600 cursor-not-allowed"
                                    )}
                                />
                            </div>

                            {/* Folder Description */}
                            <div className="space-y-2">
                                <Label className="text-[13px] font-semibold text-zinc-500 tracking-wide uppercase">
                                    Description
                                </Label>
                                <Textarea
                                    value={descDraft}
                                    onChange={(e) => setDescDraft(e.target.value.slice(0, 500))}
                                    disabled={mode === "view"}
                                    placeholder="Enter folder description..."
                                    rows={8}
                                    className={cn(
                                        "rounded-xl border-zinc-200 font-medium text-zinc-950 focus:border-zinc-400 focus:ring-0 focus-visible:ring-0 leading-relaxed resize-none transition-all",
                                        mode === "view" && "bg-zinc-50/50 border-zinc-100 text-zinc-600 cursor-not-allowed"
                                    )}
                                />
                                {mode === "edit" && (
                                    <div className="text-[11px] font-medium text-zinc-400 text-right mt-1">
                                        {descDraft.length}/500
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Edit Action Toggle in Left Column */}
                        {mode === "view" && (
                            <Button
                                onClick={() => setMode("edit")}
                                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold text-sm shadow-sm transition-all mt-6"
                            >
                                Edit Folder Details
                            </Button>
                        )}
                    </div>

                    {/* Right Column: Files & Documents List (8 Cols) */}
                    <div className="md:col-span-8 p-8 flex flex-col min-h-0 bg-white">
                        
                        {/* Title & "+ Add" Action */}
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-zinc-900">Folder Documents</h3>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[11px] font-black">{files.length}</span>
                            </div>

                            {/* + Add button to quickly upload documents */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="h-10 px-4 rounded-xl border-zinc-200 hover:bg-zinc-50 font-bold text-[13px] text-zinc-800 gap-1.5 transition-all shadow-sm"
                            >
                                <Plus className="h-4 w-4" />
                                Add
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".pdf,.docx,.txt"
                                className="hidden"
                                onChange={handleUploadFiles}
                            />
                        </div>

                        {/* Search bar */}
                        <div className="relative mt-5">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search documents..."
                                className="h-11 rounded-xl border-zinc-200 bg-zinc-50/20 pl-11 text-[13px] font-medium placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-0 transition-all"
                            />
                        </div>

                        {/* Documents Table/Grid */}
                        <div className="flex-1 mt-5 border border-zinc-100 rounded-2xl overflow-hidden flex flex-col min-h-0 bg-white">
                            {/* Header row */}
                            <div className="grid grid-cols-12 gap-4 bg-zinc-50/75 border-b border-zinc-100 px-6 py-3.5 text-xs font-semibold text-zinc-500 tracking-wider uppercase">
                                <div className="col-span-1 flex items-center justify-center">
                                    <input type="checkbox" className="rounded border-zinc-300 h-4 w-4 text-blue-600 focus:ring-blue-500" disabled />
                                </div>
                                <div className="col-span-7">Knowledge Base Name</div>
                                <div className="col-span-3">Last Updated On</div>
                                <div className="col-span-1"></div>
                            </div>

                            {/* Scrollable Rows */}
                            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
                                {isLoading && files.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
                                        <Loader2 className="h-8 w-8 animate-spin text-zinc-400 mb-2" />
                                        <span className="text-sm font-semibold text-zinc-800">Loading documents...</span>
                                    </div>
                                ) : filteredFiles.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <FileText className="h-10 w-10 text-zinc-300 mb-3" />
                                        <span className="text-sm font-semibold text-zinc-800">No documents found</span>
                                        <p className="text-xs text-zinc-400 max-w-xs mt-1">
                                            {searchQuery ? "Try refining your search keyword" : "Click 'Add' above to upload documents directly into this folder."}
                                        </p>
                                    </div>
                                ) : (
                                    filteredFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-50/40 transition-colors"
                                        >
                                            {/* Checkbox column */}
                                            <div className="col-span-1 flex items-center justify-center">
                                                <input type="checkbox" className="rounded border-zinc-300 h-4 w-4 text-blue-600 focus:ring-blue-500" />
                                            </div>

                                            {/* File metadata title & description */}
                                            <div className="col-span-7 flex items-center gap-3.5 min-w-0">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 border border-zinc-200/10">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="truncate min-w-0">
                                                    <div className="text-[13px] font-bold text-zinc-900 truncate" title={file.original_filename}>
                                                        {file.original_filename}
                                                    </div>
                                                    <div className="text-[11px] font-semibold text-zinc-400 mt-0.5">
                                                        {(file.file_size / 1024).toFixed(1)} KB • {file.mime_type ? file.mime_type.split("/")[1]?.toUpperCase() : "Document"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Date updated */}
                                            <div className="col-span-3 text-[13px] font-semibold text-zinc-500">
                                                {new Date(file.created_at).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </div>

                                            {/* Delete/Remove button (Rendered ONLY in EDIT MODE!) */}
                                            <div className="col-span-1 flex items-center justify-center">
                                                {mode === "edit" ? (
                                                    <button
                                                        onClick={() => handleDeleteFile(file.id, file.original_filename)}
                                                        className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all shadow-sm"
                                                        aria-label="Delete File"
                                                        title="Delete File"
                                                    >
                                                        <Minus className="h-3 w-3 stroke-[3]" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100/50 border border-zinc-200/50 text-zinc-300 cursor-not-allowed transition-all"
                                                        aria-label="Delete File Disabled"
                                                        title="Click 'Edit Folder Details' to enable file deletion"
                                                        disabled
                                                    >
                                                        <Minus className="h-3 w-3 stroke-[3]" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bar (Visible only during active Edit mode) */}
                {mode === "edit" ? (
                    <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-8 py-4">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setMode("view");
                                fetchFolderFiles(); // Reset draft values
                            }}
                            className="text-zinc-600 hover:text-zinc-900 font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading || nameDraft.trim().length === 0}
                            className="px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm shadow-sm transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-8 py-4">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-zinc-600 hover:text-zinc-900 font-bold"
                        >
                            Close
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
