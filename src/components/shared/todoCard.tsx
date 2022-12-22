import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { useEffect } from "react";
import { type DraggableProvided } from "react-beautiful-dnd";
import classNames from "../../utils/classNames";

type TodoCardProps = {
  todoDone: boolean;
  setTodoDone?: (id: string, done: boolean) => void;
  todo: Todo;
  onBlurTextArea?: (newContent: string) => void;
  disclosureOpen?: boolean;
  isDragging?: boolean;
  provided: DraggableProvided;
};

function TodoCard({
  todoDone,
  setTodoDone,
  todo,
  onBlurTextArea,
  isDragging,
  provided,
}: TodoCardProps) {
  const handleOnChange = () => {
    if (setTodoDone) {
      setTodoDone(todo.id, !todo.done);
    }
  };

  useEffect(() => {
    console.log(isDragging);
  }, [isDragging]);

  return (
    <div
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      ref={provided?.innerRef}
      className={`group my-1 flex flex-col rounded-xl bg-gray-500 py-1 px-4 text-black hover:bg-gray-400 dark:bg-slate-500 dark:hover:bg-slate-600 ${
        isDragging === undefined ? "dark:bg-slate-300" : ""
      }`}
    >
      <div className="group flex items-center justify-between gap-2">
        <input
          type="checkbox"
          readOnly={setTodoDone ? false : true}
          checked={todoDone}
          onChange={() => handleOnChange()}
          className="h-6 w-6 rounded-full"
        />
        <textarea
          disabled={setTodoDone ? false : true}
          onBlur={(e) => {
            if (onBlurTextArea) {
              onBlurTextArea(e.target.value);
            }
          }}
          defaultValue={todo.content}
          className={classNames(
            isDragging === undefined ? "dark:bg-slate-300" : "",
            todoDone ? "line-through" : "",
            "resize-none border-0 bg-gray-300 text-base font-medium focus:ring-0 group-hover:bg-gray-400 dark:bg-slate-500 dark:group-hover:bg-slate-600"
          )}
        />
        <EllipsisVerticalIcon className="h-8 w-8" />
      </div>
    </div>
  );
}

export default TodoCard;
