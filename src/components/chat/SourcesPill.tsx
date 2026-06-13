import { useState } from "react";
import { Folder, Globe } from "lucide-react";
import { toast } from "sonner";
import type { Citation } from "@/lib/api";
import { CitationPill } from "./CitationPill";
import { safeOpen } from "@/utils/safeUrl";

interface SourcesPillProps {
    sources: Citation[];
    onSourceClick?: (citation: Citation) => void;
}

export function SourcesPill({ sources, onSourceClick }: SourcesPillProps) {
    const [showAll, setShowAll] = useState(false);
    const MAX_VISIBLE = 4;

    // Deduplicate by filename/domain
    const uniqueSources: { filename: string; isWeb: boolean; domain?: string; citation: Citation }[] = [];
    const seen = new Set<string>();
    sources.forEach(src => {
        const isWeb = src.file_id === null || src.file_id === undefined;
        let domain: string | undefined;
        if (isWeb && src.heading_path) {
            try { domain = new URL(src.heading_path).hostname; } catch { domain = undefined; }
        }
        const key = isWeb ? (domain || src.filename) : src.filename;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueSources.push({ filename: src.filename, isWeb, domain, citation: src });
        }
    });

    const visible = showAll ? uniqueSources : uniqueSources.slice(0, MAX_VISIBLE);
    const overflow = uniqueSources.length - MAX_VISIBLE;

    const handleClick = (src: typeof uniqueSources[number]) => {
        if (onSourceClick) {
            onSourceClick(src.citation);
        } else if (src.isWeb && src.citation.heading_path) {
            safeOpen(src.citation.heading_path);
        } else {
            toast.info(`"${src.filename}" is in your Knowledge Base`);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mr-0.5 select-none">
                Sources
            </span>
            {visible.map((src, idx) => {
                const faviconUrl = src.isWeb && src.domain
                    ? `https://www.google.com/s2/favicons?sz=64&domain=${src.domain}`
                    : null;

                return (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => handleClick(src)}
                        title={src.citation.content_preview || src.filename}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#eae9e4] hover:bg-[#ddddd7] dark:bg-zinc-800/70 dark:hover:bg-zinc-700/80 border border-zinc-200/40 dark:border-zinc-700/50 rounded-full text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 transition-all cursor-pointer select-none"
                    >
                        {src.isWeb ? (
                            faviconUrl ? (
                                <img
                                    src={faviconUrl}
                                    alt=""
                                    className="h-3 w-3 rounded-full object-contain shrink-0 bg-white"
                                    onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                                />
                            ) : (
                                <Globe className="h-3 w-3 text-zinc-400 shrink-0" />
                            )
                        ) : (
                            <Folder className="h-3 w-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
                        )}
                        <span className="max-w-[140px] truncate">{src.isWeb ? (src.domain || src.filename) : src.filename}</span>
                    </button>
                );
            })}
            {!showAll && overflow > 0 && (
                <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors select-none cursor-pointer"
                >
                    +{overflow} more
                </button>
            )}
            {showAll && uniqueSources.length > MAX_VISIBLE && (
                <button
                    type="button"
                    onClick={() => setShowAll(false)}
                    className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors select-none cursor-pointer"
                >
                    Show less
                </button>
            )}
        </div>
    );
}

export { CitationPill };
