"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import data from "@/components/header.json";
import "./index.css";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

export const HeaderContext = createContext({});

export function useHeader() {
  return useContext(HeaderContext) as {
    prevHeight: number;
    setPrevHeight: React.Dispatch<React.SetStateAction<number>>;
    state: number;
    height: number;
    currentIndex: number;
    isMobile: boolean;
    setState: React.Dispatch<React.SetStateAction<number>>;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    setHeight: React.Dispatch<React.SetStateAction<number>>;
    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

enum States {
  Close,
  ShowMenu,
  ShowSubMenu,
}

function getHeight(item: any) {
  return item.length > 0 ? (item[0]?.items?.length || 0) * 3 + 9 : 0;
}

const states = ["", "open-menu", "open-sub-menu"];

const FlyingHeader = () => {
  const [state, setState] = useState(States.Close);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState(0);
  const [prevHeight, setPrevHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", () => onResize());
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // if (isMobile && state > 0) document.body.style.position = "fixed";
    // else document.body.style.position = "initial";
  }, [isMobile, state]);

  useEffect(() => {
    setCurrentIndex(-1);
    setState(States.Close);
  }, [isMobile]);

  function onResize() {
    const width = window.innerWidth;
    if (width < 768) setIsMobile(true);
    else setIsMobile(false);
  }

  return (
    <HeaderContext.Provider
      value={{
        state,
        currentIndex,
        height,
        isMobile,
        prevHeight,
        setState,
        setCurrentIndex,
        setHeight,
        setPrevHeight,
      }}
    >
      <TheHeader />
      <div
        className={`${
          state > 0 ? "opened" : ""
        } header-background-cover absolute left-0 right-0 h-screen backdrop-blur`}
      ></div>
    </HeaderContext.Provider>
  );
};

export default FlyingHeader;
const TheHeader = function () {
  const { setState, state, isMobile, prevHeight } = useHeader();

  function onMouseLeave() {
    if (isMobile) return;
    setState(States.Close);
  }

  function toggleButtonClick() {
    if (!isMobile) return;
    setState((state) => (state > 0 ? 0 : 1));
  }

  return (
    <header
      style={{ "--prev-height": `${prevHeight}rem` } as React.CSSProperties}
      dir="ltr"
      className={`${states[state]} global-header fixed left-0 right-0 top-0 z-50 flex h-11 overflow-hidden bg-neutral-950/80 font-kalameh font-normal backdrop-blur md:overflow-visible`}
      onMouseLeave={onMouseLeave}
    >
      <div className="header-cover absolute inset-0 z-[54] h-11 bg-neutral-950"></div>
      <ul
        dir="rtl"
        className="container mx-auto flex w-full justify-between gap-2 px-5 text-xs sm:px-0 md:max-h-[2.8rem] md:items-center"
      >
        <li className="back-btn" onClick={() => setState((state) => state - 1)}>
          <button>Back</button>
        </li>
        <li className="nav-items">Apple</li>
        <li className="menu">
          {data.map((item, index) => (
            <Menu
              key={item.name}
              index={index}
              name={item.name}
              child={item.child}
            />
          ))}
        </li>
        <li className="nav-items mr-auto md:mr-0">Static Item</li>
        <li className="nav-items">Static Item</li>
        <li
          className="relative z-[55] flex h-11 items-center justify-center md:hidden"
          onClick={toggleButtonClick}
        >
          {state > 0 ? <CloseIcon /> : <MenuIcon />}
        </li>
      </ul>
    </header>
  );
};

type MenuProps = {
  child: any[];
  name: string;
  index: number;
};

function Menu({ name, child, index }: MenuProps) {
  const { setState, setCurrentIndex, setPrevHeight, isMobile, currentIndex } =
    useHeader();
  const height = getHeight(child);

  function onMouseEnter() {
    if (isMobile) return;
    if (child.length > 0) {
      setState(States.ShowSubMenu);
      setCurrentIndex(index);
    } else setState(States.Close);
    setPrevHeight(height);
  }

  function onMouseLeave() {
    // setPrevHeight(height);
  }

  function onClick() {
    if (!isMobile) return;
    if (child.length > 0) {
      setState(States.ShowSubMenu);
      setCurrentIndex(index);
    } else setState(States.Close);
  }

  return (
    <div
      onMouseLeave={onMouseLeave}
      className="container mx-auto md:mx-0 md:w-auto"
      style={
        {
          "--menu-height": `${height}rem`,
          "--menu-number": index + 1,
        } as React.CSSProperties
      }
    >
      <div className="menu-item">
        <ul onClick={onClick} className="cursor-pointer">
          <li onMouseEnter={onMouseEnter}>{name}</li>
          <li className="hidden"></li>
        </ul>
      </div>
      <div
        dir="ltr"
        className={`${currentIndex === index ? "open" : ""} submenu `}
      >
        <div className="group-container" dir="rtl">
          {child.map((item: any, index) => (
            <ItemsGroup
              key={item.name}
              index={index}
              items={item.items}
              name={item.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ItemsGroup({ items, name, index }: any) {
  return (
    <div
      className="items-group"
      style={
        {
          "--group-number": index + 1,
          "--total-items": items.length + 1,
        } as React.CSSProperties
      }
    >
      <h2
        style={{ "--item-number": 1 } as React.CSSProperties}
        className="single-item mb-1 cursor-default text-xs font-normal text-neutral-200"
      >
        {name}
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item: any, index: number) => (
          <Item item={item} key={item} index={index} />
        ))}
      </ul>
    </div>
  );
}

function Item({ item, index }: any) {
  return (
    <li
      className="single-item"
      style={{ "--item-number": index + 2 } as React.CSSProperties}
    >
      <a href="#">{item}</a>
    </li>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-menu"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
