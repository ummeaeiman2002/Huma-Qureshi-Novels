import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Episode({
  episodeTitle,
  teaser,
  href, date, isNew
}: {
  episodeTitle: string;
  teaser: any;
  href: any; date: string; isNew?: boolean
}) {
  const blockCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const colors = [
    { cls: "border-[#C9A96E]" },
    { cls: "border-[#fec7a9]" },
    { cls: "border-[#f1d5ec]" },
    { cls: "border-[#c4e5b6]" },
    { cls: "border-[#ccf7f0]" },
  ];

  let hash = 0;
  for (let i = 0; i < episodeTitle.length; i++) {
    hash = (hash * 31 + episodeTitle.charCodeAt(i)) >>> 0;
  }

  const bg = colors[hash % colors.length].cls;

  return (
    <Link
      href={href}
      onCopy={blockCopy}
      onCut={blockCopy}
      className={`group relative border-3 ${bg} rounded-2xl flex flex-col justify-start items-start py-4 px-2 gap-3 shadow-xl text-tertiary w-full max-w-[200px] min-h-[300px] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(30,93,80,0.3)] active:scale-[1.06] bg-secondary/5`}
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 z-10 px-3 py-1 rounded-full bg-[#e65564] text-white text-[10px] font-extrabold uppercase tracking-wide shadow-lg animate-pulse">
          New
        </span>
      )}
      {/* <div className="flex justify-between"> */}
      <h3 className="font-bold text-sm title-bright px-2">{episodeTitle}</h3>
      {/* <Image
        className="w-10 h-10 justify-self-start"
        src={`https://res.cloudinary.com/dx1gryhqc/image/upload/v1760071770/read_gceuo8.png`}
        alt=""
        width={100}
        height={100}
      /> */}
      {/* </div> */}

      <div className="flex flex-col gap-2">
        <p className="text-right text-xs opacity-60">Published at: {date}</p>
        <p className="font-urdu leading-8 text-xs overflow-hidden text-ellipsis relative max-h-[190px]" dir="rtl">
          {teaser}
          <span>.&nbsp;&nbsp;.&nbsp;&nbsp;.</span>
        </p>
        <button className=" w-fit px-2 py-1 font-bold text-secondary hover:text-[#C9A96E] active:bg-secondary active:text-tertiary rounded-sm self-center">
          Read more
        </button>
      </div>
      {/* <button className="bg-tertiary w-fit px-2 py-1 font-bold text-primary active:bg-secondary active:text-tertiary rounded-sm self-center"> */}

      {/* </button> */}
    </Link>
  );
}