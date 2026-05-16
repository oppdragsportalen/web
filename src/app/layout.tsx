import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { Navbar } from "./components/navbar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Oppdragsportalen",
  description: "Digital løsning for oppdragsbestilling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="antialiased h-screen flex flex-col">
        <ThemeProvider attribute="class">
          <Theme
            appearance="inherit"
            accentColor="green"
            className="h-full flex flex-col"
            radius="large"
          >
            {/*<Navbar />*/}
            <div className="flex-1 overflow-scroll">{children}</div>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
