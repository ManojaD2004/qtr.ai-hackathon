import SidePanel from "@/components/SidePanel";
import getUserId from "@/helpers/getUserId";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function MainWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    async function execThis() {
      if (status === "authenticated") {
        const userId = await getUserId(session);
        console.log(userId);
        router.push("/dashboard");
      } else {
        toast("Please Log In 😊");
      }
    }
    execThis();
  }, [status]);
  return (
    <div className="flex h-[100dvh]">
      <SidePanel
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
          <h2>Loading...</h2>
        </div>
      </div>
    </div>
  );
}
