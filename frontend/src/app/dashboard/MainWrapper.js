import SidePanel from "@/components/SidePanel";
import constants from "@/helpers/constants";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
const PAGE_NAME = "dashboard";
const backendLink = constants.backEndLink;

{
  /* user_data {
            "id": 1,
            "email_id": "manojad2004@gmail.com",
            "user_name": "Manoja D",
            "user_img": "https://lh3.googleusercontent.com/a/ACg8ocJurKMGO0gumdosWhn9Ld74ub6Sy29KYceU0GBXN2caJXsrC64=s317-c-no",
            "created_at": "2024-12-13T13:30:34.954Z"
        } */
}
export default function MainWrapper() {
  const { data: session, status } = useSession();
  const [userDeatils, setUserDetails] = useState({
    id: 1,
    email_id: "manojad2004@gmail.com",
    user_name: "Manoja D",
    user_img:
      "https://lh3.googleusercontent.com/a/ACg8ocJurKMGO0gumdosWhn9Ld74ub6Sy29KYceU0GBXN2caJXsrC64=s317-c-no",
    created_at: "2024-12-13T13:30:34.954Z",
  });
  const emailId = session?.user?.email;

  // useEffect(() => {
  //   async function execThis(emailId) {
  //     try {
  //       const res = await fetch(`${backendLink}/db/users/details/${emailId}`);
  //       const resJson = await res.json();
  //       if (resJson.rowCount === 1) {
  //         setUserDetails(resJson.rows[0]);
  //         console.log(resJson);
  //       } else if (resJson.rowCount === 0) {
  //         toast("User not found, please login in 🥲");
  //       } else if (resJson.rowCount > 1) {
  //         toast("Server Error, many users founded 🥲");
  //       }
  //     } catch (error) {
  //       toast("Server Error 🥲");
  //       console.log("Error: ", error);
  //     }
  //   }
  //   if (emailId) {
  //     execThis(emailId);
  //   }
  // }, [emailId]);

  const cal2024 = [
    { monthName: "Jan", totalDays: 31, color: "#FF5733", skipVal: 0 }, // Red-Orange
    { monthName: "Feb", totalDays: 29, color: "#33C1FF", skipVal: 0 }, // Light Blue
    { monthName: "Mar", totalDays: 31, color: "#75FF33", skipVal: 0 }, // Green
    { monthName: "Apr", totalDays: 30, color: "#FFC300", skipVal: 0 }, // Yellow
    { monthName: "May", totalDays: 31, color: "#DA33FF", skipVal: 0 }, // Purple
    { monthName: "Jun", totalDays: 30, color: "#FF338C", skipVal: 0 }, // Pink
    { monthName: "Jul", totalDays: 31, color: "#FF5733", skipVal: 0 }, // Red-Orange
    { monthName: "Aug", totalDays: 31, color: "#33FFBD", skipVal: 0 }, // Aqua
    { monthName: "Sep", totalDays: 30, color: "#FF8F33", skipVal: 0 }, // Orange
    { monthName: "Oct", totalDays: 31, color: "#C70039", skipVal: 0 }, // Dark Red
    { monthName: "Nov", totalDays: 30, color: "#900C3F", skipVal: 0 }, // Maroon
    { monthName: "Dec", totalDays: 31, color: "#581845", skipVal: 0 }, // Dark Purple
  ];
  const newCal = [];
  const skipDays = new Date("2024-1-1").getDay();
  for (let k = 0; k < skipDays; k++) {
    newCal.push({
      color: "",
      monthName: "",
      date: "",
      toolTilDate: "",
    });
  }
  const listOfGoodDate = [];
  listOfGoodDate.push(moment(userDeatils.created_at).format("YYYY-MM-DD"));
  console.log(listOfGoodDate);
  for (let i = 0; i < cal2024.length; i++) {
    const newCal1 = Array.from({ length: cal2024[i].totalDays }, () => ({
      color: cal2024[i].color,
      monthName: cal2024[i].monthName,
      date: `2024-${i + 1}-${-1}`,
      toolTilDate: "",
    }));
    for (let j = 0; j < cal2024[i].totalDays; j++) {
      newCal1[j].date = `2024-${i + 1}-${j + 1}`;
      if (listOfGoodDate.includes(newCal1[j].date)) {
        newCal1[j].toolTilDate = `You account created on ${moment(
          `2024-${i + 1}-${j + 1}`
        ).format("MMMM Do YYYY")} 🥰`;
        newCal1[j].color = "rgb(152, 85, 222)";
      } else {
        newCal1[j].toolTilDate = `No Actions on ${moment(
          `2024-${i + 1}-${j + 1}`
        ).format("MMMM Do YYYY")} 🙄`;
        newCal1[j].color = "rgb(203, 213, 225)";
      }
      newCal.push(newCal1[j]);
    }
  }
  cal2024[0].totalDays += skipDays;
  let remainDays = 0;
  for (let i = 0; i < cal2024.length - 1; i++) {
    let days = cal2024[i].totalDays;
    days = days - 14;
    if (remainDays !== 0) {
      days = days - (7 - remainDays);
    }
    let skipDay = Math.ceil(days / 7);
    cal2024[i + 1].skipVal = skipDay;
    remainDays = days % 7;
  }
  cal2024[0].totalDays -= skipDays;
  return (
    <div className="flex h-[100dvh]">
      <SidePanel
        routePage={PAGE_NAME}
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />

      <div className="w-full h-full pl-24">
        <div className="w-full h-full p-6 space-y-6">
          <div className="flex fex-row items-center space-x-16">
            <div
              onClick={() => toast("User not found, please login in 🥲")}
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
                  {cal2024.map((ele, index) => (
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
              <YearButton yearName="2027" />
              <YearButton yearName="2026" />
              <YearButton yearName="2025" />
              <YearButton yearName="2024" isSelected={true} />
              <YearButton yearName="2023" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalDate({ color = "red", tooltipData = "<tooltip placeholder>" }) {
  return (
    <a data-tooltip-id="cal-date-tooltip" data-tooltip-content={tooltipData}>
      <div
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
