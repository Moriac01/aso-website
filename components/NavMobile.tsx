'use client'

import Link from "next/link"
import { ArrowRight, Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Button } from "./ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet"

const navigation = [
  ["À Propos", "/about"],
  ["Actions", "/actions"],
  ["Actualités", "/news"],
  ["Devenir Membres", "/volunteers"],
  ["Contact", "/contact"],
];



const NavMobile = () => {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

  return (
        <div className="px-5">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
        <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="relative z-10 size-10 rounded-full border-2 bg-white px-5 text-[#0d0e0d] shadow-sm hover:bg-[#e6eee5] hover:text-[#17483b] lg:hidden xl:hidden"
                    aria-label="Ouvrir le menu"
        >
                    <Menu className="size-6" aria-hidden="true" />
        </Button>
                </SheetTrigger>

                <SheetContent
                    id="mobile-navigation"
                    side="top"
                    className="data-[side=top]:top-18 border-b-[#d9e0d5] bg-white px-6 py-6 text-[#0d0e0d]"
                >
                    <SheetHeader className="items-center px-0 pb-5 pr-10">
                        <SheetTitle className="font-display text-xl font-semibold text-[#17483b]">
                            ASO
                        </SheetTitle>
                        <SheetDescription className="text-center text-sm leading-6 text-[#526057]">
                            Agir ensemble pour un avenir plus solidaire.
                        </SheetDescription>
                    </SheetHeader>

                    <nav aria-label="Navigation mobile" className="mx-auto flex w-full max-w-md flex-col items-center">
                        {navigation.map(([label, href]) => {
                            const isActive = pathname === href

                            return (
                                <SheetClose asChild key={href}>
                                    <Link
                                        href={href}
                                        className={`flex w-full items-center justify-center gap-2 py-3 text-center text-base transition-colors hover:text-sky-600 ${isActive ? "font-semibold text-sky-600" : "text-[#17483b]"}`}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        {label}
                                        <ArrowRight className="size-4" aria-hidden="true" />
                                    </Link>
                                </SheetClose>
                            )
                        })}
                    </nav>

                    <div className="mx-auto w-full max-w-md pt-6">
                        <SheetClose asChild>
                            <Button
                                asChild
                                className="w-full rounded-full bg-yellow-300 py-5 text-sm text-gray-700 hover:bg-yellow-500 hover:text-black"
                            >
                                <Link href="/donate">
                                    Faire un don <ArrowRight />
                                </Link>
                            </Button>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
    </div>
  )
}

export default NavMobile