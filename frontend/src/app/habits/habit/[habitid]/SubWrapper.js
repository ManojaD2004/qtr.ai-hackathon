"use client";
import Provider from "@/components/Provider";
import MainWrapper from "./MainWrapper";

export default function SubWrapper({ habitId, joinId }) {
  console.log(habitId);
  return (
    <Provider>
      <MainWrapper habitId={habitId} joinHabitId={joinId} />
    </Provider>
  );
}
