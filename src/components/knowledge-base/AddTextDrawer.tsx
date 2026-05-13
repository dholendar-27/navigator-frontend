import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
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

interface AddTextPayload {
    title: string;
    folder: string;
    content: string;
}

interface AddTextDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: AddTextPayload) => void;
    folders: { id: string; name: string }[];
}

export default function AddTextDrawer({
    open,
    onOpenChange,
    onSubmit,
    folders,
}: AddTextDrawerProps) {
    const [title, setTitle] = useState<string>("");
    const [folder, setFolder] = useState<string>("Root");
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        if (!open) {
            setTitle("");
            setFolder("Root");
            setContent("");
        }
    }, [open]);

    const canSave =
        title.trim().length > 0 &&
        content.trim().length > 0;

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
                            Title
                        </Label>

                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a title"
                            data-testid="text-title-input"
                            className="h-11 rounded-lg border-zinc-200"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Select Folder
                        </Label>

                        <Select
                            value={folder}
                            onValueChange={setFolder}
                        >
                            <SelectTrigger
                                className="h-11 rounded-lg border-zinc-200"
                                data-testid="text-folder-select"
                            >
                                <SelectValue placeholder="Select folder" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="Root">Root</SelectItem>
                                {folders.map((f) => (
                                    <SelectItem key={f.id} value={f.name}>
                                        {f.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Content
                        </Label>

                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            placeholder="Paste or write the content..."
                            data-testid="text-content-input"
                            className="rounded-lg border-zinc-200"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-white px-6 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        data-testid="cancel-add-text-btn"
                        className="text-zinc-600 hover:text-zinc-900"
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