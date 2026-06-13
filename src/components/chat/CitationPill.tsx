import { useState } from "react";
import { Folder, Globe } from "lucide-react";
import type { Citation } from "@/lib/api";
import { cn } from "@/lib/utils";
import { safeOpen } from "@/utils/safeUrl";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const getCitationForReference = (
    refType: "Source" | "Web",
    index: number,
    citations?: Citation[]
): Citation | undefined => {
    if (!citations) return undefined;
    if (refType === "Source") {
        const internal = citations.filter(c => c.file_id !== null && c.file_id !== undefined);
        return internal[index - 1];
    } else {
        const web = citations.filter(c => c.file_id === null || c.file_id === undefined);
        return web[index - 1];
    }
};

interface CitationPillProps {
    citation: Citation;
    type: "Source" | "Web";
    index: number;
    onSourceClick?: (citation: Citation) => void;
}

export function CitationPill({ citation, type, index, onSourceClick }: CitationPillProps) {
    const isWeb = type === "Web";
    const [imgError, setImgError] = useState(false);

    const getDomain = (url?: string) => {
        if (!url) return null;
        try { return new URL(url).hostname; } catch { return null; }
    };

    const domain = isWeb ? getDomain(citation.heading_path) : null;
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}` : null;

    const handleClick = () => {
        if (isWeb && citation.heading_path) {
            safeOpen(citation.heading_path);
        } else if (onSourceClick) {
            onSourceClick(citation);
        }
    };

    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span
                        onClick={handleClick}
                        className={cn(
                            "inline-flex items-center gap-[3px] px-[5px] py-[2px] rounded-[4px] text-[10px] font-bold transition-all cursor-pointer select-none align-baseline relative -top-[2px] mx-[2px]",
                            isWeb
                                ? "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-700/50"
                                : "bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40"
                        )}
                    >
                        {isWeb ? (
                            faviconUrl && !imgError ? (
                                <img
                                    src={faviconUrl}
                                    alt=""
                                    onError={() => setImgError(true)}
                                    className="h-2.5 w-2.5 rounded-full object-contain shrink-0"
                                />
                            ) : (
                                <Globe className="h-2.5 w-2.5 shrink-0" />
                            )
                        ) : (
                            <Folder className="h-2.5 w-2.5 shrink-0" />
                        )}
                        <span>{index}</span>
                    </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-52 p-2">
                    <p className="font-semibold text-[11px] leading-snug">{citation.filename}</p>
                    {citation.content_preview && (
                        <p className="text-[10px] text-muted-foreground mt-1 leading-snug line-clamp-3">
                            {citation.content_preview}
                        </p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
