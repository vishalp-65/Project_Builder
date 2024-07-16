"use client";
import ProjectSection from "@/components/ProjectSection";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.replace("/auth");
        }
    }, [sessionStatus, router]);

    if (sessionStatus === "loading") {
        return (
            <div className="flex items-center justify-center text-xl h-screen w-full">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <ProjectSection />
        </div>
    );
}
