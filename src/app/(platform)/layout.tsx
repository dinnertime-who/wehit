import { Suspense } from "react";
import { Header } from "@/components/reusable/platform/header";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense>
        <Header />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}
