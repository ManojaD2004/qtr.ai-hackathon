import SidePanel from "@/components/SidePanel";
import { useSession } from "next-auth/react";
import { useState } from "react";
const PAGE_NAME = "habits";

export default function MainWrapper() {
  const { data: session, status } = useSession();
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex h-[100dvh]">
      <SidePanel
        plusRoute={"/habits/create"}
        routePage={PAGE_NAME}
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />
      <div className="flex-1 text-6xl flex flex-col space-y-5  py-5 px-5">
        <h1>Habbits 😺</h1>
        <div className="w-full h-[2px] bg-slate-200"></div>
        <div className="bg-slate-50 text-xl font-semibold flex flex-row space-x-5 justify-between h-full w-full rounded-lg">
          {/* Left Section */}
          <div className="w-1/2 h-full bg-red-200 p-3 flex flex-col space-y-4 rounded-lg overflow-hidden shadow-lg">
            <div className="">Join or Create Task</div>
            <div className="w-full h-[2px] bg-slate-200"></div>
            <div className="bg-slate-100 p-3 rounded-xl flex">
              <div className="h-[30px] w-[30px] relative">
                <ImgComp
                  imgSrc="https://img.icons8.com/material-outlined/100/search--v1.png"
                  altText="search--v1"
                  invertPer={50}
                />
              </div>
              <input
                type="text"
                className="outline-none bg-transparent pl-3 w-full"
                placeholder="Search Habits"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
            </div>
            <div className="w-full h-[2px] bg-slate-200"></div>
          </div>
          <div className="w-1/2 h-full bg-red-300 rounded-lg overflow-hidden shadow-lg"></div>
        </div>
      </div>
    </div>
  );
}

function ImgComp({ imgSrc, altText = "icon placeholder", invertPer = 100 }) {
  return (
    <picture>
      <source srcSet={imgSrc} type="image/png" />
      <img
        src={imgSrc}
        alt={altText}
        style={{ filter: `invert(${invertPer}%)` }}
        className="w-[25px] h-[25px] transition-all duration-300 ease-out absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none"
      />
    </picture>
  );
}
