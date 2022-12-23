import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { snackbar } from "../../styles/transitionClasses";

type SnackbarProps = {
  showAlert: boolean;
  message: string;
  randomMessages?: string[];
};

export default function Snackbar({
  showAlert,
  message,
  randomMessages,
}: SnackbarProps) {
  const [messageToDisplay, setMessageToDisplay] = useState<string | null>(null);

  useEffect(() => {
    if (!showAlert) return;

    let randomMessage = "";
    if (randomMessages) {
      randomMessage =
        randomMessages[
          Math.floor(Math.random() * randomMessages.length)
        ]?.toString() ?? "";
    }

    setMessageToDisplay(`${message} ${randomMessage}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlert]);

  return (
    <Transition
      className="fixed bottom-3 z-10 flex w-full justify-center md:right-3 md:justify-end"
      show={showAlert}
      {...snackbar}
    >
      <div
        id="toast-success"
        className="text-medium flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow-2xl dark:bg-gray-800 dark:text-white "
        role="alert"
      >
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">{messageToDisplay}</div>
      </div>
    </Transition>
  );
}
