import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
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

const CATEGORIES = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Compliance",
] as const;

type Category = (typeof CATEGORIES)[number];

interface AddUrlPayload {
    url: string;
    title: string;
    category: Category;
}

interface AddUrlDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: AddUrlPayload) => void;
}

export default function AddUrlDrawer({
    open,
    onOpenChange,
    onSubmit,
}: AddUrlDrawerProps) {
    const [url, setUrl] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<Category | "">("");

    useEffect(() => {
        if (!open) {
            setUrl("");
            setTitle("");
            setCategory("");
        }
    }, [open]);

    const trimmedUrl = url.trim();
    const isValidUrl = /^https?:\/\//i.test(trimmedUrl);

    const canSave =
        trimmedUrl.length > 0 && isValidUrl && category !== "";

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
                            URL
                        </Label>

                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/docs"
                            data-testid="url-input"
                            className="h-11 rounded-lg border-zinc-200"
                        />
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

                    {/* Category */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Category
                        </Label>

                        <Select
                            value={category}
                            onValueChange={(value: Category) => setCategory(value)}
                        >
                            <SelectTrigger
                                className="h-11 rounded-lg border-zinc-200"
                                data-testid="url-category-select"
                            >
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>

                            <SelectContent>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-white px-6 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        data-testid="cancel-add-url-btn"
                        className="text-zinc-600 hover:text-zinc-900"
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={!canSave}
                        onClick={() =>
                            onSubmit({
                                url: trimmedUrl,
                                title: title.trim(),
                                category: category as Category,
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