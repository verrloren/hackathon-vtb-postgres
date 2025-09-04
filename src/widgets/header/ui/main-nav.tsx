"use client";

import Link from "next/link";

export function MainNav() {
  return (
    <div className="flex flex-row gap-x-8 items-center">
      <Link
        className="text-lg text-white/80 font-ibmPlexMono hover:text-white transition-colors"
        href="/projects"
      >
        Projects
      </Link>
      <Link
        className="text-lg text-white/80 font-ibmPlexMono hover:text-white transition-colors"
        href="/projects"
      >
        Projects
      </Link>
    </div>
  );
}
