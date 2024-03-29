import { type NextPage } from "next";
import { useEffect } from "react";
import FinalizedToolbar from "../../components/finalizedTodos/finalizedToolbar";
import CustomHead from "../../components/shared/customHead";
import TopNaviagtion from "../../components/shared/navigation/topNavigation";
import TodoCard from "../../components/shared/todoCard";
import useFinalizedTodoStore from "../../hooks/finalizedTodoStore";
import getServerSideProps from "../../lib/serverProps";
import { trpc } from "../../utils/trpc";

const GeneralTodos: NextPage = () => {
  const generalTodos = trpc.todo.getGeneralTodos.useQuery().data;
  const finalizedTodosQuery = trpc.todo.getFinalizedTodos.useQuery();
  const finalizedTodosFromDb = useMemo(
    () => finalizedTodosQuery?.data ?? [],
    [finalizedTodosQuery?.data],
  );

  const { finalizedTodos: todos, setFinalizedTodos: setTodos } =
    useFinalizedTodoStore();

  useEffect(() => {
    setTodos(finalizedTodosFromDb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizedTodosFromDb]);

  return (
    <>
      <CustomHead title={title} />
      <div className="flex h-full min-h-screen flex-row">
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <h1 className="mt-5 text-center text-2xl font-bold dark:text-white">
            {title}
          </h1>
          <div className="flex flex-row justify-center">
            <FinalizedToolbar refetch={finalizedTodosQuery.refetch} />
          </div>

          <div className="flex flex-wrap justify-evenly px-5 pt-5">
            <div className="flex w-80 flex-col">
              {todos?.map((todo) => (
                <TodoCard
                  refetch={finalizedTodosQuery.refetch}
                  restore
                  isDragging={false}
                  key={todo.id}
                  todo={todo}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GeneralTodos;

export { getServerSideProps };
