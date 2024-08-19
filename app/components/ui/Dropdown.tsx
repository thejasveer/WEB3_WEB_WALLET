import { useEffect, useState } from "react";

export const Dropdown = ({
  children,
  label,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  label: string;
}) => {
  const [sd, setSd] = useState(false);

  const handleD = () => {
    setSd(!sd);
  };
  return (
    <div
      className="relative   w-max   text-slate-500 "
      onMouseLeave={handleD}
      onMouseEnter={handleD}
    >
      {
        <div
          className={` flex justify-between cursor-pointer items-center gap-4   text-slate-500    p-3 text-sm   font-semibold `}
        >
          <div>
            {" "}
            <img src={`/${label}.png`} className="size-6 rounded-full" alt="" />
          </div>
        </div>
      }
      {sd && (
        <div
          onClick={handleD}
          className=" w-max absolute top-12 cursor-pointer left-2    text-sm   rounded-md shadow-b-md border border-zinc-600 bg-black text-white"
        >
          {children}
        </div>
      )}
    </div>
  );
};
