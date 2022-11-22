import { type Todo } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Navigation from "../components/navigation";
import TopNaviagtion from "../components/topNavigation";
import { Days } from "../types/days";
import { trpc } from "../utils/trpc";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Todos: NextPage = () => {
  const todos = trpc.todo.getTodos.useQuery();

  const [searchValue, setSearchValue] = useState<string>("");

  const TodoCard: React.FC<{ todo: Todo }> = ({ todo }) => {
    const [todoDone, setTodoDoneState] = useState<boolean>(todo.done);

    const setTodoDone = trpc.todo.setTodoDone.useMutation({
      onSuccess: () => {
        setTodoDoneState(!todoDone);
        todos.refetch();
      },
    });

    return (
      <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-dark/10 p-4 text-black hover:bg-dark/20">
        <div className="flex items-center justify-between">
          <div
            className={classNames(
              todo.done ? "line-through" : "",
              "w-96 text-lg"
            )}
          >
            {todo.content}
          </div>
          <input
            type="checkbox"
            checked={todoDone}
            onChange={() =>
              setTodoDone.mutate({ id: todo.id, done: !todo.done })
            }
            className="h-6 w-6 rounded-full"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>My Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <Navigation />
        <main className="min-h-screen w-full bg-light lg:flex lg:flex-col">
          <TopNaviagtion />
          <div className="flex flex-col items-center justify-center gap-2 pt-5">
            <div className="flex flex-col items-center">
              <input
                type="text"
                className="w-50 rounded-xl"
                placeholder="Search..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="w-min rounded-3xl bg-daccent p-2">
                In Done verschieben
              </button>
              <button className="w-min rounded-3xl bg-daccent p-2">
                Neue Woche
              </button>
            </div>
            <div className="flex flex-col items-center pl-5">
              {(Object.keys(Days) as Array<keyof typeof Days>).map((day) => (
                <div className="flex flex-col gap-4" key={day}>
                  <h1 className="text-xl font-bold">{day}</h1>
                  {todos.data
                    ?.filter(
                      (todo) =>
                        !todo.archivedDone &&
                        !todo.archivedNotDone &&
                        todo.day === day &&
                        todo.content
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                    )
                    .map((todo) => (
                      <TodoCard key={todo.id} todo={todo} />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Todos;
