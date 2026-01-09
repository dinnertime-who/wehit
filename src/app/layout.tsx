import type { Metadata } from "next";
import { pretendard } from "@/config/font";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ViewTransition } from "react";
import { Toaster } from "sonner";
import { DialogService } from "@/components/reusable/dialog-service";
import { publicEnv } from "@/config/env/public";
import { ReactQueryProvider } from "@/config/react-query/provider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: publicEnv.NEXT_PUBLIC_SITE_NAME,
    template: `%s | ${publicEnv.NEXT_PUBLIC_SITE_NAME}`,
  },
  description: publicEnv.NEXT_PUBLIC_SITE_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} ${pretendard.variable}`}>
        <ViewTransition>
          <ReactQueryProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </ReactQueryProvider>
        </ViewTransition>

        <DialogService />
        <Toaster />
      </body>
    </html>
  );
}
