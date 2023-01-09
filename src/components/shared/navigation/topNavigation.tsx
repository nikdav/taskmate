import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { zoomIn } from "../../../styles/basicStyles";
import { profileMenu, sideMenu } from "../../../styles/transitionClasses";
import { LogoStyle } from "../../../types/enums";
import Logo from "./logo";
import NavigationMenu from "./navigationMenu";

export default function TopNaviagtion() {
  const sessionData = useSession().data;
  const genericHamburgerLine = `h-1 w-5 rounded-full transition bg-sky-600 ease transform duration-200`;

  const menuItems = [
    { name: "Profil", href: `/profile` },
    {
      name: "Einstellungen",
      href: `/profile`,
    },
    {
      name: `${sessionData?.user?.id ? "Abmelden" : "Anmelden"}`,
      href: `${sessionData?.user?.id ? "api/auth/signout" : "auth/signin"}`,
    },
  ];

  const ProfileMenuButton = (
    <Menu>
      <div>
        <Menu.Button
          className={classNames(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm outline-none ring-1 ring-sky-600 ring-offset-1 ring-offset-transparent",
            zoomIn
          )}
          aria-label="profile"
        >
          <Image
            width="50"
            height="50"
            className="h-8 w-8 rounded-full"
            src={sessionData?.user?.image ?? "/guestIcon.svg"}
            alt="Profile Image"
          />
        </Menu.Button>
      </div>
      <Transition as={Fragment} {...profileMenu}>
        <Menu.Items className="absolute right-3 top-14 right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {menuItems.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <Link
                  href={item.href}
                  legacyBehavior={false}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  {item.name}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );

  const getStyle = () => {
    if (typeof window !== "undefined") return { height: screen.height - 80 };
  };

  const MainMenuButton = (
    <Menu as={"div"} className="md:hidden">
      {({ open, close }) => (
        <>
          <Menu.Button
            as="button"
            aria-label="menu"
            className={classNames(
              "group flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full ring-1 ring-sky-600 ring-offset-1 ring-offset-transparent",
              zoomIn
            )}
          >
            <div
              className={classNames(
                genericHamburgerLine,
                open ? "translate-y-2 rotate-45" : ""
              )}
            />
            <div
              className={classNames(
                genericHamburgerLine,
                open ? "opacity-0" : ""
              )}
            />
            <div
              className={classNames(
                genericHamburgerLine,
                open ? "-translate-y-2 -rotate-45" : ""
              )}
            />
          </Menu.Button>
          <Transition as={Fragment} {...sideMenu}>
            <Menu.Items
              style={getStyle()}
              className="absolute left-0 top-20 w-full bg-white py-1 pl-6 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-700"
            >
              <NavigationMenu closeMenu={close} logoStyle={LogoStyle.Menu} />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );

  return (
    <div className="min-w-screen sticky top-0 z-10 flex h-20 items-center justify-between gap-2 border-b bg-gray-100 px-4 dark:border-slate-900 dark:bg-slate-700 md:justify-end">
      {MainMenuButton}
      <Logo logoStyle={LogoStyle.Top} />
      {ProfileMenuButton}
    </div>
  );
}
