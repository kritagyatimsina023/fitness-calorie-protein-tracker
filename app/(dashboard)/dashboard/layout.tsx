import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Nourish | Dashboard",
  description: "Your daily calorie and protein dashboard.",
};

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="min-h-full flex flex-col">
      <div className="flex min-h-screen">
        <Sidebar />
        <div
          className="flex-1 mx-auto flex min-h-[calc(100vh-1.5rem)]
       max-w-[1600px]  rounded-[28px]
        bg-white shadow-[0_24px_80px_rgba(50,37,26,0.1)]
       sm:min-h-[calc(100vh-2.5rem)] p-4"
        >
          <Container>{children}</Container>
        </div>
      </div>
    </main>
  );
}
