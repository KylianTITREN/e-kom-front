"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PreviewBanner() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 text-center text-sm font-medium shadow-lg">
      <div className="flex items-center justify-center gap-4">
        <span>🔍 Mode Prévisualisation</span>
        <Link
          href={`/api/exit-preview?returnUrl=${encodeURIComponent(pathname)}`}
          className="bg-white text-orange-500 px-3 py-1 rounded-md hover:bg-orange-50 transition-colors font-semibold"
        >
          Quitter
        </Link>
      </div>
    </div>
  );
}
