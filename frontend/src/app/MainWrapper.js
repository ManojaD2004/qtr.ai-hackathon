"use client";
import SidePanel from "@/components/SidePanel";
import { useSession } from "next-auth/react";

export default function MainWrapper() {
  const { data: session, status } = useSession();

  return (
    <div className="flex h-[100dvh]">
      <SidePanel
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />
      <div className="flex-1 text-6xl flex items-center justify-evenly">
        <h1>This is the main page</h1>
      </div>
    </div>
  );
}
