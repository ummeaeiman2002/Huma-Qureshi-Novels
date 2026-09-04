import Image from "next/image";
import React from "react";

export default function WatchOnYT({ YTurl }: { YTurl: string }) {
  return (
    <a
      href={YTurl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-center items-center gap-2 bg-[#e65564] text-white font-bold text-sm sm:text-base w-fit px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-lg hover:bg-[#c94050] hover:shadow-[0_0_16px_rgba(230,85,100,0.4)] active:scale-95 transition-all duration-300"
    >
      <p>Watch on YouTube</p>
      <Image
        className="w-5 h-5 sm:w-6 sm:h-6"
        src={
          "https://res.cloudinary.com/dx1gryhqc/image/upload/v1760053180/youtube_play_pyhd8d.png"
        }
        width={100}
        height={100}
        alt=""
      />
    </a>
  );
}
