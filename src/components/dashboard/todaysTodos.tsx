import { type Todo } from "@prisma/client";
import classNames from "classnames";
import { DateTime } from "luxon";
import useColumnStore from "../../hooks/columnStore";
import { gradientTextStyle } from "../../styles/basicStyles";
import { sortTodos } from "../../utils/todoUtils";
import TodoCard from "../shared/todoCard";

type TodaysTodosProps = {
  todos: Todo[];
};

export default function TodaysTodos({ todos }: TodaysTodosProps) {
  const todaysDate = DateTime.now().setLocale("de-DE").toLocaleString();
  const weekday = DateTime.now().setLocale("de-DE").weekdayLong;

  const filteredTodos = todos.filter((todo) => todo.day === weekday);

  // Maybe use day as prop
  const todoOrder =
    useColumnStore((state) => state.regularColumns).find(
      (col) => col.id === filteredTodos[0]?.day
    )?.todoOrder ?? [];

  const getFilteredAndSortedTodos = () => {
    return sortTodos(filteredTodos, todoOrder);
  };

  return (
    <div className="flex w-full flex-col items-center px-5 pt-5">
      <h2 className={classNames(gradientTextStyle, "text-xl")}>
        Heutige Todos
      </h2>
      <div className="dark:text-slate-400">{todaysDate}</div>
      <div className="flex w-80 flex-col pt-2">
        {getFilteredAndSortedTodos().map((todo) => (
          <TodoCard
            isDragging={false}
            key={todo.id}
            todo={todo}
            restore={false}
          />
        ))}
      </div>
    </div>
  );
}
