"use client";
import SidePanel from "@/components/SidePanel";

export default function Home() {
  return (
    <div className="flex h-[100dvh]">
      <SidePanel />
      <div className="flex-1 text-6xl flex items-center justify-evenly">
        <h1>This is the main page</h1>
      </div>
    </div>
  );
}
