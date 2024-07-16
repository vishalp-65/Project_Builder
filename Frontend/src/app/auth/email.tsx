import React, { ChangeEvent, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/config/axiosInstance";

interface Props {
    setVarriant: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface UserData {
    email: string;
    password: string;
}

const Email: React.FC<Props> = ({ setVarriant }) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData>({
        email: "",
        password: "",
    });

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (!userData.email || !userData.password) {
            toast.error("All fields required");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post("auth/login", userData);

            const data = response.data.data;
            localStorage.setItem("vercel_token", JSON.stringify(data.token));

            toast.success("Logged in");
            router.push("/");
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
        setIsLoading(false);
    }

    const toggleVariant = useCallback((val: string) => {
        setVarriant(val);
    }, []);

    return (
        <div className="h-[400px] mt-10 flex flex-col items-center gap-3 justify-center">
            <p className="text-3xl font-bold">Log in to Vercel</p>

            <form
                className="mt-5 flex flex-col gap-3 justify-center items-center"
                onSubmit={onSubmit}
            >
                <Input
                    name="email"
                    className="mb-3"
                    placeholder="Email address"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                />
                <Input
                    name="password"
                    className="mb-3"
                    placeholder="Password"
                    type="password"
                    value={userData.password}
                    onChange={handleInputChange}
                />

                <Button
                    className="border border-gray-400"
                    variant={"default"}
                    size={"xl"}
                    disabled={isLoading}
                >
                    <CiMail className="mr-3 h-5 w-5" />
                    <p className="text-base">Continue with Email</p>
                </Button>

                <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => toggleVariant("authProvider")}
                >
                    <p className="text-base mt-3 underline text-blue-700">
                        Log in with GitHub
                    </p>
                    <FaArrowRight className="mt-3 mr-3 text-blue-700" />
                </div>
            </form>
        </div>
    );
};

export default Email;
