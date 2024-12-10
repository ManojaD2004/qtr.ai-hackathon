"use client";
import SidePanel from "@/components/SidePanel";

export default function Home() {
  return (
    <div className="flex h-[100dvh]">
      <SidePanel />
      <div className="flex-1">
        Rest
      </div>
    </div>
  );
}
