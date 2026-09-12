"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export function Tooltip({
  children,
  content,
  side = "top",
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  const arrowClasses = {
    top: "left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-orange-500",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-orange-500",
    left: "left-full top-1/2 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-orange-500",
    right:
      "right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-orange-500",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      <div
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-orange-500 px-3 py-2 text-xs font-medium text-white shadow-lg shadow-orange-500/20 transition-all duration-150",
          positionClasses[side],
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "scale-95 opacity-0",
          side === "top" && visible && "-translate-x-1/2 -translate-y-0.5",
          side === "bottom" && visible && "-translate-x-1/2 translate-y-0.5",
          side === "left" && visible && "-translate-y-1/2 -translate-x-0.5",
          side === "right" && visible && "-translate-y-1/2 translate-x-0.5",
          className,
        )}
      >
        {content}

        <span
          className={cn("absolute h-0 w-0 border-solid", arrowClasses[side])}
        />
      </div>
    </div>
  );
}
