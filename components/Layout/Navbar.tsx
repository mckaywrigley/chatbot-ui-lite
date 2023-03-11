import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react";
import { FC } from "react";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between">
      <div className="font-bold text-3xl flex items-center">
        <a
          className="ml-2 hover:opacity-50"
          href="https://code-scaffold.vercel.app"
        >
          Chatbot UI
        </a>
      </div>

      {/* START DELETE BRANDING */}
      <div className="flex space-x-4 sm:space-x-6">
        <a
          className="flex items-center hover:opacity-50"
          href="https://twitter.com/mckaywrigley"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandTwitter size={32} />
        </a>

        <a
          className="flex items-center hover:opacity-50"
          href="https://github.com/mckaywrigley/chatbot-ui"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandGithub size={32} />
        </a>
      </div>
      {/* END DELETE BRANDING */}
    </div>
  );
};
