import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VercelSvg from "../../public/svg/vercel-svg";

type Props = {};

const Navbar = (props: Props) => {
    return (
        <div className=" px-8 pt-4 ">
            {/* first section */}
            <section className="flex justify-between items-center ">
                {/* left */}
                <Link href="/">
                    <VercelSvg />
                </Link>

                {/* right */}
                <div className=" flex gap-3 items-center ">
                    <p className="text-gray-400">Contact</p>
                    <Button
                        className={
                            " hover:dark:bg-gray-700  border border-gray-400"
                        }
                        variant={"ghost"}
                        size={"sm"}
                    >
                        Sign Up
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Navbar;
