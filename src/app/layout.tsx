import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { Navbar } from "./components/navbar";

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased h-screen flex flex-col">
        <ThemeProvider attribute="class">
          <Theme
            appearance="inherit"
            accentColor="green"
            className="h-full flex flex-col"
          >
            <Navbar />
            <div className="flex-1 overflow-scroll">{children}</div>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
