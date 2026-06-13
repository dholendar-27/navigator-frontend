import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  className?: string;
  iconClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  maxWidth?: string;
}

export function InfoTooltip({
  content,
  className,
  iconClassName,
  side = "top",
  maxWidth = "220px",
}: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn("inline-flex items-center cursor-help focus:outline-none", className)}
            tabIndex={-1}
            aria-label="More information"
          >
            <Info
              className={cn(
                "h-3.5 w-3.5 text-zinc-400 hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors",
                iconClassName
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} style={{ maxWidth }}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
