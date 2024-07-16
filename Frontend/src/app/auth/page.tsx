"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/ui/Footer";
import AuthProvider from "./authProvider";
import Email from "./email";
import SignUp from "./signup";
import Navbar from "@/components/Navbar";

type Props = {};

const Page = (props: Props) => {
    const [varriant, setVarriant] = useState<string | undefined>(
        "authProvider"
    );

    useEffect(() => {}, [varriant]);

    return (
        <div className="">
            <Navbar />
            {varriant === "authProvider" ? (
                <AuthProvider setVarriant={setVarriant} />
            ) : varriant === "signup" ? (
                <SignUp setVarriant={setVarriant} />
            ) : (
                <Email setVarriant={setVarriant} />
            )}
        </div>
    );
};

export default Page;
