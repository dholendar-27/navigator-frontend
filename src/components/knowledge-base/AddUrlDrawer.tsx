import { useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import type { KBEntry, AddUrlPayload } from "@/types/knowledge-base";

interface AddUrlDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: AddUrlPayload) => void;
    folders: KBEntry[];
    isInsideFolder?: boolean;
}

export default function AddUrlDrawer({
    open,
    onOpenChange,
    onSubmit,
    folders,
    isInsideFolder = false,
}: AddUrlDrawerProps) {
    const [url, setUrl] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [folder, setFolder] = useState<string>("");
    const [touched, setTouched] = useState<{ url?: boolean; folder?: boolean }>({});

    useEffect(() => {
        if (!open) {
            setUrl("");
            setTitle("");
            setFolder("");
            setTouched({});
        } else if (folders.length > 0) {
            setFolder(folders[0].name);
        }
    }, [open, folders]);

    const trimmedUrl = url.trim();
    const isValidUrl = /^https?:\/\//i.test(trimmedUrl);
    const isFolderValid = folder.trim().length > 0;

    const canSave = trimmedUrl.length > 0 && isValidUrl && isFolderValid;

    const handleBlur = (field: "url" | "folder") => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
                data-testid="add-url-drawer"
            >
                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-5">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        data-testid="close-add-url-btn"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <SheetTitle className="text-lg font-semibold text-zinc-900">
                        Add URL
                    </SheetTitle>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    {/* URL */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            URL <span className="text-red-500 ml-0.5">*</span>
                        </Label>

                        <Input
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setTouched((prev) => ({ ...prev, url: true }));
                            }}
                            onBlur={() => handleBlur("url")}
                            placeholder="https://example.com/docs"
                            data-testid="url-input"
                            className="h-11 rounded-lg border-zinc-200"
                        />
                        {touched.url && trimmedUrl === "" && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>URL is required.</span>
                            </div>
                        )}
                        {touched.url && trimmedUrl !== "" && !isValidUrl && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>Please enter a valid URL starting with http:// or https://.</span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Title (optional)
                        </Label>

                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Custom display name"
                            data-testid="url-title-input"
                            className="h-11 rounded-lg border-zinc-200"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Select Folder <span className="text-red-500 ml-0.5">*</span>
                        </Label>

                        <Select
                            value={folder}
                            onValueChange={(v) => {
                                setFolder(v);
                                setTouched((prev) => ({ ...prev, folder: true }));
                            }}
                            disabled={isInsideFolder}
                        >
                            <SelectTrigger
                                className="h-11 rounded-lg border-zinc-200"
                                data-testid="url-folder-select"
                            >
                                <SelectValue placeholder="Select folder" />
                            </SelectTrigger>

                            <SelectContent>
                                {folders.map((f) => (
                                    <SelectItem key={f.id} value={f.name}>
                                        {f.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {touched.folder && !isFolderValid && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>Please select a folder.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-white px-6 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        data-testid="cancel-add-url-btn"
                        className="text-zinc-600 hover:text-zinc-900 rounded-lg"
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={!canSave}
                        onClick={() =>
                            onSubmit({
                                url: trimmedUrl,
                                title: title.trim(),
                                folder: folder,
                            })
                        }
                        data-testid="add-url-submit-btn"
                        className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}