"use client";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/config/axiosInstance";
import { getToken } from "@/lib/getSession";
import { Fira_Code } from "next/font/google";
import { extractRepoInfo } from "@/lib/helper";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaGithub } from "react-icons/fa";

type Props = {};
const firaCode = Fira_Code({ subsets: ["latin"] });

interface ProjectData {
    id: string;
    name: string;
    gitURL: string;
    subDomain: string;
    customDomain: string;
    createdAt: string;
}

interface RepoData {
    owner: string;
    repoName: string;
}

const Page = (props: Props) => {
    const token = getToken();
    const logContainerRef = useRef<HTMLElement>(null);

    const [projectData, setProjectData] = useState<ProjectData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLogging, setIsLogging] = useState<boolean>(false);
    const [deployementId, setDeploymentId] = useState<string>("");
    const [isDone, setDone] = useState<boolean>(false);
    const [respoURL, setRepoURL] = useState<RepoData>();
    const [deployPreviewURL, setDeployPreviewURL] = useState<
        string | undefined
    >();

    const searchParam = useSearchParams();
    const projectId = searchParam.get("id");

    async function fetchProjectData() {
        try {
            const response = await axiosInstance.post(
                "getproject",
                { id: projectId },
                {
                    headers: {
                        Authorisation: token,
                    },
                }
            );
            setProjectData(response.data.data);
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
    }

    async function changeStatusOfDeployment() {
        try {
            if (!deployementId) return;
            await axiosInstance.post(
                "getproject/changestatus",
                { id: deployementId },
                {
                    headers: {
                        Authorisation: token,
                    },
                }
            );
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
    }

    const handleClickDeploy = useCallback(async () => {
        if (!projectId) {
            toast.error("Project ID required");
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.post(
                "project/deploy",
                { projectId: projectId },
                {
                    headers: {
                        Authorisation: token,
                    },
                }
            );

            if (data && data.data) {
                const { deployementId, url } = data.data;
                setDeploymentId(deployementId);
                setDeployPreviewURL(url);
                setLogs([{ log: "Please wait, starting your build..." }]);
                setIsLogging(true);
            }

            console.log("response", data.data);
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
    }, [projectId]);

    async function handleLogs() {
        if (!deployementId) {
            toast.error("Deployment ID not found");
            return;
        }
        try {
            const { data } = await axiosInstance.post(
                "project/logs",
                { deployementId: deployementId },
                {
                    headers: {
                        Authorisation: token,
                    },
                }
            );
            setLogs((prevLogs) => {
                const newLogs = data?.logs.filter(
                    (log: any) =>
                        !prevLogs.some((prevLog) => prevLog.log === log.log)
                );
                return [...prevLogs, ...newLogs];
            });

            logContainerRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
    }

    useEffect(() => {
        let intervalId: any;
        if (isLogging) {
            intervalId = setInterval(async () => {
                await handleLogs();
                logs.map((log) => {
                    if (log.log === "Done") {
                        clearInterval(intervalId);
                        setIsLogging(false);
                        setDone(true);
                    }
                });
            }, 3000);
        }
        return () => clearInterval(intervalId);
    }, [isLogging, logs]);

    useEffect(() => {
        fetchProjectData();
    }, []);

    useEffect(() => {
        changeStatusOfDeployment();
    }, [isDone]);

    useEffect(() => {
        const { owner, repoName } = extractRepoInfo(
            projectData?.gitURL ? projectData?.gitURL : ""
        );
        setRepoURL({ owner, repoName });
    }, [projectData]);

    useEffect(() => {}, [isDone]);

    return (
        <div className="mt-4">
            <div className="min-h-screen w-full flex gap-7 flex-col  ">
                <div className="flex items-start justify-between">
                    <CardHeader className="ml-2">
                        <CardTitle className="text-4xl ">
                            {`You're almost done`}
                        </CardTitle>
                        <CardDescription className="text-base">
                            Please follow the steps to configure your Project
                            and deploy it.
                        </CardDescription>
                    </CardHeader>
                    <div className="flex items-center justify-between gap-4 mr-5">
                        <a href={projectData?.gitURL} target="_blank">
                            <Button
                                className="border border-gray-600 rounded-r-sm"
                                variant={"ghost"}
                            >
                                Repository
                            </Button>
                        </a>
                        <Button disabled={!isDone}>
                            <a href={deployPreviewURL} target="_blank">
                                Vist
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-7">
                    <div>
                        <div className="w-[600px] mt-1 border rounded-lg border-gray-600 px-4 pt-6 ml-4">
                            <form>
                                <CardContent>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Name</Label>
                                            <Label htmlFor="name">
                                                {projectData?.name}
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Sub Domain</Label>
                                            <Label htmlFor="name">
                                                {projectData?.subDomain}
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Custom Domain</Label>
                                            <Label htmlFor="name">
                                                {projectData?.customDomain ? (
                                                    projectData?.customDomain
                                                ) : (
                                                    <Label className="text-gray-400">
                                                        Did not provided
                                                    </Label>
                                                )}
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Created by</Label>
                                            <Label htmlFor="name">
                                                {/* {user.firstName} */}Name
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Deployed URL</Label>
                                            <Label htmlFor="name">
                                                {deployPreviewURL ? (
                                                    <a
                                                        href={deployPreviewURL}
                                                        target="_blank"
                                                    >
                                                        {deployPreviewURL}
                                                    </a>
                                                ) : isLoading ? (
                                                    <p className="text-gray-400">
                                                        Deploying...
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-400">
                                                        Not available
                                                    </p>
                                                )}
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label className="flex items-center justify-center">
                                                <FaGithub className="h-4 w-4 mr-2" />
                                                Git URL
                                            </Label>
                                            <a
                                                href={projectData?.gitURL}
                                                target="_blank"
                                            >
                                                <Label
                                                    htmlFor="name"
                                                    className="cursor-pointer"
                                                >
                                                    {respoURL?.owner +
                                                        "/" +
                                                        respoURL?.repoName}
                                                </Label>
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end mt-3">
                                    <Button
                                        className="border border-gray-400"
                                        variant={"default"}
                                        size={"default"}
                                        disabled={isLoading}
                                        onClick={handleClickDeploy}
                                    >
                                        <p className="text-base">Deploy</p>
                                    </Button>
                                </CardFooter>
                            </form>
                        </div>
                    </div>
                    <div className="w-full flex items-start justify-center">
                        {logs.length > 0 ? (
                            <div
                                className={`${firaCode.className} border border-gray-500 rounded-md text-sm w-[80%] text-green-500 logs-container p-4 px-4 h-[400px] overflow-y-auto`}
                            >
                                <pre className="flex flex-col gap-1">
                                    {logs.map((log: any, i) => (
                                        <code
                                            ref={
                                                logs.length - 1 === i
                                                    ? logContainerRef
                                                    : undefined
                                            }
                                            key={i}
                                        >
                                            {log && `> ${log.log}`}
                                        </code>
                                    ))}
                                </pre>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-[100%]">
                                <p className="text-gray-400 text-lg">
                                    Logs will appear here when deploy start
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
