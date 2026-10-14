"use client";
import { useState } from "react";

export default function LangToggle() {
  const [isUr, setIsUr] = useState(false);
  const setLanguage = () => {
    setIsUr((prev) => !prev);
  };
  // console.log(isUr);

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isUr}
        onChange={setLanguage}
        className="sr-only"
      />

      <div
        className={`relative w-12 h-6 rounded-full outline outline-secondary transition-all duration-300
         `}
      >
        {/* EN label (left) */}

        {/* UR label (right) */}

        <span
          className={` left-2 top-1/2 -translate-y-1/2 text-tertiary text-xs font-semibold  transition-opacity duration-300 
            
            ${!isUr ? "absolute" : "hidden"}`}
        >
          En
        </span>

        <span
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-tertiary text-xs font-semibold transition-opacity duration-300 ${
            isUr ? "absolute" : "hidden"
          }`}
        >
          Ur
        </span>

        {/* Knob */}
        <span
          className={`absolute top-[2px] left-[2px] h-5 w-5 bg-tertiary rounded-full transition-transform duration-300 ${
            !isUr ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  );
}
