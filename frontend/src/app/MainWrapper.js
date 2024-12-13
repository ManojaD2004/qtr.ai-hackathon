import SidePanel from "@/components/SidePanel";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

export default function MainWrapper() {
  const { data: session, status } = useSession();
  const [value, setValue] = useState(dayjs(new Date()));
  return (
    <div className="flex h-[100dvh]">
      <SidePanel
        isLoggedIn={status === "authenticated"}
        userDeatils={status === "authenticated" ? session.user : {}}
      />
      <div className="flex-1 text-6xl flex flex-col items-center justify-evenly">
        <h1>This is a main Page</h1>
      </div>
    </div>
  );
}
