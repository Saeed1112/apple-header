"use client";
import React, { useEffect, useState } from "react";
import "./index.css";

const list = [
  {
    name: "فروشگاه",
    child: [
      {
        name: "فروشگاه",
        items: [
          "جدیدترین محصولات",
          "موبایل",
          "لپتاپ",
          "قطعات کامپیوتر",
          "Apple Watch",
          "Accessories",
        ],
      },
      {
        name: "لینک ها",
        items: [
          "نزدیک ترین شعب",
          "خرید حظوری",
          "پشتیبانی فروش",
          "پرسش های قبل از خرید",
          "College Student Offer",
        ],
      },
      {
        name: "Shop Special Stores",
        items: [
          "Certified Refurbished",
          "Education",
          "Business",
          "Veteran and Military",
          "Government",
        ],
      },
    ],
  },
  {
    name: "خدمات",
    child: [
      {
        name: "Quick Links",
        items: [
          "Find a Store",
          "Order Status",
          "Apple Trade In",
          "Financing",
          "College Student Offer",
        ],
      },
      {
        name: "Shop Special Stores",
        items: [
          "Certified Refurbished",
          "Education",
          "Business",
          "Veteran and Military",
          "Government",
        ],
      },
    ],
  },
  { name: "محصولات", child: [] },
  { name: "iPad", child: [] },
  { name: "Watch", child: [] },
  { name: "Vision", child: [] },
  { name: "AirPods", child: [] },
  { name: "Tv & Home", child: [] },
  { name: "Entertainment", child: [] },
  {
    name: "Accessories",
    child: [],
  },
  { name: "Support", child: [] },
];

const CtFlyingHeader = function () {
  const [state, setState] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  function onResize() {
    const width = window.innerWidth;
    setIsMobile(width < 1024);
  }

  useEffect(() => {
    setState(0);
    setCurrentIndex(0);
    setHeight(0);
  }, [isMobile]);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function mouseEnter({ index, child }: { index: number; child: any[] }) {
    if (isMobile) return;
    setCurrentIndex(index);
    if (child.length > 0) {
      setState(2);
      setHeight(getHeight(child[0]));
    } else {
      setState(0);
      setHeight(0);
    }
  }

  function getHeight(firstChild: any) {
    return (firstChild && firstChild.items.length * 4 + 6) || 0;
  }

  function mouseLeaveItem(firstChild: any) {
    if (isMobile) return;
  }

  function mouseLeave() {
    if (isMobile) return;
    setState(0);
    setHeight(0);
  }

  function onClickItems({ child, index }: any) {
    if (child.length > 0) {
      setCurrentIndex(index);
      setState(2);
    }
  }

  function openInMobileMode() {
    if (!isMobile) return;
    setState((prev) => {
      return prev > 0 ? 0 : 1;
    });
  }

  function backInMobileMode() {
    setCurrentIndex(-1);
    setState((state) => state - 1);
  }

  return (
    <header
      style={{ "--nav-height": height + "rem" } as React.CSSProperties}
      onMouseLeave={mouseLeave}
      className={`${state > 0 ? "show-items" : ""}
      ${state > 1 ? "step-2" : ""}
     header fixed left-0 right-0 top-0 z-50 h-11 bg-white/80 font-kalameh text-gray-900 backdrop-blur-md dark:bg-neutral-950/80 dark:text-white lg:flex lg:overflow-visible`}
    >
      <div className="header-container flex flex-1 lg:h-[--nav-height]">
        <ul className="container flex h-11 w-full items-center gap-3 self-start px-10 text-xl font-semibold lg:text-xs lg:font-medium">
          <li
            className="back-btn flex aspect-square h-11 items-center justify-center lg:hidden"
            onClick={backInMobileMode}
          >
            B
          </li>
          <li className="absolute bottom-0 left-0 right-0 top-0 lg:static">
            <ul className="navbar mt-16 flex flex-col gap-3 px-10 text-xl font-semibold lg:container lg:mt-0 lg:w-full lg:flex-row lg:justify-between lg:px-0 lg:text-xs lg:font-medium">
              {list.map(({ child, name }, index) => (
                <li
                  onMouseLeave={() => mouseLeaveItem(child[0])}
                  onMouseEnter={() => mouseEnter({ child, index })}
                  onClick={() => onClickItems({ child, index })}
                  className={`item-items group flex h-11 items-center
                  ${state > 1 && index === currentIndex && "pop-child"}`}
                  key={name}
                  style={
                    {
                      "--group-number": index + 1,
                      "--total-items": child.length,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={`item flex w-full cursor-pointer justify-between
                     ${state > 1 && "show-child"}`}
                  >
                    <span>{name}</span>
                    <span className="mr-auto translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 lg:hidden">
                      -
                    </span>
                  </div>
                  <div className="child-list container ">
                    <div className="relative flex w-full flex-wrap gap-10 gap-y-0 pb-10 pt-0 lg:flex-row">
                      {child.map(({ items, name }, index) => (
                        <ChildList
                          key={name}
                          index={index}
                          items={items}
                          name={name}
                        />
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </li>
          <li className="z-50 mr-auto lg:hidden" onClick={openInMobileMode}>
            Open
          </li>
        </ul>
      </div>
    </header>
  );
};
export default CtFlyingHeader;

function ChildList({ items, name, index }: any) {
  return (
    <div
      style={{ "--group-number": index + 1 } as React.CSSProperties}
      className="item-groups mt-8 flex w-full flex-col gap-5 pb-10  text-lg first:w-full first:text-2xl sm:w-auto lg:mt-24 lg:w-auto lg:first:w-auto"
    >
      <h2
        style={{ "--item-number": 1 } as React.CSSProperties}
        className="child-items text-sm font-light text-gray-400"
      >
        {name}
      </h2>
      <ul className="flex flex-col gap-3">
        {items.map((item: any, index: number) => (
          <ChildItem item={item} index={index} key={item} />
        ))}
      </ul>
    </div>
  );
}

function ChildItem({ item, index }: any) {
  return (
    <li
      className="child-items"
      style={{ "--item-number": index + 2 } as React.CSSProperties}
    >
      {item}
    </li>
  );
}
