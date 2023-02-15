import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import useSearchStore from "../../hooks/searchStore";
import { inputStyle } from "../../styles/basicStyles";

type SearchBarProps = {
  sharedView: boolean;
};

export default function SearchBar({ sharedView }: SearchBarProps) {
  const { search, setSearch } = useSearchStore();
  return (
    <div
      className={classNames(
        "relative max-w-sm",
        sharedView ? "w-1/2" : "w-full"
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type="search"
        id="todo-search"
        className={classNames(inputStyle, "block h-14 w-full pl-10")}
        placeholder="Suche..."
        defaultValue={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
