"use client";
import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import { LiaGitlab } from "react-icons/lia";
import { IoLogoBitbucket } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

interface Props {
    setVarriant: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AuthProvider: React.FC<Props> = ({ setVarriant }) => {
    const { data: session, status: sessionStatus } = useSession();

    const router = useRouter();

    const toggleVariant = useCallback((val: string) => {
        setVarriant(val);
    }, []);

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.replace("/");
        }
    }, [sessionStatus, router]);

    return (
        <div className="my-10 flex flex-col items-center gap-3 justify-center">
            <p className="text-3xl font-bold">Log in to Vercel</p>

            <div className="mt-10 flex flex-col gap-3 justify-center items-center">
                <Button
                    className="hover:bg-slate-500"
                    variant={"secondary"}
                    size={"xl"}
                    onClick={() => {
                        signIn("github");
                    }}
                >
                    <FaGithub className="mr-3 h-5 w-5" />
                    <p className="text-base">Continue with GitHub</p>
                </Button>
                <Button
                    className="bg-violet-500 hover:bg-violet-400"
                    variant={"secondary"}
                    size={"xl"}
                >
                    <LiaGitlab className="mr-3 h-5 w-5" />
                    <p className="text-base">Continue with GitLab</p>
                </Button>
                <Button
                    className="bg-blue-600 hover:bg-blue-500"
                    variant={"secondary"}
                    size={"xl"}
                >
                    <IoLogoBitbucket className="mr-3 h-5 w-5" />
                    <p className="text-base">Continue with Bitbucket</p>
                </Button>
            </div>

            <div className="border-b border-gray-500 grow px-1 py-1 w-80 mt-3" />

            <div className="mt-5 flex flex-col gap-3 justify-center items-center">
                <Button
                    className="border border-gray-400"
                    variant={"ghost"}
                    size={"xl"}
                    onClick={() => toggleVariant("email")}
                >
                    <CiMail className="mr-3 h-5 w-5" />
                    <p className="text-base">Login with Email</p>
                </Button>

                <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => toggleVariant("signup")}
                >
                    <p className="text-base mt-3 underline text-blue-700">
                        Sign Up with Email
                    </p>
                    <FaArrowRight className="mt-3 mr-3 text-blue-700" />
                </div>
            </div>
        </div>
    );
};

export default AuthProvider;
