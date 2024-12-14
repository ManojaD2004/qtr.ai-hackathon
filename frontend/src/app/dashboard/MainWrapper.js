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
  const temp = new Date("2024-1-1").getDay();
  for (let k = 0; k < temp; k++) {
    newCal.push({
      color: "",
      monthName: "",
      date: "",
    });
  }
  for (let i = 0; i < cal2024.length; i++) {
    const newCal1 = Array.from({ length: cal2024[i].totalDays }, () => ({
      color: cal2024[i].color,
      monthName: cal2024[i].monthName,
      date: `2024-${i + 1}-${-1}`,
    }));
    for (let j = 0; j < cal2024[i].totalDays; j++) {
      newCal1[j].date = `2024-${i + 1}-${j + 1}`;
      newCal.push(newCal1[j]);
    }
  }

  console.log(temp);
  // console.log(newCal);
  return (
    <div className="flex h-[100dvh]">
      <SidePanel
        routePage={PAGE_NAME}
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />
      <ToastContainer
        bodyClassName="font-semibold text-red-700"
        position="top-right"
      />
      <div className="w-full h-full pl-24">
        <div className="w-full h-full p-6 space-y-6">
          <div className="flex fex-row items-center space-x-16">
            <div
              onClick={() => toast("User not found, please login in 🥲")}
              className="w-20 h-20 relative rounded-full overflow-hidden shadow-xl shadow-slate-300"
            >
              {/*  {
            "id": 1,
            "email_id": "manojad2004@gmail.com",
            "user_name": "Manoja D",
            "user_img": "https://lh3.googleusercontent.com/a/ACg8ocJurKMGO0gumdosWhn9Ld74ub6Sy29KYceU0GBXN2caJXsrC64=s317-c-no",
            "created_at": "2024-12-13T13:30:34.954Z"
        } */}
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
            <div className="text-3xl text-purple-800 bg-purple-50 p-3 rounded-lg shadow-xl">
              Joined :{" "}
              {userDeatils !== null
                ? moment(userDeatils.created_at, "YYYYMMDD").fromNow()
                : "<date>"}
            </div>
          </div>
          <div className="w-full !my-40 min-h-[2px] bg-slate-200"></div>
          <div className="flex flex-col space-y-4 overflow-x-auto bg-orange-200">
            <div className="flex flex-row">
              {/* {cal2024.map((ele, index) => (
                <div
                  key={index}
                  className="text-xl text-red-400 bg-red-900 rounded-lg"
                >
                  {ele.monthName}
                </div>
              ))} */}
              <div className="text-xl w-12 text-red-400 bg-red-900 ">Jan</div>
              <div
                style={{
                  marginLeft: 24 * 3,
                }}
                className="text-xl w-12 text-red-400 bg-red-900 "
              >
                Feb
              </div>
              <div
                style={{
                  marginLeft: 24 * 3,
                }}
                className="text-xl w-12 text-red-400 bg-red-900 "
              >
                Mar
              </div>
            </div>
            <div className="w-full bg-orange-200 grid grid-flow-col grid-rows-7  gap-1">
              {newCal.map((ele1, index1) =>
                ele1.monthName === "" ? (
                  <div
                    key={index1}
                    className="h-5 w-5 group relative bg-orange-200 rounded-lg"
                  ></div>
                ) : (
                  <CalDate
                    key={index1}
                    color={ele1.color}
                    tooltipData={moment(ele1.date).format("MMMM Do YYYY")}
                  />
                )
              )}
              <Tooltip id="cal-date-tooltip" />
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
        className="h-5 w-5 cursor-pointer group relative bg-red-800 rounded-lg"
      ></div>
    </a>
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
