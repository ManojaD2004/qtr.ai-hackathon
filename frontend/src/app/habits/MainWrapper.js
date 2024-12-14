import SidePanel from "@/components/SidePanel";
import constants from "@/helpers/constants";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const PAGE_NAME = "habits";
const backendLink = constants.backEndLink;

export default function MainWrapper() {
  const { data: session, status } = useSession();
  const [searchText, setSearchText] = useState("");
  const [selectedHabitDetails, setSelectedHabitDetails] = useState(null);
  const [selectedHabitIndex, setSelectedHabitIndex] = useState(null);
  const [habits, setHabits] = useState([]);
  useEffect(() => {
    async function execThis() {
      try {
        const res = await fetch(`${backendLink}/db/habits-all`);
        const resJson = await res.json();
        setHabits(resJson.rows);
        console.log(resJson);
      } catch (error) {
        toast("Server Error 🥲");
        console.log("Error: ", error);
      }
    }
    execThis();
  }, []);
  return (
    <div className="flex h-[100dvh]">
      <SidePanel
        plusRoute={"/habits/create"}
        routePage={PAGE_NAME}
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />
      <ToastContainer
        bodyClassName="font-semibold text-red-700"
        position="top-right"
      />
      <div className="flex-1 ml-24 text-6xl flex flex-col space-y-5  py-5 px-5">
        <h1>Habits 😺</h1>
        <div className="w-full h-[2px] bg-slate-200"></div>
        <div className="bg-slate-50 text-xl font-semibold flex flex-row space-x-5 justify-between h-full w-full rounded-lg">
          {/* Left Section */}
          <div className="w-[40%] h-full bg-slate-100 p-3 flex flex-col space-y-4 rounded-lg overflow-hidden shadow-lg">
            <div className="flex flex-row items-center">
              <h2 className="font-bold text-slate-700">Join or Create Task</h2>
              <div className="bg-red-400/90 rounded-full ml-4 h-[30px] w-[30px] relative cursor-pointer transition-all duration-300 ease-out group hover:bg-red-300 hover:scale-125">
                <a href="/habits/create" target="_blank">
                  <div className="w-3/4 h-3/4 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    <ImgComp
                      imgSrc="https://img.icons8.com/android/100/plus.png"
                      altText="plus"
                    />
                  </div>
                </a>
              </div>
            </div>
            <div className="w-full h-[2px] bg-slate-200"></div>
            <div className="bg-white p-3 shadow-lg rounded-xl flex">
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
              {/* {
            "id": 1,
            "habit_name": "Weight Loss",
            "start_date": "2024-12-15T18:30:00.000Z",
            "end_date": "2025-01-15T18:30:00.000Z",
            "created_by_user_id": 2,
            "created_at": "2024-12-13T13:30:34.957Z",
            "email_id": "dmcodingforum@gmail.com",
            "user_name": "Dark Mode",
            "user_img": "https://lh3.googleusercontent.com/a/ACg8ocLAldtaEOY2KBwNS8MKO8F5KNx74aLO0GEpYe86kNz90fcKtJ4=s317-c-no"
        } */}
              {habits.map((ele, index) => (
                <div
                  key={index}
                  onClick={async () => {
                    try {
                      const habitId = ele.id;
                      const res = await fetch(
                        `${backendLink}/db/habits-details/${habitId}`
                      );
                      const resJson = await res.json();
                      setSelectedHabitDetails(resJson.rows);
                      setSelectedHabitIndex(index);
                      console.log(resJson);
                    } catch (error) {
                      toast("Server Error 🥲");
                      console.log("Error: ", error);
                    }
                  }}
                  className="w-full bg-slate-50 shadow-lg p-2 rounded-lg cursor-pointer"
                >
                  <div className="flex justify-between w-full items-center">
                    <div>
                      {index + 1}. {ele.habit_name}
                    </div>
                    <div className="h-[50px] w-[50px] rounded-full overflow-hidden relative">
                      <ImgComp
                        altText={ele.user_name + "img"}
                        imgSrc={ele.user_img}
                        invertPer={0}
                      />
                    </div>
                  </div>
                  <div className="text-slate-700 pl-6 text-base">
                    Author: <b className="text-slate-800">{ele.user_name}</b> -{" "}
                    <b className="text-slate-800">{ele.email_id}</b>
                  </div>
                  <div className="text-slate-700 pl-6 text-base">
                    Created At:{" "}
                    <b className="text-slate-800">
                      {`${moment(ele.created_at).format("MMMM Do YYYY")}`}
                    </b>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right Section */}
          <div className="w-[60%] h-full bg-purple-50 p-3 flex flex-col space-y-4 rounded-lg overflow-hidden shadow-lg">
            {selectedHabitDetails === null ? (
              <div className="flex justify-evenly items-center h-full">
                <h2 className="text-purple-700 w-fit bg-purple-100/80 shadow-xl p-4 rounded-xl text-4xl font-bold">
                  Please Select some habit
                </h2>
              </div>
            ) : (
              <>
                <div className="text-purple-700 font-bold">
                  {habits[selectedHabitIndex].habit_name}{" "}
                  <span className="block text-purple-900">
                    by <b>{habits[selectedHabitIndex].email_id}</b>
                  </span>
                </div>
                <div className="w-full h-[2px] bg-slate-200"></div>
                <div className="flex p-2 flex-row bg-purple-100 shadow-lg justify-between rounded-lg w-full">
                  <div className="text-purple-700">
                    Start Date:{" "}
                    <b>
                      {`${moment(habits[selectedHabitIndex].start_date).format(
                        "MMMM Do YYYY"
                      )}`}
                    </b>
                  </div>
                  <div className="text-purple-700">
                    End Date:{" "}
                    <b>
                      {`${moment(habits[selectedHabitIndex].end_date).format(
                        "MMMM Do YYYY"
                      )}`}
                    </b>
                  </div>
                </div>
                <div className="flex p-2 flex-row bg-purple-100 shadow-lg justify-between rounded-lg w-full">
                  <div className="text-purple-700">Checkpoints 👇</div>
                </div>
                <div className="flex flex-col rounded-lg shadow-xl bg-purple-100 space-y-4 w-full h-72 scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300  overflow-y-auto">
                  {/*  {
            "id": 1,
            "habit_name": "Weight Loss",
            "created_by_user_id": 2,
            "created_at": "2024-12-13T13:30:34.957Z",
            "checkpoint_name": "Reduce 0.5 KG weight",
            "deadline": "2024-12-26T18:30:00.000Z"
        } */}
                  {selectedHabitDetails
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .map((ele, index) => (
                      <div
                        key={index}
                        className="text-red-800 bg-purple-50 shadow-lg rounded-lg p-2"
                      >
                        {index + 1}. {ele.checkpoint_name}, Deadline :{" "}
                        <i className="text-red-700">
                          {`${moment(ele.deadline).format("MMMM Do YYYY")}`}
                        </i>
                      </div>
                    ))}
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
                    Total People Joined:{" "}
                    {habits[selectedHabitIndex].total_joined}
                  </div>
                </div>
              </>
            )}
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
        className="w-full h-full transition-all duration-300 ease-out absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none"
      />
    </picture>
  );
}
