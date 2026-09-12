import type { Metadata } from "next";
import "./globals.css";
import { AppToaster } from "@/components/ui/AppToaster";

export const metadata: Metadata = {
  title: "Nourish | Dashboard",
  description: "Your daily calorie and protein dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="">
        <AppToaster />
        {children}
      </body>
    </html>
  );
}
