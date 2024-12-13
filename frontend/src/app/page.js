"use client";
import SidePanel from "@/components/SidePanel";
import Provider from "@/helpers/Provider";
import MainWrapper from "./MainWrapper";

export default function Home() {
  return (
    <Provider>
      <MainWrapper />
    </Provider>
  );
}
