import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import Navigation from "../components/navigation";
import TopNaviagtion from "../components/topNavigation";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const todos = trpc.todo.getTodos.useQuery();

  return (
    <>
      <Head>
        <title>T3Todo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <Navigation />
        <main className="min-h-screen w-full bg-light lg:flex lg:flex-col">
          <TopNaviagtion />
          <div className="flex flex-wrap justify-center gap-2 pt-5">
            <DashboardCard
              content={todos.data?.length ?? 0}
              title="My Todos"
              href="/todos"
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

const DashboardCard: React.FC<{
  title: string;
  href: string;
  content: number;
}> = ({ title, href, content }) => {
  return (
    <Link
      className="flex min-w-min flex-col gap-4 rounded-xl bg-dark/10 p-4 text-black hover:bg-dark/20"
      href={href}
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="w-80 text-lg">{content}</div>
    </Link>
  );
};

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-dark/10 px-10 py-3 font-semibold text-dark no-underline transition hover:bg-dark/20"
//         onClick={sessionData ? () => signOut() : () => signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
