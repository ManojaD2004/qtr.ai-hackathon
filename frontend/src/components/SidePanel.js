import React from "react";

function SidePanel() {
  return (
    <div className="w-24 bg-slate-50 border-r-[1px] border-slate-200 h-full flex flex-col items-center py-5">
      <SPTopComp />
      <div className="flex flex-col justify-between h-80">
        <SPMidComp
          imgSrc={
            "https://img.icons8.com/external-vitaliy-gorbachev-lineal-vitaly-gorbachev/60/external-free-sales-vitaliy-gorbachev-lineal-vitaly-gorbachev.png"
          }
        />
      </div>
    </div>
  );
}

function SPTopComp() {
  return (
    <div className="h-20">
      <div className="bg-purple-400 rounded-full h-[45px] w-[45px] relative cursor-pointer transition-all duration-300 ease-out group hover:bg-purple-300 hover:scale-125">
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
    </div>
  );
}

function SPMidComp({ imgSrc }) {
  return (
    <div>
      <picture>
        <source srcSet={imgSrc} type="image/png" />
        <img
          width="30"
          height="30"
          src={imgSrc}
          alt="external-free-sales-vitaliy-gorbachev-lineal-vitaly-gorbachev"
        />
      </picture>
    </div>
  );
}

export default SidePanel;
