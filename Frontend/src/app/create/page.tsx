/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/config/axiosInstance";
import { useRouter } from "next/navigation";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import axios from "axios";
import { FaReact } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { DialogBar } from "@/components/DialogBar";
import { Input } from "@/components/ui/input";

type Props = {};

interface ProjectData {
    gitURL: string;
    name: string;
    customDomain: string;
}

interface Repo {
    id: number;
    name: string;
    language: string;
    clone_url: string;
}

const CreateProject = (props: Props) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchData, setSearchData] = useState("");
    // const [filteredRepo, setFilteredRepo] = useState(repos);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState({ name: "", clone_url: "" });
    const [projectData, setProjectData] = useState<ProjectData>({
        gitURL: "",
        name: "",
        customDomain: "",
    });

    // Handle dialog open close
    const handleImportClick = (repo: Repo) => {
        setDialogData({ name: repo.name, clone_url: repo.clone_url });
        setIsOpen(true);
    };

    const handleCreateClick = () => {};

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (!projectData.name) {
            toast.error("Please enter name");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post(
                "project/create",
                projectData,
                {
                    // headers: {
                    //     Authorisation: token,
                    // },
                }
            );

            console.log("response", response);
            const projectId = response.data.data.id;

            toast.success("Project created");
            router.push(`/deploy/?id=${projectId}`);
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
        setIsLoading(false);
    }

    // Filter searched data
    const filteredRepos = repos.filter((repo) =>
        repo.name.toLowerCase().includes(searchData.toLowerCase())
    );

    useEffect(() => {
        if (session?.accessToken) {
            const fetchRepos = async () => {
                try {
                    const res = await axios.get(
                        "https://api.github.com/user/repos",
                        {
                            headers: {
                                Authorization: `token ${session.accessToken}`,
                            },
                        }
                    );
                    setRepos(res.data);
                    console.log("repo", repos);
                } catch (error) {
                    console.error("Error fetching repositories:", error);
                }
            };
            fetchRepos();
        } else {
            console.log("No access token found");
        }
    }, [session]);

    if (!session) return <div>Loading...</div>;

    if (!repos)
        return (
            <div className="flex items-center justify-center">
                Fetching repositories data....
            </div>
        );

    return (
        <div className="mb-6">
            <div
                className="w-full flex flex-col items-center justify-evenly mt-5 border 
            border-gray-300 dark:border-gray-600 rounded-lg px-5 py-3 gap-7 lg:gap-4 lg:px-5 lg:py-3 lg:flex lg:flex-row"
            >
                <div className="w-full lg:w-[35%] flex flex-col items-start justify-between gap-5">
                    <p className="text-4xl font-bold">
                        Let's build something new
                    </p>
                    <p className="text-base text-gray-500">
                        To deploy a new React/Vite Project, import an existing
                        Git
                        <br />
                        Repository or paste your gitHub repo URL.
                    </p>
                </div>
                <div className="w-full lg:w-[55%] flex flex-col items-start bg-white dark:bg-black justify-center mb-5">
                    <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                        <CardHeader>
                            <CardTitle>Import Git Repository</CardTitle>
                        </CardHeader>

                        <div className="px-4">
                            <Input
                                placeholder="Search Repositories..."
                                className="px-4 w-full bg-inherit mb-4 mt-2"
                                value={searchData}
                                onChange={(e) => setSearchData(e.target.value)}
                            />
                        </div>

                        <div className="h-full px-4">
                            <div
                                className="h-96 flex flex-col border border-gray-300 dark:border-gray-800 rounded-sm items-center 
                            justify-start overflow-y-auto "
                            >
                                {filteredRepos.map((repo) => (
                                    <div
                                        className="flex border border-x-gray-300 border-t-gray-300 px-3 
                                    py-3 items-center justify-between w-full dark:border-x-gray-800 dark:border-t-gray-800"
                                        key={repo.id}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="border border-gray-500 rounded-full w-7 h-7 flex items-center justify-center p-1">
                                                <FaReact className="text-black dark:text-gray-300" />
                                            </div>
                                            <div className="flex flex-col gap-1 justify-between items-start">
                                                <p className="truncate w-[160px] md:w-full">
                                                    {repo.name}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {repo.language}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            className="border border-gray-400"
                                            variant={"default"}
                                            onClick={() =>
                                                handleImportClick(repo)
                                            }
                                        >
                                            Import
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-gray-600 mt-4 dark:text-gray-400">
                                <p>Import Third-Party Git Repository →</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DialogBar open={isOpen} setOpen={setIsOpen} data={dialogData} />
        </div>
    );
};

export default CreateProject;
