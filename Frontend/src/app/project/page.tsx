"use client";
import React, { useEffect, useState } from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CodeImg from "../../../public/vercel.png";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { TbActivityHeartbeat } from "react-icons/tb";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/config/axiosInstance";
import {
    extractRepoInfo,
    formatDateToHoursAgo,
    getVistURL,
} from "@/lib/helper";
import { GoLinkExternal } from "react-icons/go";
import Dot from "@/components/Dot";
import { useSession } from "next-auth/react";

type Props = {};

interface ProjectData {
    name: string;
    gitURL: string;
    subDomain: string;
    id: string;
    customDomain: string;
    createdAt: string;
    updatedAt: string;
    Deployement: [
        {
            status: string;
            updatedAt: string;
        }
    ];
}

interface RepoData {
    repoName: string;
    owner: string;
}

const Page = (props: Props) => {
    const [repoData, setRepoData] = useState<RepoData>({
        repoName: "",
        owner: "",
    });
    const router = useRouter();
    const [visitURL, setVisitURL] = useState<string>("");
    const { data: session } = useSession();
    const [projectData, setProjectData] = useState<ProjectData>({
        name: "",
        gitURL: "",
        subDomain: "",
        id: "",
        customDomain: "",
        createdAt: "",
        updatedAt: "",
        Deployement: [
            {
                status: "",
                updatedAt: "",
            },
        ],
    });

    const searchParam = useSearchParams();
    const projectId = searchParam.get("id");

    async function fetchProject() {
        try {
            const response = await axiosInstance.post(
                "getproject/",
                { id: projectId },
                {
                    headers: {
                        Authorisation: session?.serverToken,
                    },
                }
            );
            setProjectData(response?.data.data);
            console.log("project data", response.data);
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
    }

    function visitURLSetter() {
        const url = projectData.customDomain
            ? projectData.customDomain
            : projectData.subDomain;
        const updatedURL = getVistURL(url);
        setVisitURL(updatedURL);
    }

    function getStatus() {
        let status = projectData?.Deployement[0]?.status;
        if (!status) status = "NOT_STARTED";
        return status;
    }

    useEffect(() => {
        fetchProject();
    }, []);

    useEffect(() => {
        visitURLSetter();
        const { repoName, owner } = extractRepoInfo(projectData.gitURL);
        setRepoData({ repoName: repoName, owner: owner });
    }, [projectData]);

    return (
        <div>
            <div className="min-h-[380px]">
                <div className="flex items-center justify-between mt-5">
                    <CardHeader className="ml-2">
                        <CardTitle className="text-4xl ">
                            {projectData?.name}
                        </CardTitle>
                    </CardHeader>
                    <div className="flex items-center justify-between gap-4 mr-5">
                        <a
                            className="cursor-pointer"
                            href={projectData?.gitURL}
                            target="_blank"
                        >
                            <Button
                                className="border border-gray-600 rounded-r-sm"
                                variant={"ghost"}
                            >
                                <FaGithub className="mr-3 h-5 w-5" />
                                Repository
                            </Button>
                        </a>
                        <Button>
                            <a
                                className="cursor-pointer"
                                href={visitURL}
                                target="_blank"
                            >
                                Vist
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="border-b border-gray-600 mx-3 mr-10 grow px-1 py-1 w-full mb-3" />
                <div className="flex items-center justify-between">
                    <CardHeader className="ml-2">
                        <CardTitle className="text-2xl ">
                            Production Deployment
                        </CardTitle>
                        <CardDescription className="text-base">
                            The deployment that is available to your visitors.
                        </CardDescription>
                    </CardHeader>
                    <div className="flex items-center justify-between gap-4 mr-5">
                        <Button
                            className="border border-gray-600 rounded-r-sm"
                            variant={"ghost"}
                            onClick={() =>
                                router.push(`/deploy/?id=${projectId}`)
                            }
                        >
                            Deploy
                        </Button>
                        <Button
                            className="border border-gray-600 rounded-r-sm"
                            variant={"ghost"}
                        >
                            <a
                                className="cursor-pointer"
                                href="{deployPreviewURL}"
                                target="_blank"
                            >
                                Delete
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="relative my-10 mx-8">
                    <div className="top-0 right-0 absolute p-6">
                        <button className="border-4 dark:border-gray-700 h-8 w-8 rounded-full text-2xl flex items-center justify-center dark:text-gray-700">
                            <TbActivityHeartbeat />
                        </button>
                    </div>
                    <div className="border border-gray-600 rounded-lg">
                        <div className="flex items-start gap-10 justify-items-start p-6">
                            <div className="border border-gray-500 rounded-lg">
                                <Image
                                    src={CodeImg}
                                    width={450}
                                    height={450}
                                    alt="Code Image"
                                    className="rounded-lg "
                                />
                            </div>
                            <div className="flex flex-col gap-7 items-start justify-between">
                                <div className="flex flex-col gap-3 items-start justify-between">
                                    <Label className="text-gray-400">
                                        Deployment
                                    </Label>
                                    {getStatus() == "READY" ? (
                                        <a
                                            href={getVistURL(
                                                projectData.subDomain
                                            )}
                                            target="_blank"
                                        >
                                            <Label className="cursor-pointer">
                                                {getVistURL(
                                                    projectData.subDomain
                                                )}
                                            </Label>
                                        </a>
                                    ) : (
                                        <Label className="cursor-pointer">
                                            Project not ready
                                        </Label>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3 items-start justify-between">
                                    <Label className="text-gray-400">
                                        Domain
                                    </Label>
                                    {getStatus() == "READY" ? (
                                        <a href={visitURL} target="_blank">
                                            <Label className="flex items-center gap-1 cursor-pointer">
                                                {visitURL}
                                                <GoLinkExternal />
                                            </Label>
                                        </a>
                                    ) : (
                                        <Label className="cursor-pointer">
                                            Project not ready
                                        </Label>
                                    )}
                                </div>
                                <div className="flex gap-8 items-center ">
                                    <div className="flex flex-col gap-3 items-start justify-between">
                                        <Label className="text-gray-400 flex items-center gap-1">
                                            Status
                                        </Label>
                                        <Label className="flex items-center gap-2">
                                            <Dot status={getStatus()} />
                                            {getStatus()}
                                        </Label>
                                    </div>
                                    <div className="flex flex-col gap-3 items-start justify-between">
                                        <Label className="text-gray-400">
                                            Created
                                        </Label>
                                        <Label>
                                            {formatDateToHoursAgo(
                                                projectData?.createdAt
                                            )}{" "}
                                            by {repoData.owner}
                                        </Label>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 items-start justify-between">
                                    <Label className="text-gray-400">
                                        Sourse
                                    </Label>
                                    <Label className="font-bold flex gap-3 items-center">
                                        <FaGithub />
                                        <p>By GitHub</p>
                                    </Label>
                                    <Label>{repoData.repoName}</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
