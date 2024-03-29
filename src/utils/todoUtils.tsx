import { type Todo } from "@prisma/client";
import { type Column } from "../types/column";
import { type Day } from "../types/enums";

export function sortTodos(todos: Todo[], todoOrder: Todo[]) {
  return todos.sort((a, b) => {
    const aIndex = todoOrder.findIndex((todo) => todo.id === a.id);
    const bIndex = todoOrder.findIndex((todo) => todo.id === b.id);
    return aIndex - bIndex;
  });
}

export function getCheckedTodoIds(todos: Todo[]) {
  return (
    todos?.filter((todo) => todo.checked === true).map((todo) => todo.id) ?? []
  );
}

export function getCheckedTodos(todos: Todo[]) {
  return todos?.filter((todo) => todo.checked === true) ?? [];
}

export function getTodosFromIds(todos: Todo[], ids: string[]) {
  return todos?.filter((todo) => ids.includes(todo.id)) ?? [];
}

export function refreshLocalTodos(
  ids: string[],
  setTodos: (shared: boolean, todos: Todo[]) => void,
  todos: Todo[],
  shared: boolean
) {
  const newTodos = todos.filter((todo) => !ids.includes(todo.id));
  setTodos(shared, newTodos);
}

export function persistTodoOrderInDb(columns: Column[], updateTodo: any) {
  columns.forEach((col) => {
    col.todoOrder.forEach((todo, index) => {
      if (todo.index !== index || todo.day !== col.id) {
        updateTodo.mutate({
          id: todo.id,
          day: col.id,
          index,
        });
      }
    });
  });
}

export function removeTodosFromTodoOrder(
  columns: Column[],
  todos: Todo[],
  shared: boolean,
  setTodoOrder: (shared: boolean, columnId: Day, newTodoOrder: Todo[]) => void,
  updateTodoPosition: any
) {
  const removedTodos: Todo[] = [];

  todos.forEach((todo) => {
    const newColumnTodoOrder = columns.find(
      (col) => col.id === todo.day
    )?.todoOrder;

    removedTodos.push(
      newColumnTodoOrder?.splice(
        newColumnTodoOrder.findIndex(
          (todoToCompare) => todoToCompare.id === todo.id
        ),
        1
      )[0] as Todo
    );

    setTodoOrder(shared, todo.day as Day, newColumnTodoOrder ?? []);
  });

  removedTodos.forEach((todo) => {
    updateTodoPosition.mutate({
      id: todo.id,
      day: todo.day,
      index: -1,
    });
  });

  persistTodoOrderInDb(columns, updateTodoPosition);
}

export const getCollaboratorEmails = (data: any, currentUserEmail: string) => [
  ...new Set<string>(
    (data ?? [])
      ?.map((c) => [c.sharedWithEmail, c.sharedFromEmail])
      .flat()
      .filter((email) => email !== currentUserEmail && email !== null) ?? []
  ),
];
