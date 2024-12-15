import SidePanel from "@/components/SidePanel";
import constants from "@/helpers/constants";
import getUserId from "@/helpers/getUserId";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
const PAGE_NAME = "dashboard";
const backendLink = constants.backEndLink;

const calHelp = [
  { monthName: "Jan", totalDays: 31, skipVal: 0 },
  { monthName: "Feb", totalDays: 28, skipVal: 0 },
  { monthName: "Mar", totalDays: 31, skipVal: 0 },
  { monthName: "Apr", totalDays: 30, skipVal: 0 },
  { monthName: "May", totalDays: 31, skipVal: 0 },
  { monthName: "Jun", totalDays: 30, skipVal: 0 },
  { monthName: "Jul", totalDays: 31, skipVal: 0 },
  { monthName: "Aug", totalDays: 31, skipVal: 0 },
  { monthName: "Sep", totalDays: 30, skipVal: 0 },
  { monthName: "Oct", totalDays: 31, skipVal: 0 },
  { monthName: "Nov", totalDays: 30, skipVal: 0 },
  { monthName: "Dec", totalDays: 31, skipVal: 0 },
];
export default function MainWrapper() {
  const { data: session, status } = useSession();
  const [userDeatils, setUserDetails] = useState(null);
  const [listOfGoodDate, setListOfGoodDate] = useState([]);
  const [listOfGoodDateMsg, setListOfGoodDateMsg] = useState([]);
  const [selectYear, setSelectYear] = useState("2024");
  const [joinedHabits, setJoinedHabits] = useState([]);
  const [selectDate, setSelectDate] = useState("");

  useEffect(() => {
    async function execThis() {
      try {
        if (status !== "authenticated") {
          return;
        }
        const res = await fetch(
          `${backendLink}/db/v1/users/details/${session.user.email}`
        );
        const resJson = await res.json();
        if (resJson.rowCount !== 1) {
          toast("User not Found 🥲");
          return;
        }
        setUserDetails(resJson.rows[0]);
        const listOfGoodDate = [];
        const listOfGoodDateMsg = [];
        listOfGoodDate.push(
          moment(resJson.rows[0].created_at).format("YYYY-MM-DD")
        );
        listOfGoodDateMsg.push({
          message: `Your account created on ${moment(
            resJson.rows[0].created_at
          ).format("MMM Do YYYY")} 🥰`,
          details: {
            message: `Your account created on ${moment(
              resJson.rows[0].created_at
            ).format("MMM Do YYYY")} 🥰`,
            finished_worked_at: resJson.rows[0].created_at,
          },
          category: "create",
        });
        const userId = await getUserId(session);
        const res1 = await fetch(`${backendLink}/db/v1/habits/join/${userId}`);
        const resJson1 = await res1.json();
        const joinedHabits = resJson1.rows;
        setJoinedHabits(joinedHabits);
        for (let i = 0; i < joinedHabits.length; i++) {
          listOfGoodDate.push(
            moment(joinedHabits[i].join_at).format("YYYY-MM-DD")
          );
          listOfGoodDateMsg.push({
            message: `You joined a ${joinedHabits[i].habit_name} on ${moment(
              joinedHabits[i].join_at
            ).format("MMM Do YYYY")} 🥰`,
            details: {
              message: `You joined a ${joinedHabits[i].habit_name} on ${moment(
                joinedHabits[i].join_at
              ).format("MMM Do YYYY")} 🥰`,
              finished_worked_at: joinedHabits[i].join_at,
            },
            category: "create",
          });
        }
        const res2 = await fetch(
          `${backendLink}/db/v1/habits/savepoints/main/${userId}`
        );
        const resJson2 = await res2.json();
        const savePointsMain = resJson2.rows;
        for (let i = 0; i < savePointsMain.length; i++) {
          listOfGoodDate.push(
            moment(savePointsMain[i].finished_worked_at).format("YYYY-MM-DD")
          );
          listOfGoodDateMsg.push({
            message: `You created a main savepoint on ${moment(
              savePointsMain[i].finished_worked_at
            ).format("MMM Do YYYY")} 🥰`,
            details: savePointsMain[i],
            category: "main savepoint",
          });
        }
        console.log(listOfGoodDate);
        const res3 = await fetch(
          `${backendLink}/db/v1/habits/savepoints/own/${userId}`
        );
        const resJson3 = await res3.json();
        const savePointsOwn = resJson3.rows;
        for (let i = 0; i < savePointsOwn.length; i++) {
          listOfGoodDate.push(
            moment(savePointsOwn[i].finished_worked_at).format("YYYY-MM-DD")
          );
          listOfGoodDateMsg.push({
            message: `You created a own savepoint on ${moment(
              savePointsOwn[i].finished_worked_at
            ).format("MMM Do YYYY")} 🥰`,
            details: savePointsOwn[i],
            category: "own savepoint",
          });
        }
        // console.log(listOfGoodDate);
        // console.log(listOfGoodDateMsg);
        setListOfGoodDate(listOfGoodDate);
        setListOfGoodDateMsg(listOfGoodDateMsg);
      } catch (error) {
        toast("Server Error 🥲");
        console.log("Error: ", error);
      }
    }
    execThis();
  }, [status]);
  const newCal = useMemo(() => {
    const newCal = [];
    const skipDays = new Date(`${selectYear}-1-1`).getDay();
    if (parseInt(selectYear) % 4 === 0) {
      calHelp[1].totalDays = 29;
    } else {
      calHelp[1].totalDays = 28;
    }
    for (let k = 0; k < skipDays; k++) {
      newCal.push({
        color: "",
        monthName: "",
        date: "",
        toolTilDate: "",
      });
    }

    for (let i = 0; i < calHelp.length; i++) {
      for (let j = 0; j < calHelp[i].totalDays; j++) {
        const newCal1 = {
          color: calHelp[i].color,
          monthName: calHelp[i].monthName,
          date: `${selectYear}-${i + 1}-${-1}`,
          toolTilDate: "",
        };
        newCal1.date = moment(`${selectYear}-${i + 1}-${j + 1}`).format("YYYY-MM-DD");
        const goodDateIndex = listOfGoodDate.indexOf(newCal1.date);
        if (goodDateIndex !== -1) {
          newCal1.toolTilDate = listOfGoodDateMsg[goodDateIndex].message;
          newCal1.color = "rgb(152, 85, 222)";
        } else {
          newCal1.toolTilDate = `No Actions on ${moment(
            `${newCal1.date}`
          ).format("MMM Do YYYY")} 🙄`;
          newCal1.color = "rgb(203, 213, 225)";
        }
        newCal.push(newCal1);
      }
    }
    calHelp[0].totalDays += skipDays;
    let remainDays = 0;
    for (let i = 0; i < calHelp.length - 1; i++) {
      let days = calHelp[i].totalDays;
      days = days - 14;
      if (remainDays !== 0) {
        days = days - (7 - remainDays);
      }
      let skipDay = Math.ceil(days / 7);
      calHelp[i + 1].skipVal = skipDay;
      remainDays = days % 7;
    }
    calHelp[0].totalDays -= skipDays;
    return newCal;
  }, [listOfGoodDate, selectYear, listOfGoodDateMsg]);
  const selectDateMessage = useMemo(() => {
    if (selectDate === "") {
      return [];
    }
    const selectDateMessage = [];
    for (let i = 0; i < listOfGoodDate.length; i++) {
      if (listOfGoodDate[i] === selectDate) {
        selectDateMessage.push(listOfGoodDateMsg[i]);
      }
    }
    console.log(selectDateMessage);
    return selectDateMessage;
  }, [selectDate, listOfGoodDate, listOfGoodDateMsg]);
  return (
    <div className="flex">
      <SidePanel
        routePage={PAGE_NAME}
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />

      <div className="w-full h-full pl-24">
        <div className="w-full h-full p-6 space-y-6">
          <div className="flex fex-row items-center space-x-16">
            <div
              onClick={() => toast("Hi 😻")}
              className="w-20 h-20 relative rounded-full overflow-hidden shadow-xl ring-purple-400/50 ring-4 shadow-purple-300"
            >
              <ImgComp
                invertPer={0}
                imgSrc={
                  userDeatils !== null
                    ? userDeatils.user_img
                    : "https://img.icons8.com/nolan/100/user.png"
                }
                altText={
                  userDeatils !== null ? userDeatils.user_name : "<user-img>"
                }
              />
            </div>
            <h2 className="text-7xl text-purple-800">
              {userDeatils !== null ? userDeatils.user_name : "<user-name>"}
            </h2>
            <div className="text-xl h-full flex flex-col text-purple-800 bg-purple-100 p-3 rounded-xl shadow-purple-300/60 shadow-xl">
              <div>
                Joined :{" "}
                <b>
                  {userDeatils !== null
                    ? moment(userDeatils.created_at, "YYYYMMDD").fromNow()
                    : "<date>"}
                </b>
              </div>
              <div>
                UserId :{" "}
                <b>
                  {userDeatils !== null ? userDeatils.email_id : "<user-id>"}
                </b>
              </div>
            </div>
          </div>
          <div className="w-full min-h-[2px]  bg-slate-200"></div>
          <div className="flex flex-row bg-slate-100 shadow-md p-2 rounded-xl justify-center">
            <div className="flex flex-row max-w-fit overflow-x-auto scrollbar-thin scrollbar-track-purple-200 scrollbar-thumb-purple-600">
              <div className="pt-7 box-border">
                <div className="pr-2 h-[142px] flex flex-col  justify-evenly text-sm font-semibold ">
                  <div className="text-slate-800">Mon</div>
                  <div className="text-slate-800">Wed</div>
                  <div className="text-slate-800">Fri</div>
                </div>
              </div>
              <div className="flex w-full flex-col space-y-1">
                <div className="flex flex-nowrap">
                  {calHelp.map((ele, index) => (
                    <div
                      key={index}
                      style={{
                        marginLeft: 20 * ele.skipVal,
                      }}
                      className="text-xl flex-shrink-0 w-10 text-slate-900 font-semibold float-left"
                    >
                      {ele.monthName}
                    </div>
                  ))}
                </div>
                <div className="max-w-fit grid grid-flow-col grid-rows-7 gap-[4px]">
                  {newCal.map((ele1, index1) =>
                    ele1.monthName === "" ? (
                      <div
                        key={index1}
                        className="h-4 w-4 group relative pointer-events-none rounded-md"
                      ></div>
                    ) : (
                      <CalDate
                        handleClick={() => setSelectDate(ele1.date)}
                        key={index1}
                        color={ele1.color}
                        tooltipData={ele1.toolTilDate}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="w-auto px-6  flex flex-col items-center space-y-4 text-sm font-semibold ">
              <YearButton
                handleClick={() => setSelectYear("2027")}
                yearName="2027"
                isSelected={selectYear === "2027"}
              />
              <YearButton
                handleClick={() => setSelectYear("2026")}
                yearName="2026"
                isSelected={selectYear === "2026"}
              />
              <YearButton
                handleClick={() => setSelectYear("2025")}
                yearName="2025"
                isSelected={selectYear === "2025"}
              />
              <YearButton
                handleClick={() => setSelectYear("2024")}
                yearName="2024"
                isSelected={selectYear === "2024"}
              />
              <YearButton
                handleClick={() => setSelectYear("2023")}
                yearName="2023"
                isSelected={selectYear === "2023"}
              />
            </div>
          </div>
          {/* Bottom Section */}
          <div className="flex flex-row space-x-5 text-xl font-semibold mb-8">
            {/* Left Section */}
            <div className="w-[30%] bg-slate-100 p-3 flex flex-col space-y-4 rounded-lg overflow-hidden shadow-lg shadow-slate-300">
              <div className="flex flex-row items-center">
                <h2 className="font-bold text-slate-700">Your Joined Habits</h2>
                <div className="r ml-4 h-[30px] w-[30px] relative cursor-pointer transition-all duration-300 ease-out group hover:scale-125">
                  <div className="w-3/4 h-3/4 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    <ImgComp
                      imgSrc="https://img.icons8.com/ios-filled/100/sunrise.png"
                      altText="sunrise"
                      invertPer={0}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full h-[2px] bg-slate-200"></div>
              <div className="flex flex-col h-[400px] space-y-5 rounded-lg overflow-y-auto scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-blue-600/70">
                {joinedHabits.map((ele, index) => (
                  <a
                    target="_blank"
                    href={`/habits/habit/${ele.habit_id}?joinid=${ele.id}`}
                    key={index}
                  >
                    <div className="w-full bg-slate-50 shadow-lg p-2 rounded-lg cursor-pointer">
                      <div className="flex justify-between w-full items-center">
                        <div>
                          {index + 1}. {ele.habit_name}
                        </div>
                      </div>
                      <div className="text-slate-700 pl-6 text-base">
                        Joined At:{" "}
                        <b className="text-slate-800">
                          {`${moment(ele.join_at).format("MMM Do YYYY")}`}
                        </b>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            {/* Right Section */}
            <div className="w-[70%] bg-purple-50 p-3 min-h-[500px] flex flex-col space-y-4 rounded-lg overflow-hidden shadow-lg shadow-purple-300">
              {selectDate === "" ? (
                <div className="flex flex-col space-y-7 justify-center items-center  h-full">
                  <h2 className="text-purple-700 w-fit bg-purple-100/80 shadow-xl p-4 rounded-xl text-4xl font-bold">
                    None date selected 🙄
                  </h2>
                  <PacmanLoader
                    className="text-purple-400"
                    color="rgb(192, 132, 252)"
                    size={70}
                  />
                </div>
              ) : (
                <>
                  <div className="text-purple-700 font-bold">
                    Actions on
                    <span className="block text-purple-900">
                      <b>{moment(selectDate).format("MMMM Do YYYY")}</b>
                    </span>
                  </div>
                  <div className="w-full h-[2px] bg-slate-200"></div>
                  <div className="flex flex-col rounded-lg  space-y-4 w-full h-72 scrollbar-thin scrollbar-thumb-purple-800/50 scrollbar-track-purple-100  overflow-y-auto">
                    {selectDateMessage.map((ele, index) => (
                      <div
                        key={index}
                        className="text-purple-900 bg-purple-100 shadow-lg rounded-lg p-2"
                      >
                        {index + 1}. Message: <b>{ele.details.message}</b>
                        <span className="block pl-6">
                          Finished on :{" "}
                          <i className="text-purple-700">
                            {`${moment(ele.details.finished_worked_at).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}`}
                          </i>
                        </span>
                        <span className="block pl-6">
                          Category :{" "}
                          <i className="text-purple-700">{`${ele.category}`}</i>
                        </span>
                      </div>
                    ))}
                    {selectDateMessage.length === 0 && (
                      <div className="flex  justify-evenly items-center h-[500px]">
                        <h2 className="text-purple-700 w-fit bg-purple-100/80 shadow-xl p-4 rounded-xl text-4xl font-bold">
                          No actions on this date selected 👀
                        </h2>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalDate({
  color = "red",
  tooltipData = "<tooltip placeholder>",
  handleClick = null,
}) {
  return (
    <a data-tooltip-id="cal-date-tooltip" data-tooltip-content={tooltipData}>
      <div
        onClick={handleClick}
        style={{
          backgroundColor: color,
        }}
        className="h-4 w-4 cursor-pointer group relative rounded-md"
      ></div>
    </a>
  );
}

function YearButton({ yearName, handleClick = null, isSelected = false }) {
  return (
    <div
      onClick={handleClick}
      className={`${
        isSelected
          ? "text-purple-200 bg-purple-600"
          : "text-purple-700 bg-purple-200 hover:bg-purple-500 hover:text-purple-100 "
      } 
       p-1 pr-6 rounded-lg flex-shrink-0 cursor-pointer`}
    >
      {yearName}
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
