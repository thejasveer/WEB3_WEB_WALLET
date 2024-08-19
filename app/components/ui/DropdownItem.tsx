export const DropdownItem = ({
  label,
  action,
  selected,
}: {
  selected: boolean;
  label: string;
  action: any;
}) => {
  return (
    <div
      onClick={action}
      className="hover:bg-zinc-600   flex justify-start px-2 gap-2 items-center w-full hover:text-gray-100 p-2 "
    >
      <div className="w-max ">
        {label != "+ ADD NETWORK" && (
          <img
            src={`/${label}.png`}
            className={`  size-6  rounded-full`}
            alt=""
          />
        )}
      </div>
      <div>{label}</div>
      <div>
        {selected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 font-bold text-blue-500"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
