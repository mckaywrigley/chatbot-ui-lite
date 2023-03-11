import { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="flex h-[30px] sm:h-[50px] border-t border-neutral-300 py-2 px-8 items-center sm:justify-between justify-center">
      {/* START DELETE BRANDING */}
      <div className="flex italic text-xs sm:text-sm mx-auto">
        Created by
        <a
          className="hover:opacity-50 ml-1"
          href="https://twitter.com/mckaywrigley"
          target="_blank"
          rel="noreferrer"
        >
          Mckay Wrigley
        </a>
        .
      </div>
      {/* END DELETE BRANDING */}
    </div>
  );
};
