import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { Fragment } from "react";
import { inputStyle } from "../../styles/basicStyles";
import { dropdown } from "../../styles/transitionClasses";

type GenericComboboxProps<T> = {
  selected: T;
  setSelected: (selectedValue: T) => void;
  setValue?: (name: "day" | "sharedWithEmail", value: T) => void;
  formValueType?: "day" | "sharedWithEmail";
  comboboxOptions: T[];
  show: boolean;
  sharedView: boolean;
};

export default function GenericCombobox<T extends string>({
  selected,
  setSelected,
  setValue,
  comboboxOptions,
  show,
  sharedView,
  formValueType,
}: GenericComboboxProps<T>) {
  return (
    <Listbox
      as="div"
      className={classNames(
        "max-w-sm",
        sharedView ? "w-1/2" : "w-80",
        show ? "" : "hidden"
      )}
      value={selected}
      onChange={(val: T) => {
        setSelected(val);
        if (setValue && formValueType) setValue(formValueType, val);
      }}
    >
      <Listbox.Button
        className={classNames(
          inputStyle,
          "relative h-14 w-full cursor-default pr-10 text-left"
        )}
        placeholder="Select an option"
      >
        <span className="block truncate dark:text-white">{selected}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Transition as={Fragment} {...dropdown}>
        <Listbox.Options className="mt-1 flex w-full flex-col items-start rounded-lg bg-gray-100 py-3 dark:bg-slate-700">
          {comboboxOptions.map((key) => (
            <Listbox.Option
              className={({ active }) =>
                `relative w-full cursor-default select-none py-2 px-4 dark:text-white ${
                  active
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-500 dark:text-blue-100"
                    : ""
                }`
              }
              key={key}
              value={key}
            >
              {key}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}
