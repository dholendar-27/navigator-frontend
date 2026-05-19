import { useLayoutEffect, useRef, useState } from "react";

const SKELETON_HEADER_H = 45;    // header row height
const SKELETON_FOOTER_H = 53;    // pagination / footer placeholder
const SKELETON_ROW_H = 60;       // each data row height

export interface SkeletonColumnDef {
    /** Tailwind width class for the shimmer bar, e.g. "w-32" */
    width: string;
    /** Optional: render a custom cell instead of a single bar */
    render?: () => React.ReactNode;
    /** Optional: hide this column on mobile screens */
    hideOnMobile?: boolean;
}

export interface SkeletonTableProps {
    /** Column definitions — one entry per column */
    columns: SkeletonColumnDef[];
    /** CSS grid-cols value on desktop, e.g. "[48px_2fr_1fr_1fr_1fr_56px]" */
    gridCols: string;
    /** Optional: CSS grid-cols value on mobile, e.g. "[1fr_56px]" */
    mobileGridCols?: string;
    /** Header label strings — length must match columns */
    headers: React.ReactNode[];
    /** Whether to show the pagination footer placeholder (default true) */
    showFooter?: boolean;
}

/**
 * A height-aware skeleton table.
 *
 * Attach `containerRef` to the wrapper element whose height you want to fill,
 * then render <SkeletonTable ... /> inside that wrapper.
 * The component self-measures via ResizeObserver and renders exactly as many
 * rows as can fit without overflow.
 */
export function SkeletonTable({
    columns,
    gridCols,
    mobileGridCols,
    headers,
    showFooter = true,
}: SkeletonTableProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [rowCount, setRowCount] = useState(8);
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

    useLayoutEffect(() => {
        if (typeof window === "undefined") return;
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useLayoutEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const compute = () => {
            const footerH = showFooter ? SKELETON_FOOTER_H : 0;
            const available = el.clientHeight - SKELETON_HEADER_H - footerH;
            setRowCount(Math.max(1, Math.floor(available / SKELETON_ROW_H)));
        };

        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(el);
        return () => ro.disconnect();
    }, [showFooter]);

    const activeGridCols = isMobile && mobileGridCols ? mobileGridCols : gridCols;
    const resolvedGridCols = activeGridCols.replace(/[\[\]]/g, "").replace(/_/g, " ");

    const visibleColumns = columns.filter((col) => !(isMobile && col.hideOnMobile));
    const visibleHeaders = headers.filter((_, idx) => !(isMobile && columns[idx]?.hideOnMobile));

    return (
        <div
            ref={wrapperRef}
            className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col flex-1 shadow-sm"
        >
            {/* Header */}
            <div
                style={{ gridTemplateColumns: resolvedGridCols }}
                className="grid items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/80 px-5 py-3 shrink-0"
            >
                {visibleHeaders.map((h, i) =>
                    typeof h === "string" ? (
                        <span
                            key={i}
                            className="normal-case text-sm tracking-normal text-zinc-600 dark:text-zinc-400 font-medium"
                        >
                            {h}
                        </span>
                    ) : (
                        <div key={i}>{h}</div>
                    )
                )}
            </div>

            {/* Rows */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 flex-1 overflow-hidden">
                {Array.from({ length: rowCount }).map((_, i) => (
                    <div
                        key={i}
                        style={{ gridTemplateColumns: resolvedGridCols }}
                        className="grid items-center gap-2 px-5 py-3.5 h-[60px]"
                    >
                        {visibleColumns.map((col, j) =>
                            col.render ? (
                                <div key={j}>{col.render()}</div>
                            ) : (
                                <div
                                    key={j}
                                    className={`h-4 ${col.width} bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse`}
                                />
                            )
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination placeholder */}
            {showFooter && (
                <div className="flex items-center justify-end gap-4 px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="flex gap-1">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="h-8 w-8 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
