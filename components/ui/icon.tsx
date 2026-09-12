import * as React from "react";

export type IconName =
  | "chart"
  | "calendar"
  | "bowl"
  | "target"
  | "settings"
  | "search"
  | "bell"
  | "arrow"
  | "flame"
  | "plus"
  | "food"
  | "more";

export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    className: `h-5 w-5 ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  const paths: Record<IconName, React.ReactNode> = {
    chart: (
      <>
        <path d="M4 19V5m0 14h16" />
        <path d="m7 15 3-4 3 2 5-7" />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M7.5 3v4m9-4v4M3.5 10h17" />
      </>
    ),
    bowl: (
      <>
        <path d="M4 11h16c0 5-3.6 9-8 9s-8-4-8-9Z" />
        <path d="M2.5 11h19M12 4v4m-4-2 1.5 2M16 6l-1.5 2" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="m17.5 6.5 3-3" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.32 2.32-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20.5h-3.28v-.08A1.7 1.7 0 0 0 10.18 18.9a1.7 1.7 0 0 0-1.88.34l-.06.06-2.32-2.32.06-.06A1.7 1.7 0 0 0 6.32 15a1.7 1.7 0 0 0-1.56-1.04h-.08v-3.28h.08A1.7 1.7 0 0 0 6.32 9.64a1.7 1.7 0 0 0-.34-1.88l-.06-.06L8.24 5.4l.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.04-1.56V4.16h3.28v.08a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.32 2.3-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04h.08v3.28h-.08A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="5.5" />
        <path d="m15 15 4.2 4.2" />
      </>
    ),
    bell: (
      <>
        <path d="M18 10a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 22h4" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14m-5-5 5 5-5 5" />
      </>
    ),
    flame: (
      <path d="M13.5 2.5c.4 3.5-2.1 4.3-3.8 6.7-1-1.8-1-3.4-.7-4.8C5.5 7.2 4.5 10.2 4.5 13.1A7.5 7.5 0 0 0 12 20.5a7.5 7.5 0 0 0 7.5-7.4c0-4.2-2.6-7.5-6-10.6Z" />
    ),
    food: (
      <>
        <path d="M7 3v7" />
        <path d="M5 3v4m4-4v4" />
        <path d="M5 7c0 1.7.9 3 2 3s2-1.3 2-3" />
        <path d="M7 10v11" />

        <path d="M15 3v18" />
        <path d="M15 3c3 1.5 4 4 4 7h-4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    more: (
      <path
        d="M6 12h.01M12 12h.01M18 12h.01"
        strokeWidth="3"
        strokeLinecap="round"
      />
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}
