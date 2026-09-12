"use client";

import { Icon, type IconName } from "@/components/ui/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({
  icon,
  label,
  active = false,
  links,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
  links: string;
}) {
  return (
    <Link
      href={links}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
          : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
      }`}
    >
      <Icon name={icon} className="h-[18px] w-[18px]" />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[245px] bg- shrink-0 flex-col border-r border-slate-100 px-4 py-6 lg:flex">
      <Link href="/" className="mb-12 flex items-center gap-3 px-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-xl font-black text-white shadow-lg shadow-orange-500/25">
          N
        </span>

        <span className="text-lg font-bold tracking-tight">
          Nourish<span className="text-orange-500">.</span>
        </span>
      </Link>

      <nav className="space-y-1">
        <NavItem
          links="/dashboard"
          icon="chart"
          label="Overview"
          active={pathname === "/dashboard"}
        />
        <NavItem
          links="/dashboard/calender"
          icon="calendar"
          label="My Diary"
          active={pathname === "/dashboard/calender"}
        />

        <NavItem
          links="/dashboard/library"
          icon="bowl"
          label="Food Library"
          active={pathname === "/dashboard/library"}
        />

        <NavItem
          links="/dashboard/log-food"
          icon="food"
          label="Log Food"
          active={pathname === "/dashboard/log-food"}
        />

        <NavItem
          links="/dashboard/target"
          icon="target"
          label="My Goals"
          active={pathname === "/dashboard/target"}
        />
      </nav>

      <div className="mt-auto space-y-1 border-t border-slate-100 pt-5">
        <NavItem
          links="/dashboard/settings"
          icon="settings"
          label="Settings"
          active={pathname === "/dashboard/settings"}
        />

        <a
          href="#"
          className="mt-5 flex items-center gap-3 rounded-xl bg-orange-50 p-3 text-sm text-slate-500"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 font-semibold text-orange-600">
            ?
          </span>

          <span>
            <span className="block font-semibold text-slate-700">
              Need help?
            </span>
            Visit support center
          </span>
        </a>
      </div>
    </aside>
  );
}
