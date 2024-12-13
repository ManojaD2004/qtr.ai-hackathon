import SidePanel from "@/components/SidePanel";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
{
  /* <div className="w-full h-full">
          <TimePicker />
        </div> */
}

export default function MainWrapper() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(null);
  const [checkPoints, setCheckPoints] = useState([]);
  const [habbitName, setHabbitName] = useState("");
  return (
    <div className="flex h-[100dvh]">
      <SidePanel
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />
      <ToastContainer
        bodyClassName="font-semibold text-red-700"
        position="top-right"
      />
      <div className="flex-1 text-6xl flex flex-col space-y-5  py-5 px-5">
        <h1 className="text-5xl font-semibold text-slate-800">Create Habbit 🤖</h1>
        <div className="w-full h-[2px] bg-slate-200"></div>
        <div className="bg-slate-50/75 rounded-lg shadow-lg w-full p-7">
          <form className="flex flex-col space-y-7 font-semibold">
            <div className="text-lg space-x-4">
              <div className="inline-block w-44">Enter Habbit Name :</div>
              <input
                type="text"
                className="border-slate-300 border-2 outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400 placeholder:font-medium rounded-md pl-4 py-2"
                value={habbitName}
                placeholder="My New Habbit"
                onChange={(e) => {
                  setHabbitName(e.target.value);
                }}
              />
            </div>
            <div className="text-lg space-x-9 flex">
              <div className="space-x-4 flex items-center">
                <div className="inline-block w-44">Select Start Date:</div>
                <DatePicker
                  value={startDate}
                  onChange={(d) => {
                    setStartDate(d);
                  }}
                />
              </div>
              <div className="space-x-4 flex items-center">
                <div className="inline-block w-44">Select End Date :</div>
                <DatePicker
                  value={endDate}
                  onChange={(d) => {
                    setEndDate(d);
                  }}
                />
              </div>
            </div>
            <div className="w-full h-[2px] bg-slate-400"></div>
            <div className="flex flex-col space-y-3 font-semibold bg-slate-50 rounded-xl shadow-lg">
              <div className="text-lg space-x-3 flex items-center mx-6 mt-6">
                <div>Add Checkpoints :</div>
                <div
                  onClick={() => {
                    if (startDate === null) {
                      toast("Select Start Date 🕒");
                      return;
                    }
                    if (endDate === null) {
                      toast("Select End Date 🕜");
                      return;
                    }
                    if (startDate.toDate() > endDate.toDate()) {
                      toast("Start Date cannot be greater than End Date 👀", {
                        className: "text-red-600 !bg-yellow-100",
                      });
                      return;
                    }
                    for (let i = 0; i < checkPoints.length; i++) {
                      if (
                        checkPoints[i].cName === "" ||
                        checkPoints[i].cDate === null
                      ) {
                        toast("Enter the details of All Checkpoints");
                        return;
                      }
                    }
                    setCheckPoints([
                      ...checkPoints,
                      {
                        cName: "",
                        cDate: null,
                      },
                    ]);
                  }}
                  className="bg-red-400 rounded-full h-[45px] w-[45px] relative cursor-pointer transition-all duration-300 ease-out group hover:bg-red-300 hover:scale-125"
                >
                  <ImgComp
                    imgSrc="https://img.icons8.com/android/100/plus.png"
                    altText="plus"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                {checkPoints.map((ele, index) => (
                  <div
                    key={index}
                    className="text-lg flex space-x-9 bg-purple-50 px-3 py-4 shadow-xl rounded-lg"
                  >
                    <div className="flex space-x-4 items-center">
                      <div className="inline-block w-44">Checkpoint Name :</div>
                      <input
                        type="text"
                        className="border-slate-300 bg-transparent border-2 outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400 placeholder:font-medium rounded-md pl-4 py-3"
                        value={ele.cName}
                        placeholder="New Checkpoint Name"
                        onChange={(e) => {
                          const newCheckPoints = [...checkPoints];
                          newCheckPoints[index].cName = e.target.value;
                          setCheckPoints(newCheckPoints);
                        }}
                      />
                    </div>
                    <div className="flex space-x-4 items-center">
                      <div className="inline-block w-44">Select Deadline :</div>
                      <DatePicker
                        value={ele.cDate}
                        onChange={(d) => {
                          const newCheckPoints = [...checkPoints];
                          newCheckPoints[index].cDate = d;
                          setCheckPoints(checkPoints);
                        }}
                      />
                    </div>
                    <div className="flex space-x-4 items-center">
                      <div
                        onClick={() => {
                          const newCheckPoints = [...checkPoints];
                          newCheckPoints.splice(index, 1);
                          setCheckPoints(newCheckPoints);
                        }}
                        className="bg-red-400 rounded-lg h-[35px] w-[45px] relative cursor-pointer transition-all duration-300 ease-out group hover:bg-red-300 hover:scale-125"
                      >
                        <ImgComp
                          imgSrc="https://img.icons8.com/material-outlined/100/minus.png"
                          altText="minus"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              onClick={() => {
                if (!habbitName) {
                  toast("Enter Habbit Name 👀");
                  return;
                }
                if (startDate === null) {
                  toast("Select Start Date 🕒");
                  return;
                }
                if (endDate === null) {
                  toast("Select End Date 🕜");
                  return;
                }
                if (startDate.toDate() > endDate.toDate()) {
                  toast("Start Date cannot be greater than End Date 👀", {
                    className: "text-red-600 !bg-yellow-100",
                  });
                  return;
                }
                for (let i = 0; i < checkPoints.length; i++) {
                  if (
                    checkPoints[i].cName === "" ||
                    checkPoints[i].cDate === null
                  ) {
                    toast("Enter the details of All Checkpoints 👀");
                    return;
                  }
                }
              }}
              className="flex space-x-3 bg-purple-600 w-fit transition-all ease-out duration-300 group hover:bg-purple-900 hover:scale-110 cursor-pointer text-xl mx-3 p-3 rounded-lg"
            >
              <div className="text-white">Submit</div>
              <div className="h-[30px] w-[30px] relative transition-all ease-out duration-300 group-hover:!invert-[10%]">
                <ImgComp
                  imgSrc="https://img.icons8.com/ios-glyphs/100/rocket.png"
                  altText="rocket"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ImgComp({ imgSrc, altText = "icon placeholder" }) {
  return (
    <picture>
      <source srcSet={imgSrc} type="image/png" />
      <img
        src={imgSrc}
        alt={altText}
        className="invert w-[25px] h-[25px] transition-all duration-300 ease-out absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none"
      />
    </picture>
  );
}
