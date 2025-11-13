import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export const Logo = ({ className }: Props) => {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      {/* TODO: 실제 로고로 변경하기 */}
      <Image src="/logo.png" alt="WiHit Logo" width={48} height={32} />
    </Link>
  );
};
