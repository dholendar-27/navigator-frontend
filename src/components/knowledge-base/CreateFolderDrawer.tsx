import { useEffect, useState } from "react";
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
import type { KBEntry, CreateFolderPayload } from "@/types/knowledge-base";

interface CreateFolderDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: CreateFolderPayload) => void;
    folders: KBEntry[];
}

export default function CreateFolderDrawer({
    open,
    onOpenChange,
    onSubmit,
    folders,
}: CreateFolderDrawerProps) {
    const [name, setName] = useState<string>("");
    const [folder, setFolder] = useState<string>("Root");

    useEffect(() => {
        if (!open) {
            setName("");
            setFolder("Root");
        }
    }, [open]);

    const canCreate = name.trim().length > 0;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
                data-testid="create-folder-drawer"
            >
                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-5">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        data-testid="close-create-folder-btn"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <SheetTitle className="text-lg font-semibold text-zinc-900">
                        Create Folder
                    </SheetTitle>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="folder-name"
                            className="text-sm font-medium text-zinc-700"
                        >
                            Folder Name
                        </Label>

                        <Input
                            id="folder-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter knowledge base folder name"
                            data-testid="folder-name-input"
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
                                data-testid="folder-select"
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
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-white px-6 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        data-testid="cancel-folder-btn"
                        className="text-zinc-600 hover:text-zinc-900"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() =>
                            onSubmit({ name: name.trim(), folder: folder })
                        }
                        disabled={!canCreate}
                        data-testid="create-folder-submit-btn"
                        className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Create
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}