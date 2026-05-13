import { useEffect, useRef, useState } from "react";
import { X, FilePlus2, FileText, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { KBEntry } from "@/types/knowledge-base";

interface AddFilesDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (folderId: string, files: File[]) => Promise<void> | void;
    folders: KBEntry[];
    isInsideFolder?: boolean;
}

export default function AddFilesDrawer({
    open,
    onOpenChange,
    onSubmit,
    folders,
    isInsideFolder = false,
}: AddFilesDrawerProps) {
    const [folder, setFolder] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!open) {
            setFolder("");
            setFiles([]);
            setIsDragging(false);
            setIsUploading(false);
        } else if (folders.length > 0) {
            setFolder(folders[0].id);
        }
    }, [open, folders]);

    const handleFiles = (newFiles: FileList | File[]) => {
        const arr = Array.from(newFiles);

        // Filter to allowed types and 25MB max
        const valid = arr.filter((f) => {
            const ok = /\.(pdf|docx|txt)$/i.test(f.name) && f.size <= 25 * 1024 * 1024;
            return ok;
        });

        setFiles((prev) => [...prev, ...valid]);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleSubmit = async () => {
        setIsUploading(true);
        try {
            await onSubmit(folder, files);
        } finally {
            setIsUploading(false);
        }
    };

    const canAdd = folder.length > 0 && files.length > 0 && !isUploading;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
                data-testid="add-files-drawer"
            >
                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-5">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        data-testid="close-add-files-btn"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <SheetTitle className="text-lg font-semibold text-zinc-900">
                        Add Files
                    </SheetTitle>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    {/* Folder */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Select Folder <span className="text-red-500 ml-0.5">*</span>
                        </Label>

                        <Select value={folder} onValueChange={setFolder} disabled={isInsideFolder || isUploading}>
                            <SelectTrigger
                                className="h-11 rounded-lg border-zinc-200"
                                data-testid="add-files-folder-select"
                            >
                                <SelectValue placeholder="Select folder" />
                            </SelectTrigger>

                            <SelectContent>
                                {folders.map((f) => (
                                    <SelectItem key={f.id} value={f.id}>
                                        {f.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Dropzone */}
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        className={cn(
                            "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
                            isDragging
                                ? "border-blue-400 bg-blue-50/40"
                                : "border-zinc-200 bg-zinc-50/50",
                            isUploading && "opacity-50 pointer-events-none"
                        )}
                        data-testid="add-files-dropzone"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                            <FilePlus2 className="h-6 w-6 text-zinc-700" />
                        </div>

                        <p className="mt-4 text-sm text-zinc-700">
                            Drag your files to upload or{" "}
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="font-medium text-blue-600 hover:underline cursor-pointer"
                                data-testid="add-files-click-here"
                            >
                                Click Here
                            </button>
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                            Max up to 25 MB each file size
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-400">
                            .pdf, .docx, .txt
                        </p>

                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf,.docx,.txt"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                                e.target.files && handleFiles(e.target.files)
                            }
                            data-testid="add-files-input"
                        />
                    </div>

                    {/* Uploading progress state */}
                    {isUploading && (
                        <div className="space-y-2 rounded-xl bg-blue-50/50 p-4 border border-blue-100">
                            <div className="flex items-center justify-between text-sm font-medium text-blue-700">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Uploading files...</span>
                                </div>
                                <span>Processing</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
                                <div className="h-full w-3/4 animate-pulse rounded-full bg-blue-600" />
                            </div>
                        </div>
                    )}

                    {/* File list */}
                    {files.length > 0 && (
                        <div className="space-y-2" data-testid="add-files-list">
                            {files.map((f, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <FileText className="h-4 w-4 shrink-0 text-zinc-500" />
                                        <span className="truncate text-sm text-zinc-700">
                                            {f.name}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={isUploading}
                                        onClick={() =>
                                            setFiles((prev) =>
                                                prev.filter((_, idx) => idx !== i)
                                            )
                                        }
                                        className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50"
                                        aria-label="Remove"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-white px-6 py-4">
                    <Button
                        variant="ghost"
                        disabled={isUploading}
                        onClick={() => onOpenChange(false)}
                        data-testid="cancel-add-files-btn"
                        className="text-zinc-600 hover:text-zinc-900 rounded-lg"
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={!canAdd}
                        onClick={handleSubmit}
                        data-testid="add-files-submit-btn"
                        className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isUploading ? "Uploading..." : "Add"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}