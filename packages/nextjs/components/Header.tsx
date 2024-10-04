import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import TopicCard from "./TopicCard";
import { Bars3Icon, BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useCategoryContext } from "~~/provider/categoryProvider";

interface HeaderMenuLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/0xleeduckgo",
  },
  {
    label: "🔥 Buy Shares to support!",
    href: "https://bodhi.wtf/space/5/15353?action=buy",
  },
  {
    label: "Contract Interactor",
    href: "/debug",
  },
  // {
  //   label: "Tagger",
  //   href: "/debug",
  //   icon: <BugAntIcon className="h-4 w-4" />,
  // },
  // {
  //   label: "ETH-SPACE",
  //   href: "/",
  //   icon: <SparklesIcon className="h-4 w-4" />,
  // },
  // {
  //   label: "Block Explorer",
  //   href: "https://sepolia-blockscout.scroll.io/address/0xEd6a0A29A962B4296bCeEC4e1E55F5Ec0474EAC7/contracts#address-tabs",
  //   icon: <MagnifyingGlassIcon className="h-4 w-4" />,
  // },
];

export const HeaderMenuLinks = () => {
  const router = useRouter();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = router.pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              target={href == "/" ? undefined : "_blank"}
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { categories, category, loading, setCategory } = useCategoryContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false);
  const topicMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    topicMenuRef,
    useCallback(() => setIsTopicDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <div className="lg:hidden dropdown" ref={topicMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isTopicDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsTopicDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <span className="h-1/2 flex justify-center items-center">Sections</span>
          </label>
          {isTopicDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow-2xl bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsTopicDrawerOpen(false);
              }}
            >
              <TopicCard />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">🤘 Indiehacker Operation System 🤘</span>
            <span className="text-xs">ꄃ The mind operation system for indiehacker ꄃ.</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
