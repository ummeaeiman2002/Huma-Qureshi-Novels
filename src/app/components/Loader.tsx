import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F3EAE0] gap-4">
      <div className="loader text-3xl lg:text-5xl"></div>
    </div>
  );
}
