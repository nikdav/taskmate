import { type Todo } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import DroppableDayArea from "../components/droppableDayArea";
import SideNavigation from "../components/sideNavigation";
import TodoButtons from "../components/todoButtons";
import TopNaviagtion from "../components/topNavigation";
import useMarkedTodoStore from "../hooks/markedTodoStore";
import useTodoOrderStore from "../hooks/todoOrderStore";
import { Day } from "../types/enums";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  const todoQuery = trpc.todo.getTodos.useQuery();
  const todos = useMemo(() => todoQuery?.data ?? [], [todoQuery]);
  const [localTodos, setLocalTodos] = useState<Todo[]>(todos);

  const { columns, setColumnTodoOrder } = useTodoOrderStore();

  const [searchValue, setSearchValue] = useState<string>("");
  const { resetMarkedTodos } = useMarkedTodoStore();

  useEffect(() => {
    validateColumnTodoOrders();
    setLocalTodos(todos);
  }, [todos]);

  const validateColumnTodoOrders = () => {
    columns.map((col) => {
      const columnTodos = todos
        .filter((todo) => todo.day === col.id)
        .map((todo) => todo.id);

      if (columnTodos.length !== col.todoOrder.length) {
        setColumnTodoOrder(col.id, columnTodos);
      }
    });
  };

  useEffect(() => {
    resetMarkedTodos();
  }, []);

  const changeDay = trpc.todo.changeDayAfterDnD.useMutation({
    onSuccess: () => {
      todoQuery.refetch();
    },

    //Display changes immediately, before the server responds
    onMutate(data) {
      console.log("onMutate triggered");

      setLocalTodos((prev) => {
        const newTodos = [...prev];
        const todoIndex = newTodos.findIndex((todo) => todo.id === data.id);
        newTodos[todoIndex].day = data.day;
        return newTodos;
      });
    },
  });

  const reorder = (result: string[], startIndex: number, endIndex: number) => {
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
      result.splice(endIndex, 0, removed);
    }

    return result;
  };

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    console.log("🚀 ~ file: todos.tsx ~ line 69 ~ onDragEnd ~ result", result);

    //If dropped outside list or dropped in same place
    if (!destination) return;

    //If dropped in same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns.find((col) => col.id === source.droppableId);
    const finish = columns.find((col) => col.id === destination.droppableId);

    if (start && finish) {
      const startTodoIds = start.todoOrder;
      console.log(
        "🚀 ~ file: todos.tsx ~ line 87 ~ onDragEnd ~ startTodoIds",
        startTodoIds
      );
      const finishTodoIds = finish.todoOrder;
      console.log(
        "🚀 ~ file: todos.tsx ~ line 89 ~ onDragEnd ~ finishTodoIds",
        finishTodoIds
      );

      //reorder in same column
      if (start === finish) {
        const newTodoOrder = reorder(
          start?.todoOrder ?? [],
          source.index,
          destination.index
        );

        setColumnTodoOrder(start.id, newTodoOrder);

        resetMarkedTodos();
        return;
      }

      //reorder in different column
      startTodoIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTodoIds,
      };

      finishTodoIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTodoIds,
      };

      setColumnTodoOrder(newStart.id, newStart.taskIds);
      setColumnTodoOrder(newFinish.id, newFinish.taskIds);

      //Persist changes in database (onMutation will display changes immediately)
      changeDay.mutate({
        id: draggableId,
        day: destination.droppableId,
        result: result,
      });
    }
  }

  return (
    <>
      <Head>
        <title>My Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="w-full bg-light">
          <TopNaviagtion />
          <div className="flex flex-col items-center gap-2 pt-5">
            <TodoButtons
              refetch={todoQuery.refetch}
              setSearchValue={setSearchValue}
              todos={todos}
            />
            <div className="flex flex-row flex-wrap items-start justify-center gap-3">
              <DragDropContext onDragEnd={onDragEnd}>
                {(Object.keys(Day) as Array<keyof typeof Day>).map((day) => (
                  <DroppableDayArea
                    refetch={todoQuery.refetch}
                    searchValue={searchValue}
                    todos={localTodos.filter((todo) => todo.day === day)}
                    key={day}
                    day={day}
                  />
                ))}
              </DragDropContext>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Todos;
