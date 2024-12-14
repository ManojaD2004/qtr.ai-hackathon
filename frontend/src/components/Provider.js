import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";

function Provider({ children }) {
  return (
    <SessionProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ToastContainer
          bodyClassName="font-semibold text-red-700"
          position="top-right"
        />
        {children}
        <Tooltip id="cal-date-tooltip" />
      </LocalizationProvider>
    </SessionProvider>
  );
}

export default Provider;
