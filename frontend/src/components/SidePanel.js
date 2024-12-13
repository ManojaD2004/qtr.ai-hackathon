"use client";
import capWord from "@/helpers/CapWord";
import { getProviders, signIn, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

function SidePanel({ routePage = "", isLoggedIn = false, userDeatils = {} }) {
  const [prdId, setPrdId] = useState();
  useEffect(() => {
    async function execThis() {
      const providers = await getProviders();
      setPrdId(providers.google.id);
    }
    execThis();
  }, []);
  // console.log(userDeatils?.image);
  return (
    <div className="w-24 bg-slate-50/50 border-r-[1px] border-slate-200 h-full flex flex-col items-center justify-between space-y-7 py-5">
      <div className="flex flex-col items-center justify-between space-y-7">
        <SPTopComp />
        <SpImgComp
          imgSrc="https://img.icons8.com/ios/100/goal--v1.png"
          altText="goal--v1"
          isSelected={routePage === "goals"}
          route="/goals"
          tooltipData="goals"
        />
        <SpImgComp
          imgSrc="https://img.icons8.com/ios/250/checked.png"
          altText="checked"
          isSelected={routePage === "tasks"}
          route="/tasks"
          tooltipData="tasks"
        />
        <SpImgComp
          imgSrc="https://img.icons8.com/material-rounded/100/calendar--v1.png"
          altText="calendar--v1"
          isSelected={routePage === "planner"}
          route="/planner"
          tooltipData="planner"
        />
        <SpImgComp
          imgSrc="https://img.icons8.com/ios-filled/100/book.png"
          altText="book"
          isSelected={routePage === "journal"}
          route="/journal"
          tooltipData="journal"
        />
        <SpImgComp
          imgSrc="https://img.icons8.com/ios-filled/100/apple-notes.png"
          altText="apple-notes"
          isSelected={routePage === "notes"}
          route="/notes"
          tooltipData="notes"
        />
        <SpImgComp
          imgSrc="https://img.icons8.com/ios-glyphs/100/running--v1.png"
          altText="running--v1"
          isSelected={routePage === "habits"}
          route="/habits"
          tooltipData="habits"
        />
        <SpImgComp
          imgSrc="https://img.icons8.com/ios/100/clock--v3.png"
          altText="clock--v3"
          isSelected={routePage === "focus"}
          route="/focus"
          tooltipData="focus"
        />
      </div>
      <div className="flex flex-col items-center justify-between space-y-7">
        <SpImgComp
          imgSrc="https://img.icons8.com/ios-filled/100/sunrise.png"
          altText="sunrise"
          tooltipData="sunrise"
        />
        {isLoggedIn ? (
          <div onClick={() => signOut({ callbackUrl: "/" })}>
            <SpUserImgComp
              imgSrc={userDeatils?.image}
              altText="user-img"
              tooltipData="sign out"
            />
          </div>
        ) : (
          <div onClick={() => signIn(prdId, { callbackUrl: "/" })}>
            <SpUserImgComp
              imgSrc="https://img.icons8.com/dotty/100/login-rounded-right.png"
              altText="login-rounded-right"
              tooltipData="sign in"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SPTopComp() {
  return (
    <div className="bg-purple-400 mb-1 rounded-full h-[45px] w-[45px] relative cursor-pointer transition-all duration-300 ease-out group hover:bg-purple-300 hover:scale-125">
      <picture>
        <source
          srcSet="https://img.icons8.com/android/100/plus.png"
          type="image/png"
        />
        <img
          src="https://img.icons8.com/android/100/plus.png"
          alt="plus"
          className="invert w-[25px] h-[25px] transition-all duration-300 ease-out absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none"
        />
      </picture>
    </div>
  );
}

function SpUserImgComp({
  imgSrc,
  altText = "icon placeholder",
  tooltipData = "tooltip placeholder",
}) {
  const [tooltip, setToolTip] = useState(false);
  return (
    <div
      className="cursor-pointer group relative w-[35px] h-[35px]"
      onMouseEnter={() => {
        setToolTip(true);
      }}
      onMouseLeave={() => {
        setToolTip(false);
      }}
    >
      {tooltip && <ToolTip data={capWord(tooltipData)} />}
      <picture>
        <source srcSet={imgSrc} type="image/png" />
        <img
          src={imgSrc}
          alt={altText}
          className="transition-all duration-300 rounded-full ease-out w-full -h-full pointer-events-none group-hover:scale-125 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
        />
      </picture>
    </div>
  );
}

function SpImgComp({
  imgSrc,
  route,
  altText = "icon placeholder",
  isSelected = false,
  tooltipData = "tooltip placeholder",
}) {
  const [tooltip, setToolTip] = useState(false);
  return (
    <a href={route} target="_self">
      <div
        className="cursor-pointer group relative w-[30px] h-[30px]"
        onMouseEnter={() => {
          setToolTip(true);
        }}
        onMouseLeave={() => {
          setToolTip(false);
        }}
      >
        <AnimatePresence mode="wait">
          {tooltip && <ToolTip data={capWord(tooltipData)} />}
        </AnimatePresence>
        <picture>
          <source srcSet={imgSrc} type="image/png" />
          <img
            src={imgSrc}
            alt={altText}
            style={{ filter: isSelected && "invert(0%)" }}
            className="invert-[50%] transition-all duration-300 ease-out w-full -h-full pointer-events-none group-hover:invert-[10%] absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          />
        </picture>
      </div>
    </a>
  );
}

function ToolTip({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        type: "spring",
        damping: 25,
        stiffness: 500,
        velocity: 2,
      }}
    >
      <div className="bg-slate-50 absolute translate-x-1/2 -translate-y-1/2 top-1/2 left-1/4 font-semibold text-nowrap shadow-lg z-50 p-2 shadow-slate-300 h-auto">
        {data}
      </div>
    </motion.div>
  );
}

export default SidePanel;
