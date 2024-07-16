/** @format */
"use client";
import React, { useEffect } from "react";

import { HiOutlineChevronUpDown } from "react-icons/hi2";

import { FiBell, FiSun } from "react-icons/fi";
import { BsSlashLg } from "react-icons/bs";
import { FaEquals } from "react-icons/fa";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { IoMoonOutline } from "react-icons/io5";
import { useTheme } from "next-themes";
import { RiComputerLine } from "react-icons/ri";
import { tabNames } from "@/constant/tabName";
import VercelSvg from "../../public/svg/vercel-svg";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { title } from "process";

type Props = {};

const pages = tabNames;

export default function Header() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { data: session, status: sessionStatus } = useSession();

    if (sessionStatus !== "authenticated") {
        return null;
    }

    async function fetchData() {
        let token = localStorage.getItem("token");
        token = token ? token.replace(/^"|"$/g, "") : null;

        if (!token) {
            return;
        }
    }

    return (
        <div
            className=" px-8 pt-4 border-b border-gray-500"
            onClick={() => router.push("/")}
        >
            {/* first section */}
            {}
            <div className="flex justify-between  ">
                {/* left */}
                <div className="flex items-center gap-3  ">
                    <div className="cursor-pointers">
                        <VercelSvg />
                    </div>
                    {/* slash  */}
                    <BsSlashLg className="dark:text-gray-500" />

                    {session?.user?.image ? (
                        <Image
                            src={session.user.image}
                            alt="user-image"
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-8 w-8 rounded-full" />
                    )}

                    <p className="font-bold">{session.user?.name}</p>
                    <button
                        className=" p-2 text-xl transition-all hover:dark:bg-gray-800 py-3 rounded-md
        "
                    >
                        <HiOutlineChevronUpDown className="dark:text-gray-500" />
                    </button>
                </div>
                {/* right */}
                <div className=" flex gap-3  ">
                    {/* bell */}
                    <button className="border   h-9 w-9  flex items-center justify-center dark:border-gray-500 rounded-full dark:text-gray-500 dark:hover:text-white ">
                        <FiBell />
                    </button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="border border-gray-500 rounded-md"
                            >
                                <FaEquals />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                    <DropdownMenuShortcut>
                                        ⇧⌘P
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                    <DropdownMenuShortcut>
                                        ⌘S
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuRadioGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <IoMoonOutline className="mr-2 h-4 w-4" />
                                        <span>Theme</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setTheme("system")
                                                }
                                            >
                                                <IoMoonOutline className="mr-2 h-4 w-4" />
                                                <span>Dark</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setTheme("light")
                                                }
                                            >
                                                <FiSun className="mr-2 h-4 w-4" />
                                                <span>Light</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setTheme("system")
                                                }
                                            >
                                                <RiComputerLine className="mr-2 h-4 w-4" />
                                                <span>System default</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* second section */}
            <section className="flex gap-4 overflow-auto scrollbar-hide">
                {pages.map((d, i) => (
                    <div
                        key={i}
                        className={cn("py-2 border-b-2  border-transparent", {
                            "dark:border-white": d.active,
                        })}
                    >
                        <Button
                            className={cn(
                                "hover:dark:bg-gray-900 text-gray-500",
                                {
                                    "dark:text-white": d.active,
                                }
                            )}
                            variant={"ghost"}
                            key={i}
                            onClick={() =>
                                router.push(`/${title.toLowerCase()}`)
                            }
                        >
                            {d.title}{" "}
                        </Button>
                    </div>
                ))}
            </section>
        </div>
    );
}
