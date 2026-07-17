import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { Navbar } from "./components/navbar";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Oppdragsportalen",
  description: "Open-source assignment management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body className="antialiased h-dvh flex flex-col">
        <ThemeProvider attribute="class">
          <Theme
            appearance="inherit"
            accentColor="green"
            className="radix-themes h-full flex flex-col"
            radius="large"
          >
            {/*<Navbar />*/}
            <div className="flex-1 overflow-auto">{children}</div>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
