import { useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import type { KBEntry, AddTextPayload } from "@/types/knowledge-base";

interface AddTextDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: AddTextPayload) => void;
    folders: KBEntry[];
    isInsideFolder?: boolean;
}

export default function AddTextDrawer({
    open,
    onOpenChange,
    onSubmit,
    folders,
    isInsideFolder = false,
}: AddTextDrawerProps) {
    const [title, setTitle] = useState<string>("");
    const [folder, setFolder] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [touched, setTouched] = useState<{ title?: boolean; content?: boolean; folder?: boolean }>({});

    useEffect(() => {
        if (!open) {
            setTitle("");
            setFolder("");
            setContent("");
            setTouched({});
        } else if (folders.length > 0) {
            setFolder(folders[0].name);
        }
    }, [open, folders]);

    const isTitleValid = title.trim().length > 0;
    const isContentValid = content.trim().length > 0;
    const isFolderValid = folder.trim().length > 0;

    const canSave = isTitleValid && isContentValid && isFolderValid;

    const handleBlur = (field: "title" | "content" | "folder") => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
                data-testid="add-text-drawer"
            >
                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-5">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        data-testid="close-add-text-btn"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <SheetTitle className="text-lg font-semibold text-zinc-900">
                        Add Text
                    </SheetTitle>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Title <span className="text-red-500 ml-0.5">*</span>
                        </Label>

                        <Input
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setTouched((prev) => ({ ...prev, title: true }));
                            }}
                            onBlur={() => handleBlur("title")}
                            placeholder="Enter a title"
                            data-testid="text-title-input"
                            className="h-11 rounded-lg border-zinc-200"
                        />
                        {touched.title && !isTitleValid && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>Title is required.</span>
                            </div>
                        )}
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
                                data-testid="text-folder-select"
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

                    {/* Content */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Content <span className="text-red-500 ml-0.5">*</span>
                        </Label>

                        <Textarea
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                setTouched((prev) => ({ ...prev, content: true }));
                            }}
                            onBlur={() => handleBlur("content")}
                            rows={8}
                            placeholder="Paste or write the content..."
                            data-testid="text-content-input"
                            className="rounded-lg border-zinc-200"
                        />
                        {touched.content && !isContentValid && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>Content is required.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-white px-6 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        data-testid="cancel-add-text-btn"
                        className="text-zinc-600 hover:text-zinc-900 rounded-lg"
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={!canSave}
                        onClick={() =>
                            onSubmit({
                                title: title.trim(),
                                folder: folder,
                                content: content.trim(),
                            })
                        }
                        data-testid="add-text-submit-btn"
                        className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}