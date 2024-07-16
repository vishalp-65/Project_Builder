/** @format */

import React, { useEffect, useState } from "react";
import { TbActivityHeartbeat } from "react-icons/tb";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaGithub } from "react-icons/fa6";
import { PiGitBranchDuotone } from "react-icons/pi";
import toast from "react-hot-toast";
import axiosInstance from "@/config/axiosInstance";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/getSession";
import { formatDateTime } from "@/lib/helper";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Star } from "lucide-react";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import VercelSvg from "public/svg/vercel-svg";

type Props = {};

export default function AllProjects({}: Props) {
    const router = useRouter();

    const [project, setProject] = useState<[]>([]);

    if (!getSession()) {
        router.push("/auth");
    }

    async function fetchProject() {
        try {
            const response = await axiosInstance.get("getproject/", {
                // headers: {
                //     Authorisation: token,
                // },
            });
            console.log("response", response);
            setProject(response?.data?.data);
        } catch (error) {
            toast.error("error");
            return;
        }
    }

    // useEffect(() => {
    //     fetchProject();
    // }, [token]);

    return (
        <div className="h-screen">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 transition-all xl:grid-cols-3 ">
                {project.length > 0 &&
                    project.map((data: any, i) => (
                        <ProjectCard
                            key={i}
                            id={data?.id}
                            title={data?.name}
                            link={
                                data?.customDomain
                                    ? `http://${data?.customDomain}.localhost:8000`
                                    : `http://${data?.subDomain}.localhost:8000`
                            }
                            githubRepo={data?.gitURL}
                            lastCommitTime={formatDateTime(data?.updatedAt)}
                        />
                    ))}
            </div>
            {project.length <= 0 && (
                <div className="flex items-center justify-center h-[80%]">
                    <div className="w-full flex items-center justify-center">
                        <p className="text-3xl text-gray-500">
                            Create new project
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

interface ProjectCardProps {
    id: string;
    title: string;
    link: string;
    githubRepo: string;
    lastCommitTime: string;
}

function ProjectCard(props: ProjectCardProps) {
    const { id, title, link, githubRepo, lastCommitTime } = props;

    const router = useRouter();

    return (
        <div className="border rounded-lg dark:border-gray-500 p-4 dark:hover:border-white flex flex-col gap-4 cursor-pointer transition-all">
            <section className="flex justify-between items-center">
                <section className="flex gap-4">
                    <div className="flex items-center justify-center border min-h-8 min-w-8 h-8 w-8 rounded-full dark:border-gray-700">
                        <VercelSvg className="h-3" />
                    </div>
                    <div className="flex flex-col items-start">
                        <button
                            onClick={() => router.push(`/project/?id=${id}`)}
                            className="hover:underline whitespace-nowrap text-ellipsis overflow-hidden max-w-52"
                        >
                            {title}
                        </button>
                        <button className="dark:text-gray-500 hover:underline text-sm whitespace-nowrap text-ellipsis overflow-hidden max-w-52">
                            {link}
                        </button>
                    </div>
                </section>
                <section className="flex items-center gap-3">
                    <button className="border-4 dark:border-gray-700 h-8 w-8 rounded-full text-2xl flex items-center justify-center dark:text-gray-700">
                        <TbActivityHeartbeat />
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center justify-center h-7 w-6 rounded-md hover:dark:bg-gray-500">
                                <HiOutlineDotsHorizontal />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                Project settings
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup className="cursor-pointer">
                                <DropdownMenuItem>
                                    <span>Add Favorite</span>
                                    <DropdownMenuShortcut>
                                        <Star className="mr-2 h-4 w-4" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Delete</span>
                                    <DropdownMenuShortcut>
                                        <AiOutlineDelete className="mr-2 h-4 w-4" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <span>Settings</span>
                                    <DropdownMenuShortcut>
                                        <IoSettingsOutline className="mr-2 h-4 w-4" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </section>
            </section>
            <button className="flex items-center gap-2 rounded-full px-4 py-1 dark:bg-gray-900 w-fit">
                <FaGithub />
                <p className="text-ellipsis text-sm overflow-hidden max-w-52 whitespace-nowrap">
                    {githubRepo}
                </p>
            </button>
            <div className="text-gray-400">
                <p className="flex gap-1 text-sm items-center">
                    <span>{lastCommitTime} ago on</span>
                    <PiGitBranchDuotone className="text-xl dark:text-white" />
                    <span className="dark:text-white">master</span>
                </p>
            </div>
        </div>
    );
}
