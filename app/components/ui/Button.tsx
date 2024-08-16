export const Button = ({ text, action }: { action: any; text: string }) => {
  return (
    <button
      onClick={action}
      type="button"
      className="inline-block rounded bg-neutral-100 px-6 py-4 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-600 shadow-light-3 transition duration-150 ease-in-out hover:bg-neutral-200 hover:shadow-light-2 focus:bg-neutral-200 focus:shadow-light-2 focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-light-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong cursor-pointer"
    >
      {text}
    </button>
  );
};

export const DarkButton = ({
  text,
  action,
  disabled,
}: {
  action: any;
  text: string;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={action}
      type="button"
      className={`  cursor-pointer inline-block rounded  py-4 bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-dark-3 transition duration-150 ease-in-out hover:bg-neutral-700 hover:shadow-dark-2 focus:bg-neutral-700 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-dark-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong`}
    >
      {text}
    </button>
  );
};

export const BackButton = ({ action }: { action: any }) => {
  return (
    <div className="flex gap-2" onClick={action}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path
          fillRule="evenodd"
          d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
          clipRule="evenodd"
        />
      </svg>{" "}
      <span>Back</span>
    </div>
  );
  s;
};
