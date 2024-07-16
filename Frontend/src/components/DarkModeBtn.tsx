/** @format */
"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { IoMoonOutline } from "react-icons/io5";
import { FiSun } from "react-icons/fi";
import { RiComputerLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

type Props = {};

export default function DarkModeBtn({}: Props) {
    const { theme, setTheme } = useTheme();

    return (
        <div className="border border-gray-500 dark:border-gray-500 rounded-full">
            <section className="flex">
                <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                        "p-2  rounded-full text-gray-400 dark:hover:text-white hover:text-slate-800 transition-all",
                        theme === "dark" &&
                            "bg-gray-400 dark:bg-gray-700  text-gray-700 dark:text-gray-400"
                    )}
                >
                    <IoMoonOutline />
                </button>
                <button
                    onClick={() => setTheme("light")}
                    className={cn(
                        "p-2  rounded-full text-gray-400 dark:hover:text-white hover:text-slate-800 transition-all",
                        theme === "light" &&
                            "bg-gray-400 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
                    )}
                >
                    <FiSun />
                </button>
                <button
                    onClick={() => setTheme("system")}
                    className={cn(
                        "p-2  rounded-full text-gray-400 dark:hover:text-white hover:text-slate-800 transition-all",
                        theme === "system" &&
                            "bg-gray-400 dark:bg-gray-700  text-gray-700 dark:text-gray-400"
                    )}
                >
                    <RiComputerLine />
                </button>
            </section>
        </div>
    );
}
