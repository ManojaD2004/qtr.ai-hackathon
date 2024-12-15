import SidePanel from "@/components/SidePanel";
import { useSession } from "next-auth/react";
import { PacmanLoader } from "react-spinners";
const PAGE_NAME = "journal";

export default function MainWrapper() {
  const { data: session, status } = useSession();

  return (
    <div className="flex h-[100dvh]">
      <SidePanel
        routePage={PAGE_NAME}
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />
      <div className="flex-1 text-6xl flex flex-col items-center justify-evenly space-y-2">
        <div className="flex flex-col space-y-6">
          <PacmanLoader
            className="text-purple-400"
            color="rgb(192, 132, 252)"
            size={110}
          />
          <h2>This is the {PAGE_NAME} page</h2>
        </div>
      </div>
    </div>
  );
}
