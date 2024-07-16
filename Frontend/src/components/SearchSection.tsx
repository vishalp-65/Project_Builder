/** @format */

import { Search } from "lucide-react";
import React, { useCallback } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BiChevronDown } from "react-icons/bi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
    setCurrSection: React.Dispatch<React.SetStateAction<string>>;
}

const SearchSection: React.FC<Props> = ({ setCurrSection }) => {
    const toggleVariant = useCallback((val: string) => {
        setCurrSection(val);
    }, []);

    return (
        <div className=" flex gap-3 w-full ">
            <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
                <Input
                    placeholder="Search Repositories and Projects..."
                    className="pl-8 w-full bg-inherit"
                />
            </div>

            <Button className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between">
                        <span>Add New... </span>
                        <BiChevronDown className="text-xl" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => toggleVariant("create_project")}
                        >
                            Create project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => toggleVariant("allproject")}
                        >
                            All projects
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            Domain
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Button>
        </div>
    );
};

export default SearchSection;
