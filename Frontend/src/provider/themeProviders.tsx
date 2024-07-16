/** @format */

// app/providers.jsx

"use client";

import { ThemeProvider } from "next-themes";

export function ThemeProviders({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
