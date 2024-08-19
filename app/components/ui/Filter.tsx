import { Dropdown } from "./Dropdown";
import { DropdownItem } from "./DropdownItem";

export const Filter = ({ label, items }: { label: string; items: any }) => {
  return (
    <div>
      <Dropdown label={label}>
        {items.map((item: any, i: number) => {
          return (
            <div
              key={label + "_" + i}
              className={`${
                i === items.length - 1 && "border-t border-zinc-700"
              }`}
            >
              <DropdownItem
                label={item.name}
                selected={item.selected}
                action={item.action}
              />
            </div>
          );
        })}
      </Dropdown>
    </div>
  );
};
