"use client";
import React, { useCallback, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import axiosInstance from "@/config/axiosInstance";

interface Props {
    setVarriant: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface UserData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC<Props> = ({ setVarriant }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sendOTP, setSendOTP] = useState<boolean>(false);
    const [otp, setOTP] = useState<string>("");
    const [userData, setUserData] = useState<UserData>({
        name: "",
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

    async function sendOtp(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (!userData.name || !userData.email || !userData.password) {
            toast.error("All fields required");
            return;
        }

        try {
            const response = await axiosInstance.post("auth/sendotp", {
                email: userData.email,
            });
            console.log("otp response", response);
            toast.success("OTP sent");
            setSendOTP(true);
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
            console.log("Error while sending OTP");
        }
        setIsLoading(false);
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (!userData.name || !userData.email || !userData.password || !otp) {
            toast.error("All fields required");
            return;
        }

        try {
            const response = await axiosInstance.post("auth/signup", {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                otp: otp,
            });
            console.log("response", response);
            toast.success("User created");
            setVarriant("email");
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
        setIsLoading(false);
    }

    const toggleVariant = useCallback(() => {
        setVarriant((currentVariant) =>
            currentVariant === "email" ? "authProvider" : "email"
        );
    }, []);

    return (
        <div className="h-[400px] my-10 flex flex-col items-center gap-3 justify-center">
            <p className="text-3xl font-bold">
                {!sendOTP ? "Sign up to Vercel" : "Enter your OTP"}
            </p>

            <form
                className="mt-5 flex flex-col gap-3 justify-center items-center"
                onSubmit={!sendOTP ? sendOtp : onSubmit}
            >
                {!sendOTP ? (
                    <>
                        <Input
                            name="name"
                            className="mb-3"
                            placeholder="Name"
                            type="text"
                            value={userData.name}
                            onChange={handleInputChange}
                        />
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
                    </>
                ) : (
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <InputOTP
                            maxLength={6}
                            className="my-5"
                            value={otp}
                            onChange={(value) => setOTP(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <p className="text-gray-300 mb-5">
                            Please enter the one-time password sent to your
                            email.
                        </p>
                    </div>
                )}
                <Button
                    className="border border-gray-400"
                    variant={"default"}
                    size={"xl"}
                    disabled={isLoading}
                >
                    <CiMail className="mr-3 h-5 w-5" />
                    <p className="text-base">
                        {!sendOTP
                            ? "Create your vercel account"
                            : "Enter your OTP and continue"}
                    </p>
                </Button>
                <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={toggleVariant}
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

export default SignUp;
