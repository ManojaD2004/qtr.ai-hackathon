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
        <h1>Habits 😺</h1>
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
            <div className="flex flex-col space-y-5 rounded-lg">
              <div className="w-full bg-yellow-100 p-2 rounded-lg cursor-pointer">
                <div>1. Habbit 1</div>
                <div className="text-red-500 pl-6 text-base">
                  author: Manoja D - manojadkc2004@gmail.com
                </div>
              </div>
              <div className="w-full bg-yellow-100 p-2 rounded-lg cursor-pointer">
                <div>2. Habbit 2</div>
                <div className="text-red-500 pl-6 text-base">
                  author: Manoja D - manojadkc2004@gmail.com
                </div>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="w-1/2 h-full bg-red-300 p-3 flex flex-col space-y-4 rounded-lg overflow-hidden shadow-lg">
            <div className="">
              Habit Name{" "}
              <span className="block text-red-900">
                by manojadkc2004@gmail.com
              </span>
            </div>
            <div className="w-full h-[2px] bg-slate-200"></div>
            <div className="flex p-2 flex-row bg-yellow-100 justify-between rounded-lg w-full">
              <div className="text-red-500">Start Date: 12/12/2024</div>
              <div className="text-red-500">End Date: 12/12/2024</div>
            </div>
            <div className="flex flex-col bg-blue-100 space-y-4 w-full h-80 scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300  overflow-y-auto">
              {Array.from({ length: 17 }, () => 0).map((ele, index) => (
                <div
                  key={index}
                  className="text-red-500 bg-yellow-100 rounded-lg p-2"
                >
                  Checkpoint {index}: some, Deadlin: 12/12/2024
                </div>
              ))}
              <div className="text-red-500 bg-yellow-100 rounded-lg p-2">
                Checkpoint 2: some, Deadlin: 12/12/2024
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div
                onClick={() => {}}
                className="flex space-x-3 bg-purple-600 w-fit transition-all ease-out duration-300 group hover:bg-purple-900 hover:scale-110 cursor-pointer text-xl p-3 rounded-lg"
              >
                <div className="text-white">Join Now</div>
                <div className="h-[30px] w-[30px] relative transition-all ease-out duration-300 group-hover:!invert-[10%]">
                  <ImgComp
                    imgSrc="https://img.icons8.com/ios-glyphs/100/rocket.png"
                    altText="rocket"
                  />
                </div>
              </div>
              <div className="text-red-500 bg-yellow-100 rounded-lg p-2">
                Total People Joined: 10
              </div>
            </div>
          </div>
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
