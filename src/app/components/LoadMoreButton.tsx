import React from "react";

export default function LoadMoreButton({onclick}:{onclick:() => void } ) {
  return (
    <button onClick={onclick} className="flex items-center gap-2 bg-secondary text-primary font-semibold px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm sm:text-base hover:bg-tertiary active:scale-95 transition self-center">
      Load More Episodes
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}
