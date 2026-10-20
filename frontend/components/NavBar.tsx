"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";


import NavMobile from "./NavMobile";

const navigation = [
  ["À propos", "/about"],
  ["Actions", "/actions"],
  ["Actualités", "/news"],
  ["Transparence", "/transparence"],
  ["Devenir membre", "/volunteers"],
  ["Contact", "/contact"],
];

const NavBar = () => {
 
  const pathname = usePathname();

  return (
    <header className="border-b  border-[#d9e0d5] backdrop-blur ">
      <div className="mx-auto grid min-h-18 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-1 sm:px-8 lg:px-10">
        <Link
          href="/"
          className=" flex relative shrink-0 font-display text-xl font-semibold tracking-[-0.03rem]"
        >
          <Image src="/icon.png" alt="logo aso" width={60} height={60} />
        </Link>

        <nav className="hidden items-center justify-center gap-5 lg:flex">
          {navigation.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-center font-semibold text-[15px] transition-colors hover:text-[#0a67d0] ${pathname === href ? "text-[#0a67d0]" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Button
          asChild
          className="hidden justify-self-end font-semibold rounded-full bg-yellow-300 px-5 py-5 text-[15px] text-gray-700 hover:bg-yellow-500 hover:text-black lg:flex"
        >
          <Link href="/donate">
            faire un don <ArrowRight />
          </Link>
        </Button>

        <div className="col-start-3 font-semibold justify-self-end lg:hidden">
          <NavMobile />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
