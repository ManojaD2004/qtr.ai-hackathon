import SidePanel from "@/components/SidePanel";
import constants from "@/helpers/constants";
import getUserId from "@/helpers/getUserId";
import moment from "moment";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { DatePicker } from "@mui/x-date-pickers";

const PAGE_NAME = "habits";
const backendLink = constants.backEndLink;

export default function MainWrapper({ habitId, joinHabitId }) {
  const { data: session, status } = useSession();
  const [searchText, setSearchText] = useState("");
  const [msg, setMsg] = useState("");
  const [habitsCheckpoints, setHabitsCheckpoints] = useState([]);
  const [checkpointDone, setCheckpointDone] = useState([]);
  const [habitsDetails, setHabitsDetails] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [finishDate, setFinishDate] = useState(dayjs(new Date()));
  const [options, setOptions] = useState([
    {
      value: -1,
      label: "0. Own Savepoint!",
    },
  ]);
  useEffect(() => {
    async function execThis() {
      try {
        console.log(habitId);
        if (status !== "authenticated") {
          return;
        }
        if (!habitId || !joinHabitId) {
          toast("habit id or join habit id not founded!");
        }
        const res = await fetch(
          `${backendLink}/db/v1/habits/details/checkpoints/${habitId}`
        );
        const resJson = await res.json();
        // const userId = await getUserId(session);
        const res3 = await fetch(
          `${backendLink}/db/v1/habits/savepoints/main/${joinHabitId}`
        );
        const resJson3 = await res3.json();
        const checkpointDone = resJson3.rows.map(
          (ele) => ele.main_checkpoint_id
        );
        setCheckpointDone(checkpointDone);
        const options1 = resJson.rows
          .map((ele, index) => {
            if (!checkpointDone.includes(ele.id)) {
              return {
                label: `${index + 1}. ` + ele.checkpoint_name,
                value: ele.id,
              };
            }
          })
          .filter((ele) => ele !== undefined);
        setOptions([...options, ...options1]);
        setHabitsCheckpoints(resJson.rows);
        console.log(resJson);
        const res2 = await fetch(
          `${backendLink}/db/v1/habits/details/${habitId}`
        );
        const resJson2 = await res2.json();
        setHabitsDetails(resJson2.rows[0]);
        console.log(resJson2);
        // const res1 = await fetch(`${backendLink}/db/v1/habits/join/${userId}`);
        // const resJson1 = await res1.json();
        // console.log(resJson1);
        // const newJoinedHabits = resJson1.rows.map((ele) => ele.habit_id);
        // setJoinedHabits(newJoinedHabits);
      } catch (error) {
        toast("Server Error 🥲");
        console.log("Error: ", error);
      }
    }
    execThis();
  }, [status, habitId, joinHabitId]);
  // console.log(session);
  return (
    <div className="flex">
      <SidePanel
        plusRoute={"/habits/create"}
        routePage={PAGE_NAME}
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />
      <div className="flex-1 ml-24 text-6xl flex flex-col space-y-5  py-5 px-5">
        <h1>
          {habitsDetails === null
            ? "<Habit-Name> 😺"
            : habitsDetails.habit_name}
        </h1>
        <div className="w-full min-h-[2px] bg-slate-200"></div>
        <div className="bg-slate-50 text-xl font-semibold flex flex-row space-x-5 justify-between h-full w-full rounded-lg">
          {/* Left Section */}
          <div className="w-[40%] bg-slate-100 p-3 flex flex-col space-y-4 rounded-lg overflow-hidden shadow-lg shadow-slate-300">
            <div className="flex flex-row items-center">
              <h2 className="font-bold text-slate-700">Your Checkpoints 👇</h2>
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
                placeholder="Search Checkpoint"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
            </div>
            <div className="w-full h-[2px] bg-slate-200"></div>
            <div className="flex flex-col h-[400px] space-y-5 rounded-lg overflow-y-auto scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-blue-600/70">
              {habitsCheckpoints.map((ele, index) => (
                <div
                  key={index}
                  onClick={async () => {
                    try {
                      if (checkpointDone.includes(ele.id)) {
                        return;
                      }
                      setSelectedOption({
                        label: `${index + 1}. ` + ele.checkpoint_name,
                        value: ele.id,
                      });
                    } catch (error) {
                      toast("Server Error 🥲");
                      console.log("Error: ", error);
                    }
                  }}
                  className="w-full bg-slate-50 shadow-lg p-2 rounded-lg cursor-pointer"
                >
                  <div
                    className={`flex justify-between w-full items-center ${
                      checkpointDone.includes(ele.id) && "line-through"
                    }`}
                  >
                    <div>
                      {index + 1}. {ele.checkpoint_name}{" "}
                    </div>
                  </div>
                  <div className="text-slate-700 pl-6 text-base">
                    Deadline:{" "}
                    <b className="text-slate-800">
                      {`${moment(ele.deadline).format("MMMM Do YYYY")}`}
                    </b>
                    <span>{checkpointDone.includes(ele.id) && "✅"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right Section */}
          <div className="w-[60%] h-full bg-purple-50 p-3 flex flex-col space-y-4 rounded-lg shadow-lg shadow-purple-300">
            <div className="text-purple-700 font-bold relative flex flex-col">
              <div className="flex justify-between">
                {habitsDetails?.habit_name}{" "}
                <div className="h-[40px] w-[40px] relative rounded-full overflow-hidden">
                  <ImgComp
                    imgSrc={habitsDetails?.user_img}
                    altText={habitsDetails?.user_name}
                    invertPer={0}
                  />
                </div>
              </div>
              <span className="block text-purple-900">
                by {habitsDetails?.user_name} - <b>{habitsDetails?.email_id}</b>
              </span>
            </div>
            <div className="w-full h-[2px] bg-slate-200"></div>
            <div className="flex p-2 flex-row bg-purple-100 shadow-lg justify-between rounded-lg w-full">
              <div className="text-purple-700">
                Start Date:{" "}
                <b>
                  {habitsDetails !== null &&
                    `${moment(habitsDetails?.start_date).format(
                      "MMMM Do YYYY"
                    )}`}
                </b>
              </div>
              <div className="text-purple-700">
                End Date:{" "}
                <b>
                  {habitsDetails !== null &&
                    `${moment(habitsDetails?.end_date).format("MMMM Do YYYY")}`}
                </b>
              </div>
            </div>
            <div className="flex p-2 flex-row bg-purple-100 shadow-lg justify-between rounded-lg w-full">
              <div className="text-purple-700">Create a Save Points 👇</div>
            </div>
            <div className="flex text-lg flex-col text-purple-600 rounded-lg shadow-xl bg-purple-100 space-y-4 w-full h-72">
              <form>
                <div className="flex items-center justify-between">
                  <Select
                    className="w-56"
                    value={selectedOption}
                    onChange={setSelectedOption}
                    options={options}
                  />
                  <div className="flex items-center">
                    <div className="inline-block w-44">
                      Select Finish Date :
                    </div>
                    <DatePicker
                      className="bg-slate-50"
                      value={finishDate}
                      onChange={(d) => {
                        setFinishDate(d);
                      }}
                    />
                  </div>
                </div>
                <div className="bg-white p-3 shadow-lg rounded-xl flex mt-5">
                  <div className="h-[30px] w-[30px] relative">
                    <ImgComp
                      imgSrc="https://img.icons8.com/material-outlined/100/pencil--v1.png"
                      altText="pencil--v1"
                      invertPer={50}
                    />
                  </div>
                  <textarea
                    type=""
                    className="outline-none bg-transparent pl-3 w-full h-52 resize-none"
                    placeholder="Write a Message"
                    value={msg}
                    onChange={(e) => {
                      setMsg(e.target.value);
                    }}
                  />
                </div>
              </form>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-red-900 bg-purple-100 shadow-xl rounded-lg p-2">
                Total People Joined: {habitsDetails?.total_joined}
              </div>
              <div
                onClick={async () => {
                  try {
                    if (selectedOption.value === -1) {
                      const res1 = await fetch(
                        `${backendLink}/db/v1/habits/savepoints/create/own?testing=true`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            message: msg,
                            joinHabitId: joinHabitId,
                            finishedWorkedAt: finishDate.toISOString(),
                          }),
                        }
                      );
                      const resJson1 = await res1.json();
                      if (resJson1.message !== "success") {
                        toast("Failed to Create A Savepoint! 👀");
                        return;
                      } else {
                        toast("Successfully Created a own Savepoint! 👀");
                      }
                    } else {
                      const res1 = await fetch(
                        `${backendLink}/db/v1/habits/savepoints/create/main?testing=true`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            message: msg,
                            joinHabitId: joinHabitId,
                            mainCheckpointId: selectedOption.value,
                            finishedWorkedAt: finishDate.toISOString(),
                          }),
                        }
                      );
                      const resJson1 = await res1.json();
                      if (resJson1.message !== "success") {
                        toast("Failed to Create A Savepoint! 👀");
                        return;
                      } else {
                        toast("Successfully Created a main Savepoint! 👀");
                      }
                    }
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500);
                  } catch (error) {
                    toast("Sever Error! 👀");
                    console.log(error);
                  }
                }}
                className="flex space-x-3 bg-red-500 shadow-xl w-fit transition-all ease-out duration-300 group hover:bg-red-700 hover:scale-110 cursor-pointer text-xl p-3 rounded-lg"
              >
                <div className="text-white">Submit</div>
                <div className="h-[30px] w-[30px] relative transition-all ease-out duration-300 group-hover:!invert-[10%]">
                  <ImgComp
                    imgSrc="https://img.icons8.com/ios-glyphs/100/rocket.png"
                    altText="rocket"
                  />
                </div>
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
        className="w-full h-full transition-all duration-300 ease-out absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none"
      />
    </picture>
  );
}
