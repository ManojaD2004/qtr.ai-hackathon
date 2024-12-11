"use client";
import SidePanel from "@/components/SidePanel";

const PAGE_NAME = "journal";

export default function Home() {
  return (
    <div className="flex h-[100dvh]">
      <SidePanel routePage={PAGE_NAME} />
      <div className="flex-1 text-6xl flex items-center justify-evenly">
        <h1>This is the {PAGE_NAME} page</h1>
      </div>
    </div>
  );
}
