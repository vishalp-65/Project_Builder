import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getServerSession } from "next-auth";
import SessionProvider from "@/utils/SessionProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProviders } from "@/provider/themeProviders";
import Header from "@/components/Header";
import Footer from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Project Builder",
    description: "A app which build and deploy your app using AWS",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    console.log("Session", session);

    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider session={session}>
                    <ThemeProviders>
                        <Header />
                        {children}
                        <Footer />
                        <Toaster />
                    </ThemeProviders>
                </SessionProvider>
            </body>
        </html>
    );
}
