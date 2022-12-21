import { type Todo } from "@prisma/client";
import HeadComponent from "../shared/head";
import SideNavigation from "../shared/navigation/sideNavigation";
import TopNaviagtion from "../shared/navigation/topNavigation";
import TodoCard from "../shared/todoCard";

type ArchivedAndFinalizedTodosProps = {
  todos: Todo[];
  title: string;
};

function ArchivedAndFinalizedTodos({
  todos,
  title,
}: ArchivedAndFinalizedTodosProps) {
  return (
    <>
      <HeadComponent title={title} />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-wrap justify-evenly gap-2 px-5 pt-5">
            {todos?.map((todo) => (
              <TodoCard todoDone={todo.done} key={todo.id} todo={todo} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default ArchivedAndFinalizedTodos;
