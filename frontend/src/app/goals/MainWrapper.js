import SidePanel from "@/components/SidePanel";
import { useSession } from "next-auth/react";
const PAGE_NAME = "goals";

export default function MainWrapper() {
  const { data: session, status } = useSession();

  return (
    <div className="flex h-[100dvh]">
      <SidePanel
        routePage={PAGE_NAME}
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />
      <div className="flex-1 text-6xl flex items-center justify-evenly">
        <h1>This is the {PAGE_NAME} page</h1>
      </div>
    </div>
  );
}
