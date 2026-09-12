"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors={false}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group !border !border-orange-100 !bg-white !text-black !shadow-xl !shadow-orange-100/50 !rounded-2xl !px-4 !py-3",

          title: "!text-sm !font-semibold !text-black",

          description: "!mt-1 !text-xs !text-black",

          actionButton:
            "!bg-orange-500 !text-white hover:!bg-orange-600 !rounded-lg",

          cancelButton:
            "!bg-slate-100 !text-black hover:!bg-slate-200 !rounded-lg",

          closeButton:
            "!border-orange-100 !bg-white !text-black hover:!bg-orange-50 hover:!text-orange-500",

          success: "!border-orange-100 !bg-white !text-black",

          error: "!border-orange-200 !bg-white !text-black",

          warning: "!border-orange-200 !bg-white !text-black",

          info: "!border-orange-100 !bg-white !text-black",
        },
      }}
    />
  );
}
